package com.nil.service.impl;

import com.nil.model.InterviewBooking;
import com.nil.repository.InterviewBookingRepository;
import com.nil.service.InterviewBookingService;

import jakarta.transaction.Transactional;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class InterviewBookingServiceImpl implements InterviewBookingService {

    @Autowired
    private InterviewBookingRepository bookingRepository;

    @Transactional
    public void saveInterviewBooking(InterviewBooking booking) {
        bookingRepository.save(booking);
    }
    

    @Override
    public InterviewBooking findByEmail(String email) {
        return bookingRepository.findByEmail(email).orElse(null);
    }

    @Override
    public List<InterviewBooking> getAllBookings() {
        return bookingRepository.findAll();
    }

    @Override
    public InterviewBooking getBookingById(Long id) {
        return bookingRepository.findById(id).orElse(null);
    }



}