package MaintanceErrorReportingSystem.controller;

import MaintanceErrorReportingSystem.dto.CloseReportRequest;
import MaintanceErrorReportingSystem.entity.Device; // Device entitás
import MaintanceErrorReportingSystem.entity.ErrorReport; // ErrorReport entitás
import MaintanceErrorReportingSystem.entity.ReportStatus; // ReportStatus enum
import MaintanceErrorReportingSystem.service.ErrorReportService; // ErrorReportService
import MaintanceErrorReportingSystem.service.DeviceService; // DeviceService (a készülék lekéréséhez)
import MaintanceErrorReportingSystem.service.CustomUserDetailsService; // A felhasználó lekéréséhez
import MaintanceErrorReportingSystem.entity.User; // User entitás

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:4200") // CORS beállítás
@RequiredArgsConstructor
public class ErrorReportController {

    private final ErrorReportService errorReportService;
    private final DeviceService deviceService; // Szükségünk van rá a gép lekéréséhez
    private final CustomUserDetailsService userDetailsService; // Szükségünk van rá a felhasználó lekéréséhez

    @PostMapping
    @PreAuthorize("hasRole('OPERATOR')")
    public ResponseEntity<ErrorReport> createReport(@RequestBody ErrorReport report) {
        Optional<Device> deviceOptional = deviceService.getDeviceById(report.getDevice().getId());
        if (deviceOptional.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        report.setDevice(deviceOptional.get());

        // A bejelentkezett felhasználó beállítása reportedBy-ként
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            User currentUser = (User)userDetailsService.loadUserByUsername(userDetails.getUsername());
            report.setReportedBy(currentUser);
        } else {
            return ResponseEntity.status(401).build();
        }

        ErrorReport createdReport = errorReportService.createReport(report);
        return ResponseEntity.ok(createdReport);
    }

    @GetMapping
    @PreAuthorize("hasRole('MECHANIC')")
    public ResponseEntity<List<ErrorReport>> getAllReports() {
        List<ErrorReport> reports = errorReportService.findAll();
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/open")
    @PreAuthorize("hasRole('MECHANIC')")
    public ResponseEntity<List<ErrorReport>> getOpenReports() {
        List<ErrorReport> openReports = errorReportService.findOpenReports();
        return ResponseEntity.ok(openReports);
    }

    @PutMapping("/{id}/close")
    @PreAuthorize("hasRole('MECHANIC')")
    public ResponseEntity<ErrorReport> closeReport(@PathVariable Long id, @RequestBody(required = false) CloseReportRequest request) { // Módosított paraméter
        // A resolverNote opcionális, ha nincs megadva, akkor null lesz.
        String resolverNote = (request != null) ? request.getResolverNote() : null;

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User resolver = null;
        if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            resolver = (User) userDetailsService.loadUserByUsername(userDetails.getUsername());
        } else {
            return ResponseEntity.status(401).build(); // Nem bejelentkezett felhasználó
        }

        try {
            ErrorReport closedReport = errorReportService.closeReport(id, resolverNote, resolver);
            return ResponseEntity.ok(closedReport);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/latest")
    @PreAuthorize("hasRole('MECHANIC')")
    public ResponseEntity<ErrorReport> getLatestReports() {
        return errorReportService.findLatestErrorReport()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/device/{deviceId}") // Az új végpont!
    @PreAuthorize("hasAnyRole('MECHANIC', 'OPERATOR')") // Döntsd el, ki láthatja (mechanic biztosan)
    public ResponseEntity<ErrorReport> getReportByDeviceId(@PathVariable Long deviceId) {
        Optional<ErrorReport> report = errorReportService.findLatestOpenErrorReportByDeviceId(deviceId);

        return report.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
