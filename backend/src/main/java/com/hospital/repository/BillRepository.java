package com.hospital.repository;

import com.hospital.model.Bill;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BillRepository extends MongoRepository<Bill, String> {
    Page<Bill> findByPatientId(String patientId, Pageable pageable);
    Optional<Bill> findByAppointmentId(String appointmentId);
    List<Bill> findByPaymentStatus(Bill.PaymentStatus status);
    long countByPaymentStatus(Bill.PaymentStatus status);
}
