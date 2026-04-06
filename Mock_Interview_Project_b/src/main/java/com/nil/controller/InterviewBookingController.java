package com.nil.controller;

import com.nil.dto.InterviewBookingDto;
import com.nil.model.InterviewBooking;
import com.nil.model.User;
import com.nil.service.InterviewBookingService;
import com.nil.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@Controller
public class InterviewBookingController {

    @Autowired
    private InterviewBookingService bookingService;

    @Autowired
    private UserService userService;

    // Show book interview form
    @GetMapping("/getBookInterviewPage")
    public String showBookInterviewForm(Model model, @RequestParam("email") String email) {
        User user = userService.findByEmail(email);
        if (user != null) {
            InterviewBooking booking = new InterviewBooking();
            booking.setEmail(user.getEmail());
            booking.setName(user.getFullName());
            booking.setPhone(user.getPhone());
            model.addAttribute("interviewBooking", booking);
        } else {
            model.addAttribute("interviewBooking", new InterviewBooking());
        }
        return "bookInterview";
    }

    // Handle form submission
    @PostMapping("/book-interview")
    public String handleInterviewBooking(@ModelAttribute InterviewBookingDto dto, Model model) {
        InterviewBooking booking = new InterviewBooking();

        booking.setName(dto.getName());
        booking.setEmail(dto.getEmail());
        booking.setPhone(dto.getPhone());
        booking.setSkills(dto.getSkills());
        booking.setExperience(dto.getExperience());
        booking.setInterviewDate(dto.getInterviewDate());
        booking.setTimeSlot(dto.getTimeSlot());
        booking.setLinkedin(dto.getLinkedin());
        booking.setComments(dto.getComments());

        // ✅ Convert MultipartFile to byte[] for resume
        try {
            if (dto.getResume() != null && !dto.getResume().isEmpty()) {
                booking.setResume(dto.getResume().getBytes());
            }
        } catch (Exception e) {
            e.printStackTrace(); // or handle this more gracefully
        }

        bookingService.saveInterviewBooking(booking);

        model.addAttribute("message", "Interview booked successfully!");
        model.addAttribute("booking", booking); // in case you want to show details

        return "bookingSuccess";
    }


    @GetMapping("/downloadResumeByEmail")
    public ResponseEntity<byte[]> downloadResumeByEmail(@RequestParam(name = "email") String email) {
        Logger logger = LoggerFactory.getLogger(getClass());
        logger.info("Received request to download resume for email: {}", email);

        try {
            InterviewBooking booking = bookingService.findByEmail(email);

            if (booking != null) {
                if (booking.getResume() != null) {
                    byte[] resumeData = booking.getResume();

                    HttpHeaders headers = new HttpHeaders();
                    headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=resume_" + booking.getName() + ".pdf");
                    headers.add(HttpHeaders.CONTENT_TYPE, "application/octet-stream");

                    return new ResponseEntity<>(resumeData, headers, HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            logger.error("Error while downloading resume for email: {}", email, e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping("/home")
    public String showHomePage() {
        // Add any model attributes if needed
        return "index"; // This should be the name of the Thymeleaf template for the homepage
    }
    

    @GetMapping("/profile")
    public String showProfilePage(@RequestParam("email") String email, Model model) {
        // Fetch the User entity based on the email
        User user = userService.findByEmail(email);  // Assuming you have a service method to load the user by email

        if (user != null) {
            model.addAttribute("user", user);
            return "user_profile"; // Return the Thymeleaf template for the profile page
        } else {
            // Handle the case where the user is not found (e.g., redirect to an error page or show a message)
            model.addAttribute("error", "User not found");
            return "error";  // Assuming you have an error page to handle this
        }
    }


    @GetMapping("/viewBookingDetails")
    public String viewBookingDetails(@RequestParam("email") String email, Model model) {
        InterviewBooking booking = bookingService.findByEmail(email);
        User user = userService.findByEmail(email);
        if (booking == null) {
            model.addAttribute("message", "Booking details not available. Please first book the mock interview.");
            model.addAttribute("user",user);
        } else {
            model.addAttribute("booking", booking);
        }

        return "booking_details";
    }

    
    
    
    
    
}
