//package MaintanceErrorReportingSystem.controller;
//import MaintanceErrorReportingSystem.entity.User;
//import MaintanceErrorReportingSystem.entity.UserRole;
//import MaintanceErrorReportingSystem.service.UserService;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//@RequestMapping("/dashboard")
//public class DashBoardController {
//
//    private final UserService userService;
//
//    public DashBoardController(UserService userService) {
//        this.userService = userService;
//    }
//
//    @GetMapping
//    public String getDashboard(@AuthenticationPrincipal User user) {
//        // Itt a user objektum tartalmazza a bejelentkezett felhasználó adatait
//        if (user.getRole() == UserRole.ADMIN) {
//            return "admin_dashboard"; // Admin dashboard
//        } else if (user.getRole() == UserRole.OPERATOR) {
//            return "operator_dashboard"; // Operator dashboard
//        } else if (user.getRole() == UserRole.MECHANIC) {
//            return "mechanic_dashboard"; // Mechanic dashboard
//        } else {
//            return "default_dashboard"; // Alapértelmezett dashboard
//        }
//    }
//}
