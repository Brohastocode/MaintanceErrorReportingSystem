//package MaintanceErrorReportingSystem.startup;
//
//import MaintanceErrorReportingSystem.entity.User;
//import MaintanceErrorReportingSystem.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.crypto.password.PasswordEncoder;
//
//@Configuration
//@RequiredArgsConstructor
//public class DataInitializer {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    @Bean
//    public CommandLineRunner loadDefaultUser() {
//        return args -> {
//            if (userRepository.findByUsername("admin").isEmpty()) {
//                User user = new User();
//                user.setUsername("admin");
//                user.setPassword(passwordEncoder.encode("admin123"));
//                userRepository.save(user);
//            }
//        };
//    }
//}
