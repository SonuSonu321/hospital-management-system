package com.hospital.controller;

import com.hospital.model.Appointment;
import com.hospital.service.AppointmentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@Tag(name = "Appointments")
public class AppointmentController {

    @Autowired private AppointmentService appointmentService;

    @PostMapping
    @Operation(summary = "Book an appointment")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.bookAppointment(appointment));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get appointment by ID")
    public ResponseEntity<Appointment> getAppointment(@PathVariable String id) {
        return ResponseEntity.ok(appointmentService.getAppointmentById(id));
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get appointments by patient")
    public ResponseEntity<Page<Appointment>> getByPatient(
            @PathVariable String patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending());
        return ResponseEntity.ok(appointmentService.getAppointmentsByPatient(patientId, pageable));
    }

    @GetMapping("/doctor/{doctorId}")
    @Operation(summary = "Get appointments by doctor")
    public ResponseEntity<Page<Appointment>> getByDoctor(
            @PathVariable String doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("appointmentDate").descending());
        return ResponseEntity.ok(appointmentService.getAppointmentsByDoctor(doctorId, pageable));
    }

    @GetMapping("/slots")
    @Operation(summary = "Get available time slots for a doctor on a date")
    public ResponseEntity<List<LocalTime>> getAvailableSlots(
            @RequestParam String doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(appointmentService.getAvailableSlots(doctorId, date));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update appointment")
    public ResponseEntity<Appointment> updateAppointment(
            @PathVariable String id, @RequestBody Appointment appointment) {
        return ResponseEntity.ok(appointmentService.updateAppointment(id, appointment));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel appointment")
    public ResponseEntity<Appointment> cancelAppointment(
            @PathVariable String id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, body.get("reason")));
    }
}
