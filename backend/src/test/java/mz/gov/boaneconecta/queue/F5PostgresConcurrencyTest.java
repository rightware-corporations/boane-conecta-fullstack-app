package mz.gov.boaneconecta.queue;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.*;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.*;
import java.sql.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers(disabledWithoutDocker = true)
class F5PostgresConcurrencyTest {
    @Container static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:16-alpine");

    @BeforeAll static void migrate() {
        Flyway.configure().dataSource(POSTGRES.getJdbcUrl(),POSTGRES.getUsername(),POSTGRES.getPassword())
                .locations("classpath:db/migration").load().migrate();
    }

    @Test void exactlyOneCitizenWinsTheLastAvailableHold() throws Exception {
        Seed seed=seed(); CyclicBarrier barrier=new CyclicBarrier(2);
        List<Boolean> outcomes=parallel(
                ()->attemptLastHold(seed.slotId,seed.citizenA,barrier),
                ()->attemptLastHold(seed.slotId,seed.citizenB,barrier));
        assertThat(outcomes).containsExactlyInAnyOrder(true,false);
        try(Connection c=connection();PreparedStatement p=c.prepareStatement(
                "SELECT COUNT(*) FROM appointment_holds WHERE slot_id=? AND status='ACTIVE'")){
            p.setObject(1,seed.slotId);try(ResultSet r=p.executeQuery()){r.next();assertThat(r.getInt(1)).isEqualTo(1);}}
    }

    @Test void twoDesksNeverCallTheSameWaitingTicket() throws Exception {
        Seed seed=seed(); UUID first=insertTicket(seed,1),second=insertTicket(seed,2); CyclicBarrier barrier=new CyclicBarrier(2);
        List<UUID> selected=parallel(()->callNext(seed.queueId,barrier),()->callNext(seed.queueId,barrier));
        assertThat(selected).containsExactlyInAnyOrder(first,second).doesNotHaveDuplicates();
    }

    @Test void queueSequenceAllocationIsUniqueUnderConcurrency() throws Exception {
        Seed seed=seed(); CyclicBarrier barrier=new CyclicBarrier(2);
        List<Integer> values=parallel(()->allocate(seed.queueId,barrier),()->allocate(seed.queueId,barrier));
        assertThat(values).containsExactlyInAnyOrder(1,2).doesNotHaveDuplicates();
    }

