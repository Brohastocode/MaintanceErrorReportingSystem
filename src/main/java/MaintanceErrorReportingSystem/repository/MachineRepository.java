package MaintanceErrorReportingSystem.repository;

import MaintanceErrorReportingSystem.entity.Machine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {

    Optional<Machine> findByCode(String code);

}
