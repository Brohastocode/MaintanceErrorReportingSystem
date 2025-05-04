package MaintanceErrorReportingSystem.service;

import MaintanceErrorReportingSystem.dto.MachineDTO;
import MaintanceErrorReportingSystem.entity.Machine;
import MaintanceErrorReportingSystem.repository.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MachineServiceImpl implements MachineService {

    private final MachineRepository machineRepository;

    // DTO -> Entity
    private Machine convertToEntity(MachineDTO machineDTO) {
        return Machine.builder()
                .id(machineDTO.getId())
                .code(machineDTO.getCode())
                .description(machineDTO.getDescription())
                .status(machineDTO.getStatus())
                .build();
    }

    // Entity -> DTO
    private MachineDTO convertToDTO(Machine machine) {
        return MachineDTO.builder()
                .id(machine.getId())
                .code(machine.getCode())
                .description(machine.getDescription())
                .status(machine.getStatus())
                .build();
    }

    @Override
    public List<MachineDTO> findAllMachines() {
        List<Machine> machines = machineRepository.findAll();
        return machines.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<MachineDTO> findMachineById(Long id) {
        Optional<Machine> machine = machineRepository.findById(id);
        return machine.map(this::convertToDTO);
    }

    @Override
    public MachineDTO createMachine(MachineDTO machineDTO) {
        Machine machine = convertToEntity(machineDTO);
        Machine savedMachine = machineRepository.save(machine);
        return convertToDTO(savedMachine);
    }

    @Override
    public MachineDTO updateMachine(Long id, MachineDTO machineDTO) {
        Optional<Machine> existingMachineOpt = machineRepository.findById(id);
        if (existingMachineOpt.isPresent()) {
            Machine existingMachine = existingMachineOpt.get();
            existingMachine.setCode(machineDTO.getCode());
            existingMachine.setDescription(machineDTO.getDescription());
            existingMachine.setStatus(machineDTO.getStatus());
            Machine updatedMachine = machineRepository.save(existingMachine);
            return convertToDTO(updatedMachine);
        } else {
            // Handle machine not found case (optional)
            return null;  // or throw exception
        }
    }

    @Override
    public void deleteMachine(Long id) {
        machineRepository.deleteById(id);
    }
}