    private boolean attemptLastHold(UUID slotId,UUID citizenId,CyclicBarrier barrier)throws Exception{
        try(Connection c=connection()){c.setAutoCommit(false);barrier.await();
            try(PreparedStatement lock=c.prepareStatement("SELECT id FROM appointment_slots WHERE id=? FOR UPDATE")){lock.setObject(1,slotId);lock.executeQuery().close();}
            int used;try(PreparedStatement count=c.prepareStatement("SELECT COUNT(*) FROM appointment_holds WHERE slot_id=? AND status='ACTIVE' AND expires_at>NOW()")){
                count.setObject(1,slotId);try(ResultSet r=count.executeQuery()){r.next();used=r.getInt(1);}}
            if(used>=1){c.commit();return false;}
            try(PreparedStatement insert=c.prepareStatement("INSERT INTO appointment_holds(id,slot_id,citizen_user_id,token_hash,request_fingerprint,status,expires_at) VALUES (?,?,?,?,?,'ACTIVE',NOW()+INTERVAL '10 minutes')")){
                insert.setObject(1,UUID.randomUUID());insert.setObject(2,slotId);insert.setObject(3,citizenId);
                insert.setString(4,hex(UUID.randomUUID()));insert.setString(5,hex(UUID.randomUUID()));insert.executeUpdate();}
            c.commit();return true;}
    }
    private UUID callNext(UUID queueId,CyclicBarrier barrier)throws Exception{
        try(Connection c=connection()){c.setAutoCommit(false);barrier.await();UUID id;
            try(PreparedStatement p=c.prepareStatement("SELECT id FROM queue_tickets WHERE queue_id=? AND business_date=CURRENT_DATE AND status='WAITING' ORDER BY sequence_number FOR UPDATE SKIP LOCKED LIMIT 1")){
                p.setObject(1,queueId);try(ResultSet r=p.executeQuery()){assertThat(r.next()).isTrue();id=(UUID)r.getObject(1);}}
            try(PreparedStatement p=c.prepareStatement("UPDATE queue_tickets SET status='CALLED',called_at=NOW() WHERE id=?")){p.setObject(1,id);p.executeUpdate();}
            c.commit();return id;}
    }
    private int allocate(UUID queueId,CyclicBarrier barrier)throws Exception{
        try(Connection c=connection()){c.setAutoCommit(false);barrier.await();int value;
            try(PreparedStatement p=c.prepareStatement("INSERT INTO queue_sequence_counters(queue_id,business_date,next_value) VALUES (?,CURRENT_DATE,2) ON CONFLICT(queue_id,business_date) DO UPDATE SET next_value=queue_sequence_counters.next_value+1 RETURNING next_value-1")){
                p.setObject(1,queueId);try(ResultSet r=p.executeQuery()){r.next();value=r.getInt(1);}}
            c.commit();return value;}
    }
    private Seed seed()throws Exception{
        UUID dep=UUID.randomUUID(),service=UUID.randomUUID(),a=UUID.randomUUID(),b=UUID.randomUUID(),slot=UUID.randomUUID(),queue=UUID.randomUUID();
        try(Connection c=connection();Statement s=c.createStatement()){
            s.executeUpdate("INSERT INTO departments(id,name,slug) VALUES ('"+dep+"','Concurrency','concurrency-"+dep+"')");
            s.executeUpdate("INSERT INTO municipal_services(id,department_id,title,slug) VALUES ('"+service+"','"+dep+"','Service','service-"+service+"')");
            insertUser(c,a);insertUser(c,b);
            s.executeUpdate("INSERT INTO appointment_slots(id,department_id,service_id,location_name,location_code,start_time,end_time,capacity,status) VALUES ('"+slot+"','"+dep+"','"+service+"','Boane','BOANE',NOW()+INTERVAL '1 day',NOW()+INTERVAL '1 day 1 hour',1,'AVAILABLE')");
            s.executeUpdate("INSERT INTO queues(id,name,location_code,department_id,service_id,mode,status) VALUES ('"+queue+"','Queue','BOANE','"+dep+"','"+service+"','APPOINTMENT_REQUIRED','OPEN')");}
        return new Seed(dep,a,b,slot,queue);
    }
    private void insertUser(Connection c,UUID id)throws SQLException{try(PreparedStatement p=c.prepareStatement("INSERT INTO users(id,full_name,email,password_hash) VALUES (?,?,?,?)")){
        p.setObject(1,id);p.setString(2,"Citizen");p.setString(3,id+"@example.com");p.setString(4,"not-a-real-password");p.executeUpdate();}}
    private UUID insertTicket(Seed seed,int sequence)throws SQLException{UUID id=UUID.randomUUID();try(Connection c=connection();PreparedStatement p=c.prepareStatement(
            "INSERT INTO queue_tickets(id,ticket_number,queue_id,business_date,department_id,status,sequence_number,priority_class) VALUES (?,?,?,CURRENT_DATE,?,'WAITING',?,'NORMAL')")){
        p.setObject(1,id);p.setString(2,"A00"+sequence);p.setObject(3,seed.queueId);p.setObject(4,seed.departmentId);p.setInt(5,sequence);p.executeUpdate();}return id;}
    private Connection connection()throws SQLException{return DriverManager.getConnection(POSTGRES.getJdbcUrl(),POSTGRES.getUsername(),POSTGRES.getPassword());}
    @SafeVarargs private final <T> List<T> parallel(Callable<T>...tasks)throws Exception{try(ExecutorService pool=Executors.newFixedThreadPool(tasks.length)){
        List<Future<T>> futures=new ArrayList<>();for(Callable<T> task:tasks)futures.add(pool.submit(task));List<T> values=new ArrayList<>();for(Future<T> f:futures)values.add(f.get(20,TimeUnit.SECONDS));return values;}}
    private String hex(UUID value){return value.toString().replace("-","")+value.toString().replace("-","");}
    private record Seed(UUID departmentId,UUID citizenA,UUID citizenB,UUID slotId,UUID queueId){}
}
