package com.nil.service;

import com.nil.model.Admin;

public interface AdminService {
    Admin findByEmail(String email);
}
