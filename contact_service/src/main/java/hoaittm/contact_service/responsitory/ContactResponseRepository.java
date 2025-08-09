package hoaittm.contact_service.responsitory;

import org.springframework.data.jpa.repository.JpaRepository;

import hoaittm.contact_service.entity.ContactResponse;

public interface ContactResponseRepository extends JpaRepository<ContactResponse, Long> {
}