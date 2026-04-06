package com.nil.controller;

import com.nil.model.User;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    // Landing page - accessible to everyone
    @GetMapping("/")
    public String index(HttpSession session, Model model) {
        // ✅ If logged in, pass user to template
        User user = (User) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("user", user);
        }
        return "index";
    }

    // About page - accessible to everyone
    @GetMapping("/about")
    public String about(HttpSession session, Model model) {
        // ✅ Pass user to template if logged in
        User user = (User) session.getAttribute("user");
        if (user != null) {
            model.addAttribute("user", user);
        }
        return "about";
    }
}
