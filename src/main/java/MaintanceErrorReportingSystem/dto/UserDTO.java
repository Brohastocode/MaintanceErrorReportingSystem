package MaintanceErrorReportingSystem.dto;

import lombok.Data;

@Data
public class UserDTO {

    private Long id;
    private String username;
    private String role; // Esetleg egy ENUM alapján (pl. ROLE_OPERATOR, ROLE_MECHANIC)

}
