package com.nil.service;

import com.nil.model.User;

public interface UserService {
    public User findById(Long id);
    void saveUser(User user);
    User findByEmail(String email);
    
    public void updateUser(User user);
    
    User findByEmailAndPassword(String email, String password);
}
