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
    public String showLoginPage() {
        return "login"; // login.html
    }

    // Handle login form submission
    @PostMapping("/loginHandle")
    public String processLogin(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            HttpSession session,
            Model model) {

        User user = userService.findByEmail(email); // Only find by email

        System.out.println("user details : "+user);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            session.setAttribute("user", user);
            model.addAttribute("user",user);
            return "user_profile"; // Redirect to homepage after successful login
        } else {
            model.addAttribute("error", "Invalid email or password");
            return "login";
        }
    }

    // Handle logout
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login?logout"; // Redirect with optional query param
    }
}
