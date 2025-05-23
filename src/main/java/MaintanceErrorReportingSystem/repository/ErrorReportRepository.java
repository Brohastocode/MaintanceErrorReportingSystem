package MaintanceErrorReportingSystem.repository;

import MaintanceErrorReportingSystem.entity.ErrorReport;
import MaintanceErrorReportingSystem.entity.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ErrorReportRepository extends JpaRepository<ErrorReport, Long> {

    List<ErrorReport> findByStatus(ReportStatus status);
}