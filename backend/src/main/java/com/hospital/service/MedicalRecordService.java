package com.hospital.service;

import com.hospital.exception.ResourceNotFoundException;
import com.hospital.model.MedicalRecord;
import com.hospital.repository.MedicalRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class MedicalRecordService {

    @Autowired private MedicalRecordRepository medicalRecordRepository;

    public MedicalRecord createRecord(MedicalRecord record) {
        return medicalRecordRepository.save(record);
    }

    public MedicalRecord getRecordById(String id) {
        return medicalRecordRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medical record not found: " + id));
    }

    public Page<MedicalRecord> getRecordsByPatient(String patientId, Pageable pageable) {
        return medicalRecordRepository.findByPatientId(patientId, pageable);
    }

    public Page<MedicalRecord> getRecordsByDoctor(String doctorId, Pageable pageable) {
        return medicalRecordRepository.findByDoctorId(doctorId, pageable);
    }

    public MedicalRecord updateRecord(String id, MedicalRecord updated) {
        MedicalRecord existing = getRecordById(id);
        existing.setDiagnosis(updated.getDiagnosis());
        existing.setSymptoms(updated.getSymptoms());
        existing.setTreatment(updated.getTreatment());
        existing.setPrescriptions(updated.getPrescriptions());
        existing.setNotes(updated.getNotes());
        return medicalRecordRepository.save(existing);
    }

    public void addAttachment(String id, String filePath) {
        MedicalRecord record = getRecordById(id);
        if (record.getAttachments() == null) {
            record.setAttachments(new java.util.ArrayList<>());
        }
        record.getAttachments().add(filePath);
        medicalRecordRepository.save(record);
    }
}
