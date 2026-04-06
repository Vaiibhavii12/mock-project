package com.nil.controller;

import com.nil.model.Feedback;
import com.nil.service.FeedbackService;
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
    public String showFeedbackForm() {
        return "feedback";
    }

    // Handle feedback submission
    @PostMapping("/submitFeedback")
    public String submitFeedback(@ModelAttribute Feedback feedback, Model model) {
        feedbackService.saveFeedback(feedback);
        model.addAttribute("message", "Thank you for your feedback!");
        return "feedback_success";
    }
}
