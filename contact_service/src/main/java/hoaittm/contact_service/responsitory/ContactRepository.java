package hoaittm.contact_service.responsitory;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import hoaittm.contact_service.entity.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByEmailOrderBySubmittedAtDesc(String email);

    List<Contact> findAllByOrderBySubmittedAtDesc();
}
