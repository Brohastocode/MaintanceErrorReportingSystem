package MaintanceErrorReportingSystem.service;

import MaintanceErrorReportingSystem.entity.ErrorReport;
import java.util.List;
import java.util.Optional;

public interface ErrorReportService {
    ErrorReport createReport(ErrorReport report);
    List<ErrorReport> findAll();
    Optional<ErrorReport> findById(Long id);
    List<ErrorReport> findOpenReports();
    ErrorReport closeReport(Long id, String resolverNote);
}
