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
    public String showAdminLoginPage(HttpSession session) {
        // ✅ If already logged in as admin, redirect to dashboard
        if (session.getAttribute("admin") != null) {
            return "redirect:/admin/allBookings";
        }
        return "indexAdmin";
    }

    // Handle admin login
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

        Admin admin = adminService.findByEmail(email);

        // ✅ Fixed: null check BEFORE accessing admin fields + using passwordEncoder correctly
        if (admin == null) {
            model.addAttribute("error", "No admin found with this email.");
            return "indexAdmin";
        }

        if (passwordEncoder.matches(password, admin.getPassword())) {
            session.setAttribute("admin", admin);
            model.addAttribute("admin", admin);
            return "admin_dashboard";
        } else {
            model.addAttribute("error", "Incorrect email or password!");
            return "indexAdmin";
        }
    }

    // Show all bookings
    @GetMapping("/allBookings")
    public String showAllBookings(HttpSession session, Model model) {
        // ✅ Session check
        if (session.getAttribute("admin") == null) {
            return "redirect:/admin";
        }

        List<InterviewBooking> bookings = bookingService.getAllBookings();
        model.addAttribute("bookings", bookings);
        return "users_booking";
    }

    // Download resume by booking ID
    @GetMapping("/downloadResume/{id}")
    public ResponseEntity<InputStreamResource> downloadResume(@PathVariable("id") Long id,
                                                               HttpSession session) {
        // ✅ Session check
        if (session.getAttribute("admin") == null) {
            return ResponseEntity.status(401).build();
        }

        InterviewBooking booking = bookingService.getBookingById(id);
        if (booking != null && booking.getResume() != null) {
            byte[] resumeBytes = booking.getResume();
            ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(resumeBytes);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"resume_" + booking.getName() + ".pdf\"")
                    .contentLength(resumeBytes.length)
                    .body(new InputStreamResource(byteArrayInputStream));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Admin logout
    @GetMapping("/logout")
    public String adminLogout(HttpSession session) {
        session.invalidate();
        return "redirect:/admin";
    }
}
