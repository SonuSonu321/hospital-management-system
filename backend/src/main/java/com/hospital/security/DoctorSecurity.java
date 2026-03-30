package com.hospital.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.hospital.model.Doctor;
import com.hospital.repository.DoctorRepository;

@Component("doctorSecurity")
public class DoctorSecurity {

    @Autowired
    private DoctorRepository doctorRepository;

    public boolean isOwner(String doctorId, Authentication authentication) {
        return doctorRepository.findById(doctorId)
                .map(Doctor::getEmail)
                .map(email -> email.equals(authentication.getName()))
                .orElse(false);
    }
}
