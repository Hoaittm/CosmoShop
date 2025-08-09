package hoaittm.contact_service.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "contact")
@Data
@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
public class Contact {
    @Id
    @GeneratedValue
    private Long id;

    private String fullName;
    private String email;
    private String subject;

    @Column(length = 5000)
    private String message;

    private LocalDateTime submittedAt;
    @OneToMany(mappedBy = "contact", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<ContactResponse> responses = new ArrayList<>();

}