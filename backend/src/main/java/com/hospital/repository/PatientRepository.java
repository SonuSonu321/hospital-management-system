package com.hospital.repository;

import com.hospital.model.Patient;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface PatientRepository extends MongoRepository<Patient, String> {
    Optional<Patient> findByUserId(String userId);
    Optional<Patient> findByEmail(String email);

    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'email': { $regex: ?0, $options: 'i' } }, { 'phone': { $regex: ?0, $options: 'i' } } ] }")
    Page<Patient> searchPatients(String query, Pageable pageable);

    Page<Patient> findByActiveTrue(Pageable pageable);
}
