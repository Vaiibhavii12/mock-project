package com.nil.controller;

import jakarta.servlet.http.HttpSession;

import java.io.ByteArrayInputStream;
import java.util.List;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.nil.model.Admin;
import com.nil.model.InterviewBooking;
import com.nil.service.InterviewBookingService;
import com.nil.service.AdminService;


@Controller
@RequestMapping("/admin")
public class AdminController {
	
	private InterviewBookingService bookingService;
	private AdminService adminService;
	
    private final PasswordEncoder passwordEncoder;

	    public AdminController(InterviewBookingService bookingService,
	                           AdminService adminService,
	                           PasswordEncoder passwordEncoder) {
	        this.bookingService = bookingService;
	        this.adminService = adminService;
	        this.passwordEncoder = passwordEncoder;
	    }


	// Show admin login page
	@GetMapping
	public String showAdminLoginPage() {
		return "indexAdmin"; // indexAdmin.html
	}

	
	@PostMapping("/adminHandle")
	public String adminLogin(@RequestParam("email") String email,
	                         @RequestParam("password") String password,
	                         HttpSession session,
	                         Model model) {
	    
	    if (email == null || password == null) {
	        model.addAttribute("error", "Email and password are required.");
	        return "indexAdmin";
	    }

	    email = email.trim();
	    password = password.trim();

	    System.out.println("Admin login attempt for email: " + email);
	    
	    Admin admin = adminService.findByEmail(email);
	    System.out.println("Admin fetched: " + admin);
	    
	    boolean passCheck = passwordEncoder.matches(password, admin.getPassword());
	    System.out.println("password matching : "+passCheck);

	    if (admin != null && password.equals(admin.getPassword())) {
	        System.out.println("Login successful");
	        session.setAttribute("admin", admin);
	        model.addAttribute("admin",admin);
	        return "admin_dashboard"; // or redirect to a controller method
	    } else {
	        model.addAttribute("error", "Incorrect email or password!!");
	        return "indexAdmin";
	    }
	}


	// Show all user bookings
	@GetMapping("/allBookings")
	public String showAllBookings(Model model) {
		List<InterviewBooking> bookings = bookingService.getAllBookings();
		model.addAttribute("bookings", bookings);
		return "users_booking"; // HTML page to list all bookings
	}



	@GetMapping("/downloadResume/{id}")
	public ResponseEntity<InputStreamResource> downloadResume(@PathVariable("id") Long id) {
		// Fetch the booking by id to get the resume data (BLOB)
		InterviewBooking booking = bookingService.getBookingById(id);

		if (booking != null && booking.getResume() != null) {
			// Get the resume (BLOB)
			byte[] resumeBytes = booking.getResume();

			// Return the resume as a downloadable file
			ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(resumeBytes);

			return ResponseEntity.ok()
					.header(HttpHeaders.CONTENT_DISPOSITION,
							"attachment; filename=\"resume_" + booking.getName() + ".pdf\"")
					.contentLength(resumeBytes.length).body(new InputStreamResource(byteArrayInputStream));
		} else {
			return ResponseEntity.notFound().build();
		}
	}


}
