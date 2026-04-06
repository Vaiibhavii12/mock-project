package com.nil.repository;

import com.nil.model.InterviewBooking;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface InterviewBookingRepository extends JpaRepository<InterviewBooking, Long> {
	
	 Optional<InterviewBooking> findByEmail(String email); // New method to find by email
}
