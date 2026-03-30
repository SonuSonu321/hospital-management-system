package com.hospital.repository;

import com.hospital.model.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends MongoRepository<Appointment, String> {
    Page<Appointment> findByPatientId(String patientId, Pageable pageable);
    Page<Appointment> findByDoctorId(String doctorId, Pageable pageable);
    List<Appointment> findByDoctorIdAndAppointmentDate(String doctorId, LocalDate date);
    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
            String doctorId, LocalDate date, LocalTime time, Appointment.Status status);
    long countByStatus(Appointment.Status status);
    Page<Appointment> findByStatus(Appointment.Status status, Pageable pageable);
    List<Appointment> findByAppointmentDateAndStatus(LocalDate date, Appointment.Status status);
}
