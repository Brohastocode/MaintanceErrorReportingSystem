package MaintanceErrorReportingSystem.controller;

import MaintanceErrorReportingSystem.dto.MachineDTO;
import MaintanceErrorReportingSystem.entity.Machine;
import MaintanceErrorReportingSystem.service.MachineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/machines")
@RequiredArgsConstructor
public class MachineController {

    private final MachineService machineService;

    // Lista lekérése
    @GetMapping
    public ResponseEntity<List<MachineDTO>> getAllMachines() {
        List<MachineDTO> machines = machineService.findAllMachines();
        return new ResponseEntity<>(machines, HttpStatus.OK);
    }

    // Egy gép lekérése
    @GetMapping("/{id}")
    public ResponseEntity<MachineDTO> getMachineById(@PathVariable Long id) {
        Optional<MachineDTO> machine = machineService.findMachineById(id);
        return machine.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Gép létrehozása
    @PostMapping
    public ResponseEntity<MachineDTO> createMachine(@RequestBody MachineDTO machineDTO) {
        MachineDTO createdMachine = machineService.createMachine(machineDTO);
        return new ResponseEntity<>(createdMachine, HttpStatus.CREATED);
    }

    // Gép módosítása
    @PutMapping("/{id}")
    public ResponseEntity<MachineDTO> updateMachine(@PathVariable Long id, @RequestBody MachineDTO machineDTO) {
        MachineDTO updatedMachine = machineService.updateMachine(id, machineDTO);
        return new ResponseEntity<>(updatedMachine, HttpStatus.OK);
    }

    // Gép törlése
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMachine(@PathVariable Long id) {
        machineService.deleteMachine(id);
        return ResponseEntity.noContent().build();
    }
}

