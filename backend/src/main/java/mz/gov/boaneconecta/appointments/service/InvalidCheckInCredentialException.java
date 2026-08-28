package mz.gov.boaneconecta.appointments.service;

import mz.gov.boaneconecta.core.exception.ResourceConflictException;

public class InvalidCheckInCredentialException extends ResourceConflictException {
    public InvalidCheckInCredentialException(String message) { super(message); }
}
