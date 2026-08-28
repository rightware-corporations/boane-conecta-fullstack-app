package mz.gov.boaneconecta.appointments.dto;
import java.time.LocalDate;
public record SlotMaterializationResponse(LocalDate from, LocalDate to, int created, int existing) {}
