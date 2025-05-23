package MaintanceErrorReportingSystem.service;
import MaintanceErrorReportingSystem.dto.DeviceDTO;
import java.util.List;
import java.util.Optional;
public interface MachineService {

    List<DeviceDTO> findAllMachines();
    Optional<DeviceDTO> findMachineById(Long id);
    DeviceDTO createMachine(DeviceDTO machineDTO);
    DeviceDTO updateMachine(Long id, DeviceDTO machineDTO);
    void deleteMachine(Long id);
}
