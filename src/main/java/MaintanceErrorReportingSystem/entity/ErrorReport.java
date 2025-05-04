package MaintanceErrorReportingSystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "error_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "machine_id")
    private Machine machine;

    @ManyToOne(optional = false)
    @JoinColumn(name = "reported_by_id")
    private User reportedBy;

    @ManyToOne
    @JoinColumn(name = "resolved_by_id")
    private User resolvedBy;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Setter
    private LocalDateTime reportedAt;

    @Setter
    private String resolverNote;

    private LocalDateTime resolvedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status;
}
