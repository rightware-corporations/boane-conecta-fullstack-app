package mz.gov.boaneconecta.queue.dto;
import mz.gov.boaneconecta.queue.entity.*;
import java.util.*;
public record QueueAdminResponse(UUID id,String name,String locationCode,UUID departmentId,UUID serviceId,
        QueueMode mode,QueueStatus status,Long version,List<Desk> desks){
    public record Desk(UUID id,String code,String displayName,QueueDeskStatus status,UUID currentStaffUserId,Long version){}
}
