package MaintanceErrorReportingSystem.dto;

import MaintanceErrorReportingSystem.entity.MachineStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MachineDTO {

    private Long id;
    private String code; // Pl. EQ-001
    private String description;
    private MachineStatus status; // A gép státusza (pl. Zöld = működik, Piros = hibás)

}
