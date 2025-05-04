package MaintanceErrorReportingSystem.service;
import MaintanceErrorReportingSystem.dto.MachineDTO;
import java.util.List;
import java.util.Optional;
public interface MachineService {

    List<MachineDTO> findAllMachines();
    Optional<MachineDTO> findMachineById(Long id);
    MachineDTO createMachine(MachineDTO machineDTO);
    MachineDTO updateMachine(Long id, MachineDTO machineDTO);
    void deleteMachine(Long id);
}
