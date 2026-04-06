package com.nil.service;

import java.util.List;

import com.nil.model.InterviewBooking;

public interface InterviewBookingService {
    void saveInterviewBooking(InterviewBooking booking);
    
    InterviewBooking findByEmail(String email);
    
    public List<InterviewBooking> getAllBookings();

    public InterviewBooking getBookingById(Long id);

}
