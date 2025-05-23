// src/main/java/com/yourcompany/yourapp/service/DeviceService.java
// Hozd létre ezt a fájlt a backend projektedben, pl. egy 'service' mappában

package MaintanceErrorReportingSystem.service;

import MaintanceErrorReportingSystem.entity.Device;
import MaintanceErrorReportingSystem.entity.DeviceStatus;
import MaintanceErrorReportingSystem.repository.DeviceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeviceService {

    private final DeviceRepository deviceRepository;

    public DeviceService(DeviceRepository deviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public List<Device> getAllDevices() {
        return deviceRepository.findAll();
    }

    public Optional<Device> getDeviceById(Long id) {
        return deviceRepository.findById(id);
    }


    public Device saveDevice(Device device) {
        return deviceRepository.save(device);
    }

    public Optional<Device> updateDeviceStatus(Long deviceId, DeviceStatus newStatus) {
        Optional<Device> optionalDevice = deviceRepository.findById(deviceId);
        if (optionalDevice.isPresent()) {
            Device device = optionalDevice.get();
            device.setStatus(newStatus);
            return Optional.of(deviceRepository.save(device));
        }
        return Optional.empty();
    }
}