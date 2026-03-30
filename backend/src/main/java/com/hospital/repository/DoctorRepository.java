package com.hospital.repository;

import com.hospital.model.Doctor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends MongoRepository<Doctor, String> {
    Optional<Doctor> findByUserId(String userId);
    List<Doctor> findBySpecializationAndActiveTrue(String specialization);
    List<Doctor> findByAvailableTrueAndActiveTrue();

    @Query("{ $or: [ { 'name': { $regex: ?0, $options: 'i' } }, { 'specialization': { $regex: ?0, $options: 'i' } } ] }")
    Page<Doctor> searchDoctors(String query, Pageable pageable);

    Page<Doctor> findByActiveTrue(Pageable pageable);
}
