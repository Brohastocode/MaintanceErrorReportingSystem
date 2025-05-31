package MaintanceErrorReportingSystem.controller;

import MaintanceErrorReportingSystem.entity.Device;
import MaintanceErrorReportingSystem.entity.DeviceStatus;
import MaintanceErrorReportingSystem.service.DeviceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "http://localhost:4200")
public class DeviceController {

    private final DeviceService deviceService;

    public DeviceController(DeviceService deviceService) {
        this.deviceService = deviceService;
    }

    @GetMapping
    @PreAuthorize("hasRole('MECHANIC') or hasRole('OPERATOR') or hasRole ('ADMIN')")
    public ResponseEntity<List<Device>> getAllDevices() {
        List<Device> devices = deviceService.getAllDevices();
        return ResponseEntity.ok(devices);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('MECHANIC') or hasRole ('ADMIN')")
    public ResponseEntity<Device> updateDeviceStatus(
            @PathVariable Long id,
            @RequestParam DeviceStatus newStatus) { // A kérés URL-jéből olvassa ki az 'id'-t és a 'newStatus'-t
        Optional<Device> updatedDevice = deviceService.updateDeviceStatus(id, newStatus);
        if (updatedDevice.isPresent()) {
            return ResponseEntity.ok(updatedDevice.get()); // 200 OK és a frissített eszköz
        } else {
            return ResponseEntity.notFound().build(); // 404 Not Found, ha az eszköz nem található
        }
    }
}
