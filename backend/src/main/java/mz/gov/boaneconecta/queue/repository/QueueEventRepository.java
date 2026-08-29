package mz.gov.boaneconecta.queue.repository;
import mz.gov.boaneconecta.queue.entity.QueueEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
public interface QueueEventRepository extends JpaRepository<QueueEvent, UUID> {}
