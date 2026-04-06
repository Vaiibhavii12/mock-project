package com.nil.controller;

import com.nil.model.User;
import com.nil.service.UserService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class LoginController {

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Show login page
    @GetMapping("/login")
    public String showLoginPage(HttpSession session) {
        // ✅ If already logged in, redirect to profile
        if (session.getAttribute("user") != null) {
            return "redirect:/user_profile";
        }
        return "login";
    }

    // Handle login form submission
    @PostMapping("/loginHandle")
    public String processLogin(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            HttpSession session,
            Model model
    ) {
        User user = userService.findByEmail(email);

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            session.setAttribute("user", user);
            model.addAttribute("user", user);
            return "user_profile";
        } else {
            model.addAttribute("error", "Invalid email or password");
            return "login";
        }
    }

    // Handle logout
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login?logout";
    }

    // Show user profile page
    @GetMapping("/user_profile")
    public String showUserProfile(HttpSession session, Model model) {
        // ✅ Session check
        User user = (User) session.getAttribute("user");
        if (user == null) {
            return "redirect:/login";
        }
        model.addAttribute("user", user);
        return "user_profile";
    }
}
