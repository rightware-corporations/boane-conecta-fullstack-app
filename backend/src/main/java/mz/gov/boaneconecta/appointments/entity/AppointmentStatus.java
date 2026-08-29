package mz.gov.boaneconecta.appointments.entity;

public enum AppointmentStatus {
    /** Legacy pre-F5 value retained only for migration compatibility. */
    SCHEDULED,
    CONFIRMED,
    CHECKED_IN,
    WAITING,
    CALLED,
    IN_SERVICE,
    CANCELLED,
    COMPLETED,
    NO_SHOW,
    EXPIRED
}
