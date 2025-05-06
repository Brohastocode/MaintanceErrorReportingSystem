package MaintanceErrorReportingSystem.exceptions;


public class MachineAlreadyExists extends RuntimeException {
    public MachineAlreadyExists(String code) {
        super("Machine with code '" + code + "' already exists.");
    }
}

