//package MaintanceErrorReportingSystem.util;
//
//import MaintanceErrorReportingSystem.entity.Device;
//import MaintanceErrorReportingSystem.entity.DeviceStatus;
//import MaintanceErrorReportingSystem.repository.DeviceRepository;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.stereotype.Component;
//import org.springframework.beans.factory.annotation.Autowired;
//
//@Component
//public class DataLoader implements CommandLineRunner {
//
//    private final DeviceRepository deviceRepository;
//
//    // Konstruktor injektálás
//    public DataLoader(DeviceRepository deviceRepository) {
//        this.deviceRepository = deviceRepository;
//    }
//
//    @Override
//    public void run(String... args) throws Exception {
//
//        if (deviceRepository.count() == 0) {
//            System.out.println("No devices found in database. Loading dummy devices...");
//
//            deviceRepository.save(new Device("CNC Machine Alpha", "Production Hall A", DeviceStatus.OPERATIONAL));
//            deviceRepository.save(new Device("Laser Cutter Beta", "Workshop B", DeviceStatus.REPORTED_ISSUE));
//            deviceRepository.save(new Device("3D Printer Gamma", "R&D Lab", DeviceStatus.OPERATIONAL));
//            deviceRepository.save(new Device("Assembly Robot Delta", "Production Hall A", DeviceStatus.IN_MAINTENANCE));
//            deviceRepository.save(new Device("Quality Sensor Epsilon", "Testing Area", DeviceStatus.OPERATIONAL));
//            deviceRepository.save(new Device("Welding Robot Zeta", "Production Hall B", DeviceStatus.REPORTED_ISSUE));
//            deviceRepository.save(new Device("Painting Booth Eta", "Finishing Section", DeviceStatus.OPERATIONAL));
//            deviceRepository.save(new Device("Inspection Camera Theta", "Quality Control", DeviceStatus.OPERATIONAL));
//            deviceRepository.save(new Device("Conveyor System Iota", "Logistics Hub", DeviceStatus.IN_MAINTENANCE));
//            deviceRepository.save(new Device("Packaging Machine Kappa", "Shipping Dept", DeviceStatus.OPERATIONAL));
//
//            System.out.println("10 dummy devices successfully loaded into the database.");
//        } else {
//            System.out.println("Devices already exist in database. Skipping dummy data loading.");
//        }
//    }
//}