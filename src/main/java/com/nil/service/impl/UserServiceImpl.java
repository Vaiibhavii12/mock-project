package com.nil.service.impl;

import com.nil.model.User;
import com.nil.repository.UserRepository;
import com.nil.service.UserService;

import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public void saveUser(User user) {
        // In a real app, hash the password here
    	
    	  // Encrypt the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        // Optional: You may not need to store confirmPassword
        user.setConfirmPassword(null);
        // Save user to the database
    	
    	
        userRepository.save(user);
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    @Override
    public void updateUser(User user) {
        userRepository.save(user);
    }
    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public User findByEmailAndPassword(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }


}
