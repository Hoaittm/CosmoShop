package hoaittm.contact_service.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import hoaittm.contact_service.entity.Contact;
import hoaittm.contact_service.entity.ContactResponse;
import hoaittm.contact_service.responsitory.ContactRepository;
import hoaittm.contact_service.responsitory.ContactResponseRepository;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    private final ContactRepository contactRepo;
    private final ContactResponseRepository responseRepo;

    @PostMapping("/feedback")
    public ResponseEntity<?> submitContact(@RequestBody Contact contact) {
        contact.setSubmittedAt(LocalDateTime.now());
        return ResponseEntity.ok(contactRepo.save(contact));
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserContacts(@RequestParam String email) {
        List<Contact> contacts = contactRepo.findByEmailOrderBySubmittedAtDesc(email);
        return ResponseEntity.ok(contacts);
    }

    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts() {
        List<Contact> contacts = contactRepo.findAllByOrderBySubmittedAtDesc();
        return ResponseEntity.ok(contacts);
    }

    @PostMapping("/admin/{id}/reply")
    public ResponseEntity<?> replyToContact(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        String reply = payload.get("reply");
        String adminName = payload.get("adminName");

        Contact contact = contactRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Contact not found"));

        ContactResponse cr = new ContactResponse();
        cr.setReply(reply);
        cr.setAdminName(adminName);
        cr.setRepliedAt(LocalDateTime.now());
        cr.setContact(contact);

        responseRepo.save(cr);

        return ResponseEntity.ok("Reply saved.");
    }
}
