package mz.gov.boaneconecta.queue.service;

import mz.gov.boaneconecta.core.exception.*;
import mz.gov.boaneconecta.departments.entity.Department;
import mz.gov.boaneconecta.departments.repository.DepartmentRepository;
import mz.gov.boaneconecta.municipalservices.entity.MunicipalService;
import mz.gov.boaneconecta.municipalservices.repository.MunicipalServiceRepository;
import mz.gov.boaneconecta.queue.dto.*;
import mz.gov.boaneconecta.queue.entity.*;
import mz.gov.boaneconecta.queue.repository.*;
import mz.gov.boaneconecta.roles.entity.RoleName;
import mz.gov.boaneconecta.roles.entity.UserRole;
import mz.gov.boaneconecta.roles.repository.UserRoleRepository;
import mz.gov.boaneconecta.users.entity.User;
import mz.gov.boaneconecta.users.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class QueueAdministrationService {
    private static final Set<QueueTicketStatus> ACTIVE=EnumSet.of(QueueTicketStatus.WAITING,QueueTicketStatus.CALLED,QueueTicketStatus.SERVING);
    private final MunicipalQueueRepository queues; private final QueueDeskRepository desks;
    private final QueueTicketRepository tickets; private final DepartmentRepository departments;
    private final MunicipalServiceRepository services;
    private final QueueStaffScopeRepository staffScopes; private final UserRepository users; private final UserRoleRepository userRoles;
    public QueueAdministrationService(MunicipalQueueRepository queues,QueueDeskRepository desks,QueueTicketRepository tickets,
            DepartmentRepository departments,MunicipalServiceRepository services,QueueStaffScopeRepository staffScopes,
            UserRepository users,UserRoleRepository userRoles){this.queues=queues;this.desks=desks;this.tickets=tickets;
        this.departments=departments;this.services=services;this.staffScopes=staffScopes;this.users=users;this.userRoles=userRoles;}

    @Transactional(readOnly=true) public List<QueueAdminResponse> list(){return queues.findAll().stream().map(this::response).toList();}
    @Transactional(readOnly=true) public QueueAdminResponse get(UUID id){return response(queues.findById(id).orElseThrow(()->new ResourceNotFoundException("QUEUE_NOT_FOUND")));}
    @Transactional(readOnly=true) public List<QueueStaffOptionResponse> staffOptions(){Set<RoleName> operational=EnumSet.of(RoleName.SUPER_ADMIN,RoleName.ADMIN,RoleName.MANAGER,RoleName.EMPLOYEE);
        return userRoles.findAll().stream().filter(item->operational.contains(item.getRole().getName())).collect(java.util.stream.Collectors.groupingBy(UserRole::getUser))
                .entrySet().stream().map(entry->new QueueStaffOptionResponse(entry.getKey().getId(),entry.getKey().getFullName(),entry.getKey().getEmail(),
                        entry.getValue().stream().map(item->item.getRole().getName()).sorted().toList()))
                .sorted(Comparator.comparing(QueueStaffOptionResponse::fullName,String.CASE_INSENSITIVE_ORDER)).toList();}
    @Transactional public QueueAdminResponse create(CreateQueueRequest command){Department department=department(command.departmentId());
        MunicipalService service=service(command.serviceId());validateService(command.mode(),service,department);
        MunicipalQueue queue=queues.saveAndFlush(MunicipalQueue.builder().name(clean(command.name())).locationCode(code(command.locationCode()))
                .department(department).service(service).mode(command.mode()).status(QueueStatus.CLOSED).build());return response(queue);}
    @Transactional public QueueAdminResponse update(UUID id,long version,UpdateQueueRequest command){MunicipalQueue queue=locked(id);version(queue.getVersion(),version,"QUEUE_VERSION_MISMATCH");
        if(queue.getStatus()!=QueueStatus.CLOSED)throw new ResourceConflictException("QUEUE_MUST_BE_CLOSED_TO_EDIT_CONFIGURATION");
        Department department=department(command.departmentId());MunicipalService service=service(command.serviceId());validateService(command.mode(),service,department);
        queue.setName(clean(command.name()));queue.setLocationCode(code(command.locationCode()));queue.setDepartment(department);queue.setService(service);queue.setMode(command.mode());
        return response(queues.saveAndFlush(queue));}
    @Transactional public QueueAdminResponse changeStatus(UUID id,long version,QueueStatus target){MunicipalQueue queue=locked(id);version(queue.getVersion(),version,"QUEUE_VERSION_MISMATCH");
        if(queue.getStatus()==target)return response(queue);if(queue.getStatus()==QueueStatus.CLOSED&&target!=QueueStatus.OPEN)
            throw new ResourceConflictException("QUEUE_INVALID_STATUS_TRANSITION");if(target==QueueStatus.OPEN){validateService(queue.getMode(),queue.getService(),queue.getDepartment());
            if(desks.findByQueueOrderByCode(queue).isEmpty())throw new ResourceConflictException("QUEUE_REQUIRES_AT_LEAST_ONE_DESK");}
        if(target==QueueStatus.CLOSED&&tickets.existsByQueueAndStatusIn(queue,ACTIVE))throw new ResourceConflictException("QUEUE_HAS_ACTIVE_TICKETS");
        queue.setStatus(target);return response(queues.saveAndFlush(queue));}
    @Transactional public QueueAdminResponse createDesk(UUID queueId,CreateQueueDeskRequest command){MunicipalQueue queue=locked(queueId);
        if(queue.getStatus()!=QueueStatus.CLOSED)throw new ResourceConflictException("QUEUE_MUST_BE_CLOSED_TO_EDIT_DESKS");String code=code(command.code());
        if(desks.existsByQueueAndCodeIgnoreCase(queue,code))throw new ResourceConflictException("QUEUE_DESK_CODE_ALREADY_EXISTS");
        desks.saveAndFlush(QueueDesk.builder().queue(queue).code(code).displayName(clean(command.displayName())).status(QueueDeskStatus.CLOSED).build());return response(queue);}
    @Transactional public QueueAdminResponse updateDesk(UUID queueId,UUID deskId,long version,UpdateQueueDeskRequest command){MunicipalQueue queue=locked(queueId);
        if(queue.getStatus()!=QueueStatus.CLOSED)throw new ResourceConflictException("QUEUE_MUST_BE_CLOSED_TO_EDIT_DESKS");
        QueueDesk desk=desks.findByQueueForUpdate(queueId,deskId).orElseThrow(()->new ResourceNotFoundException("QUEUE_DESK_NOT_FOUND"));version(desk.getVersion(),version,"QUEUE_DESK_VERSION_MISMATCH");
        if(desk.getStatus()!=QueueDeskStatus.CLOSED||desk.getCurrentStaffUser()!=null)throw new ResourceConflictException("QUEUE_DESK_MUST_BE_CLOSED_TO_EDIT");String code=code(command.code());
        if(desks.existsByQueueAndCodeIgnoreCaseAndIdNot(queue,code,deskId))throw new ResourceConflictException("QUEUE_DESK_CODE_ALREADY_EXISTS");
        desk.setCode(code);desk.setDisplayName(clean(command.displayName()));desks.saveAndFlush(desk);return response(queue);}
    @Transactional public QueueAdminResponse assignStaff(UUID queueId,UUID userId){MunicipalQueue queue=locked(queueId);User staff=user(userId);requireOperationalRole(staff);
        if(!staffScopes.existsByQueueAndStaffUser(queue,staff))staffScopes.saveAndFlush(QueueStaffScope.builder().queue(queue).staffUser(staff).build());return response(queue);}
    @Transactional public QueueAdminResponse revokeStaff(UUID queueId,UUID userId){MunicipalQueue queue=locked(queueId);User staff=user(userId);
        if(desks.findByQueueOrderByCode(queue).stream().anyMatch(d->d.getCurrentStaffUser()!=null&&d.getCurrentStaffUser().getId().equals(userId)))
            throw new ResourceConflictException("QUEUE_STAFF_HAS_OPEN_DESK");
        staffScopes.findByQueueAndStaffUser(queue,staff).ifPresent(staffScopes::delete);staffScopes.flush();return response(queue);}
    private QueueAdminResponse response(MunicipalQueue queue){List<QueueAdminResponse.Desk> items=desks.findByQueueOrderByCode(queue).stream().map(d->new QueueAdminResponse.Desk(
            d.getId(),d.getCode(),d.getDisplayName(),d.getStatus(),d.getCurrentStaffUser()==null?null:d.getCurrentStaffUser().getId(),d.getVersion())).toList();return new QueueAdminResponse(
            queue.getId(),queue.getName(),queue.getLocationCode(),queue.getDepartment().getId(),queue.getService()==null?null:queue.getService().getId(),queue.getMode(),queue.getStatus(),queue.getVersion(),items,
            staffScopes.findByQueueOrderByCreatedAtAsc(queue).stream().map(scope->scope.getStaffUser().getId()).toList());}
    private MunicipalQueue locked(UUID id){return queues.findByIdForUpdate(id).orElseThrow(()->new ResourceNotFoundException("QUEUE_NOT_FOUND"));}
    private Department department(UUID id){return departments.findById(id).orElseThrow(()->new ResourceNotFoundException("DEPARTMENT_NOT_FOUND"));}
    private MunicipalService service(UUID id){return id==null?null:services.findById(id).orElseThrow(()->new ResourceNotFoundException("SERVICE_NOT_FOUND"));}
    private User user(UUID id){return users.findById(id).orElseThrow(()->new ResourceNotFoundException("USER_NOT_FOUND"));}
    private void requireOperationalRole(User user){boolean allowed=userRoles.findByUser(user).stream().anyMatch(item->EnumSet.of(RoleName.SUPER_ADMIN,RoleName.ADMIN,RoleName.MANAGER,RoleName.EMPLOYEE).contains(item.getRole().getName()));
        if(!allowed)throw new ResourceConflictException("QUEUE_STAFF_OPERATIONAL_ROLE_REQUIRED");}
    private void validateService(QueueMode mode,MunicipalService service,Department department){if(mode!=QueueMode.WALK_IN_ALLOWED&&service==null)throw new IllegalArgumentException("QUEUE_SERVICE_REQUIRED");
        if(service!=null&&service.getDepartment()!=null&&!service.getDepartment().getId().equals(department.getId()))throw new ResourceConflictException("QUEUE_SERVICE_DEPARTMENT_MISMATCH");}
    private void version(Long actual,long expected,String code){if(!Objects.equals(actual,expected))throw new ResourceConflictException(code);}
    private String clean(String value){return value.trim();}private String code(String value){return value.trim().toUpperCase(Locale.ROOT);}
}
