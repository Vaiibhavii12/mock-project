package com.nil.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email(message = "Invalid email")
    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Phone number is required")
    private String phone;

    @NotBlank(message = "Gender is required")
    private String gender;

    @Min(value = 15, message = "Age must be at least 15")
    @Max(value = 100, message = "Age must be below 100")
    private int age;

    @NotBlank(message = "Password is required")
    private String password;

    @Transient
    private String confirmPassword;

    @Transient
    private boolean termsAccepted;

    // Getters and Setters
}
