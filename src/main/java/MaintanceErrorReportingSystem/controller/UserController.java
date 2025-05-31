package MaintanceErrorReportingSystem.controller;
import MaintanceErrorReportingSystem.entity.User;
import MaintanceErrorReportingSystem.entity.UserRole;
import MaintanceErrorReportingSystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Összes felhasználó lekérdezése
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAll());
    }

    // Egy felhasználó lekérdezése ID alapján
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return userService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Új felhasználó létrehozása
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.save(user));
    }

    // Felhasználó módosítása
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        return userService.findById(id).map(user -> {
            user.setUsername(updatedUser.getUsername());
            user.setPassword(updatedUser.getPassword());
            user.setUserRole(updatedUser.getUserRole());
            return ResponseEntity.ok(userService.save(user));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/role") // /api/users/{id}/role
    @PreAuthorize("hasRole('ADMIN')") // Csak adminok módosíthatják a szerepköröket
    public ResponseEntity<User> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String newRoleString = payload.get("role");
        if (newRoleString == null || newRoleString.isEmpty()) {
            return ResponseEntity.badRequest().body(null);
        }
        try {
            UserRole newRole = UserRole.valueOf(newRoleString.toUpperCase()); // .toUpperCase() hogy ne számítson a kis/nagybetű
            User updatedUser = userService.updateUserRole(id, newRole); // Hívjuk az új service metódust
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            // Akkor dobódik, ha a newRoleString nem egyezik meg egyetlen UserRole enum értékkel sem
            System.err.println("Invalid role provided: " + newRoleString + " - " + e.getMessage());
            return ResponseEntity.badRequest().body(null); // Érvénytelen szerepkör
        } catch (Exception e) {
            System.err.println("Error updating user role: " + e.getMessage());
            return ResponseEntity.internalServerError().body(null); // Egyéb szerveroldali hiba
        }
    }

    // Felhasználó törlése
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}