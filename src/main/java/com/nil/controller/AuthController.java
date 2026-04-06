package com.nil.controller;

import com.nil.dto.UserUpdateDTO;
import com.nil.model.User;
import com.nil.service.UserService;
import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthController {

    @Autowired
    private UserService userService;

    // Show registration form
    @GetMapping("/register")
    public String showRegisterForm(Model model) {
        model.addAttribute("user", new User());
        return "register";
    }

    // Handle registration form submission
    @PostMapping("/registerHandle")
    public String registerUser(
            @ModelAttribute("user") @Valid User user,
            BindingResult result,
            Model model
    ) {
        if (!user.getPassword().equals(user.getConfirmPassword())) {
            model.addAttribute("passwordError", "Passwords do not match");
            return "register";
        }

        if (!user.isTermsAccepted()) {
            model.addAttribute("termsError", "You must accept the terms and conditions");
            return "register";
        }

        if (result.hasErrors()) {
            return "register";
        }

        if (userService.findByEmail(user.getEmail()) != null) {
            model.addAttribute("emailExists", "An account with this email already exists");
            return "register";
        }

        userService.saveUser(user);
        model.addAttribute("user", user); // add user to profile
        return "user_profile";
    }

    // Show update profile form (expects email as a query param)
    @GetMapping("/getUpdateProfile")
    public String showUpdateProfileForm(@RequestParam(name = "email", required = true) String email, Model model) {
        User user = userService.findByEmail(email);
        if (user == null) {
            model.addAttribute("errorMessage", "User not found with email: " + email);
            return "error"; // you can customize this view
        }
        model.addAttribute("user", user);
        return "update_profile";
    }
   
    
    @PostMapping("/postUpdateProfile")
    public String updateProfile(@ModelAttribute("user") @Valid UserUpdateDTO userDto, BindingResult result, Model model) {
        System.out.println("Incoming email: " + userDto.getEmail());

        if (result.hasErrors()) {
            return "update_profile";
        }

        User existingUser = userService.findByEmail(userDto.getEmail());
        if (existingUser == null) {
            model.addAttribute("errorMessage", "User not found with email: " + userDto.getEmail());
            return "error";
        }

        // Update fields from DTO
        existingUser.setFullName(userDto.getFullName());
        existingUser.setPhone(userDto.getPhone());
        existingUser.setGender(userDto.getGender());
        existingUser.setAge(userDto.getAge());

        userService.updateUser(existingUser);
        model.addAttribute("user", existingUser);
        return "user_profile";
    }


 


    
    
    
}
