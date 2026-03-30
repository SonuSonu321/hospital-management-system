package com.hospital.service;

import com.hospital.exception.BadRequestException;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.model.Appointment;
import com.hospital.model.Doctor;
import com.hospital.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AppointmentService {

    @Autowired private AppointmentRepository appointmentRepository;
    @Autowired private DoctorService doctorService;

    public Appointment bookAppointment(Appointment appointment) {
        // Check slot availability
        boolean slotTaken = appointmentRepository
                .existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                        appointment.getDoctorId(),
                        appointment.getAppointmentDate(),
                        appointment.getAppointmentTime(),
                        Appointment.Status.CANCELLED);
        if (slotTaken) {
            throw new BadRequestException("This time slot is already booked");
        }
        appointment.setStatus(Appointment.Status.SCHEDULED);
        return appointmentRepository.save(appointment);
    }

    public Appointment getAppointmentById(String id) {
        return appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
    }

    public Page<Appointment> getAppointmentsByPatient(String patientId, Pageable pageable) {
        return appointmentRepository.findByPatientId(patientId, pageable);
    }

    public Page<Appointment> getAppointmentsByDoctor(String doctorId, Pageable pageable) {
        return appointmentRepository.findByDoctorId(doctorId, pageable);
    }

    public Page<Appointment> getAppointmentsByStatus(Appointment.Status status, Pageable pageable) {
        return appointmentRepository.findByStatus(status, pageable);
    }

    public Appointment updateAppointment(String id, Appointment updated) {
        Appointment existing = getAppointmentById(id);
        if (existing.getStatus() == Appointment.Status.CANCELLED) {
            throw new BadRequestException("Cannot update a cancelled appointment");
        }
        existing.setAppointmentDate(updated.getAppointmentDate());
        existing.setAppointmentTime(updated.getAppointmentTime());
        existing.setReason(updated.getReason());
        existing.setNotes(updated.getNotes());
        existing.setStatus(updated.getStatus());
        return appointmentRepository.save(existing);
    }

    public Appointment cancelAppointment(String id, String reason) {
        Appointment appointment = getAppointmentById(id);
        appointment.setStatus(Appointment.Status.CANCELLED);
        appointment.setCancelReason(reason);
        return appointmentRepository.save(appointment);
    }

    public List<LocalTime> getAvailableSlots(String doctorId, LocalDate date) {
        Doctor doctor = doctorService.getDoctorById(doctorId);
        String dayOfWeek = date.getDayOfWeek().name();

        Doctor.Schedule schedule = doctor.getSchedules() == null ? null :
                doctor.getSchedules().stream()
                        .filter(s -> s.getDayOfWeek().equalsIgnoreCase(dayOfWeek))
                        .findFirst().orElse(null);

        if (schedule == null) return List.of();

        List<Appointment> booked = appointmentRepository
                .findByDoctorIdAndAppointmentDate(doctorId, date);

        List<LocalTime> bookedTimes = booked.stream()
                .filter(a -> a.getStatus() != Appointment.Status.CANCELLED)
                .map(Appointment::getAppointmentTime)
                .toList();

        List<LocalTime> slots = new ArrayList<>();
        LocalTime current = schedule.getStartTime();
        while (current.isBefore(schedule.getEndTime())) {
            if (!bookedTimes.contains(current)) {
                slots.add(current);
            }
            current = current.plusMinutes(schedule.getSlotDurationMinutes());
        }
        return slots;
    }

    public long countAppointments() {
        return appointmentRepository.count();
    }

    public long countByStatus(Appointment.Status status) {
        return appointmentRepository.countByStatus(status);
    }
}
