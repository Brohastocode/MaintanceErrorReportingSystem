package MaintanceErrorReportingSystem.repository;

import MaintanceErrorReportingSystem.entity.ErrorReport;
import MaintanceErrorReportingSystem.entity.ReportStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ErrorReportRepository extends JpaRepository<ErrorReport, Long> {

    List<ErrorReport> findByStatus(ReportStatus status);

    Optional<ErrorReport> findTopByOrderByReportedAtDesc();

    Optional<ErrorReport> findTopByDeviceIdAndStatusOrderByReportedAtDesc(Long deviceId, ReportStatus status);
}