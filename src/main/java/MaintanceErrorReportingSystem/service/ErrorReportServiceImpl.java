package MaintanceErrorReportingSystem.service;
import MaintanceErrorReportingSystem.entity.ErrorReport;
import MaintanceErrorReportingSystem.entity.Machine;
import MaintanceErrorReportingSystem.entity.MachineStatus;
import MaintanceErrorReportingSystem.entity.ReportStatus;
import MaintanceErrorReportingSystem.repository.ErrorReportRepository;
import MaintanceErrorReportingSystem.repository.MachineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ErrorReportServiceImpl implements ErrorReportService {

    private final ErrorReportRepository errorReportRepository;
    private final MachineRepository machineRepository;

    @Override
    public ErrorReport createReport(ErrorReport report) {
        report.setReportedAt(LocalDateTime.now());
        report.setStatus(ReportStatus.OPEN);

        // A gép státuszát is pirosra állítjuk
        Machine machine = report.getMachine();
        machine.setStatus(MachineStatus.FAULTY);
        machineRepository.save(machine);

        return errorReportRepository.save(report);
    }

    @Override
    public List<ErrorReport> findAll() {
        return errorReportRepository.findAll();
    }

    @Override
    public Optional<ErrorReport> findById(Long id) {
        return errorReportRepository.findById(id);
    }

    @Override
    public List<ErrorReport> findOpenReports() {
        return errorReportRepository.findByStatus(ReportStatus.OPEN);
    }

    @Override
    public ErrorReport closeReport(Long id, String resolverNote) {
        ErrorReport report = errorReportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));

        report.setStatus(ReportStatus.CLOSED);
        report.setResolvedAt(LocalDateTime.now());
        report.setResolverNote(resolverNote);

        // Gépet zöldre állítjuk
        Machine machine = report.getMachine();
        machine.setStatus(MachineStatus.WORKING);
        machineRepository.save(machine);

        return errorReportRepository.save(report);
    }
}

