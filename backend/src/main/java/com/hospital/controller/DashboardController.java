package com.hospital.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hospital.model.Appointment;
import com.hospital.service.AppointmentService;
import com.hospital.service.BillingService;
import com.hospital.service.DoctorService;
import com.hospital.service.PatientService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard")
public class DashboardController {

    @Autowired private PatientService patientService;
    @Autowired private DoctorService doctorService;
    @Autowired private AppointmentService appointmentService;
    @Autowired private BillingService billingService;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Admin dashboard analytics")
    public ResponseEntity<Map<String, Object>> adminDashboard() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPatients", patientService.countPatients());
        stats.put("totalDoctors", doctorService.countDoctors());
        stats.put("totalAppointments", appointmentService.countAppointments());
        stats.put("scheduledAppointments", appointmentService.countByStatus(Appointment.Status.SCHEDULED));
        stats.put("completedAppointments", appointmentService.countByStatus(Appointment.Status.COMPLETED));
        stats.put("totalRevenue", billingService.getTotalRevenue());
        return ResponseEntity.ok(stats);
    }
}
