package com.nil.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "user_feedback")
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String phone;
    private String category;

    @Column(length = 2000)
    private String feedbackText;
}
