package com.hospital.service;

import com.hospital.exception.ResourceNotFoundException;
import com.hospital.model.Patient;
import com.hospital.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
public class PatientService {

    @Autowired private PatientRepository patientRepository;

    public Patient createPatient(Patient patient) {
        if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            throw new com.hospital.exception.BadRequestException("Patient with this email already exists");
        }
        return patientRepository.save(patient);
    }

    public Patient getPatientById(String id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found: " + id));
    }

    public Patient getPatientByUserId(String userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
    }

    public Page<Patient> getAllPatients(String search, Pageable pageable) {
        if (StringUtils.hasText(search)) {
            return patientRepository.searchPatients(search, pageable);
        }
        return patientRepository.findByActiveTrue(pageable);
    }

    public Patient updatePatient(String id, Patient updated) {
        Patient existing = getPatientById(id);
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setGender(updated.getGender());
        existing.setBloodGroup(updated.getBloodGroup());
        existing.setAddress(updated.getAddress());
        existing.setEmergencyContact(updated.getEmergencyContact());
        existing.setAllergies(updated.getAllergies());
        existing.setChronicConditions(updated.getChronicConditions());
        existing.setInsuranceNumber(updated.getInsuranceNumber());
        return patientRepository.save(existing);
    }

    public void deletePatient(String id) {
        Patient patient = getPatientById(id);
        patient.setActive(false);
        patientRepository.save(patient);
    }

    public long countPatients() {
        return patientRepository.count();
    }
}
