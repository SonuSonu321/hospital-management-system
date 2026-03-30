package com.hospital.repository;

import com.hospital.model.MedicalRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MedicalRecordRepository extends MongoRepository<MedicalRecord, String> {
    Page<MedicalRecord> findByPatientId(String patientId, Pageable pageable);
    Page<MedicalRecord> findByDoctorId(String doctorId, Pageable pageable);
}
