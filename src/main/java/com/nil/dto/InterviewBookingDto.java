package com.nil.dto;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class InterviewBookingDto {
    private String name;
    private String email;
    private String phone;
    private String skills;
    private String experience;
    private LocalDate interviewDate;
    private String timeSlot;
    private String linkedin;
    private String comments;
    private MultipartFile resume; // ✅ This is key
}
