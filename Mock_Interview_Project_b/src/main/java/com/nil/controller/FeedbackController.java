package com.nil.controller;

import com.nil.model.Feedback;
import com.nil.service.FeedbackService;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    // Show feedback form
    @GetMapping("/feedback")
    public String showFeedbackForm(HttpSession session) {
        // ✅ Session check - only logged in users can give feedback
        if (session.getAttribute("user") == null) {
            return "redirect:/login";
        }
        return "feedback";
    }

    // Handle feedback submission
    @PostMapping("/submitFeedback")
    public String submitFeedback(@ModelAttribute Feedback feedback,
                                  HttpSession session,
                                  Model model) {
        // ✅ Session check
        if (session.getAttribute("user") == null) {
            return "redirect:/login";
        }
        feedbackService.saveFeedback(feedback);
        model.addAttribute("message", "Thank you for your feedback!");
        return "feedback_success";
    }
}
