package mz.gov.boaneconecta.queue.dto;

import mz.gov.boaneconecta.roles.entity.RoleName;
import java.util.*;

public record QueueStaffOptionResponse(UUID id, String fullName, String email, List<RoleName> roles) {}
