package com.hospital.service;

import com.hospital.exception.ResourceNotFoundException;
import com.hospital.model.Doctor;
import com.hospital.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
public class DoctorService {

    @Autowired private DoctorRepository doctorRepository;

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor getDoctorById(String id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found: " + id));
    }

    public Doctor getDoctorByUserId(String userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor profile not found"));
    }

    public Page<Doctor> getAllDoctors(String search, Pageable pageable) {
        if (StringUtils.hasText(search)) {
            return doctorRepository.searchDoctors(search, pageable);
        }
        return doctorRepository.findByActiveTrue(pageable);
    }

    public List<Doctor> getAvailableDoctors() {
        return doctorRepository.findByAvailableTrueAndActiveTrue();
    }

    public List<Doctor> getDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationAndActiveTrue(specialization);
    }

    public Doctor updateDoctor(String id, Doctor updated) {
        Doctor existing = getDoctorById(id);
        existing.setName(updated.getName());
        existing.setPhone(updated.getPhone());
        existing.setSpecialization(updated.getSpecialization());
        existing.setQualification(updated.getQualification());
        existing.setExperienceYears(updated.getExperienceYears());
        existing.setConsultationFee(updated.getConsultationFee());
        existing.setSchedules(updated.getSchedules());
        existing.setAvailable(updated.isAvailable());
        return doctorRepository.save(existing);
    }

    public void deleteDoctor(String id) {
        Doctor doctor = getDoctorById(id);
        doctor.setActive(false);
        doctorRepository.save(doctor);
    }

    public long countDoctors() {
        return doctorRepository.count();
    }
}
