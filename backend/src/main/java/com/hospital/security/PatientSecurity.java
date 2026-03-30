package com.hospital.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import com.hospital.model.Patient;
import com.hospital.repository.PatientRepository;

@Component("patientSecurity")
public class PatientSecurity {

    @Autowired
    private PatientRepository patientRepository;

    public boolean isOwner(String patientId, Authentication authentication) {
        return patientRepository.findById(patientId)
                .map(Patient::getEmail)
                .map(email -> email.equals(authentication.getName()))
                .orElse(false);
    }
}
