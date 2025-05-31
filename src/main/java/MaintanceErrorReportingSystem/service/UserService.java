package MaintanceErrorReportingSystem.service;
import MaintanceErrorReportingSystem.entity.User;
import MaintanceErrorReportingSystem.entity.UserRole;

import java.util.List;
import java.util.Optional;

public interface UserService {
    Optional<User> findByUsername(String username);
    User save(User user);
    List<User> findAll();
    Optional<User> findById(Long id);
    void deleteById(Long id);
    User updateUserRole(Long id, UserRole newRole);
}


