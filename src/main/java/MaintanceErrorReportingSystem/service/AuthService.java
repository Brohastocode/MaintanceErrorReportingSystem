//package MaintanceErrorReportingSystem.service;
//
//import MaintanceErrorReportingSystem.dto.LoginRequestDTO;
//import MaintanceErrorReportingSystem.dto.LoginResponseDTO;
//import MaintanceErrorReportingSystem.entity.User;
//import MaintanceErrorReportingSystem.repository.UserRepository;
//import lombok.RequiredArgsConstructor;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class AuthService {
//
//    private final UserRepository userRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
//        User user = userRepository.findByUsername(loginRequest.getUsername())
//                .orElseThrow(() -> new RuntimeException("Nincs ilyen felhasználó"));
//
//        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
//            throw new RuntimeException("Hibás jelszó");
//        }
//
//        return new LoginResponseDTO("Sikeres bejelentkezés: " + user.getUsername());
//    }
//}
