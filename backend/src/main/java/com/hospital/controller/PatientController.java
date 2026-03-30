package com.hospital.controller;

import com.hospital.model.Patient;
import com.hospital.service.PatientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@Tag(name = "Patients")
public class PatientController {

    @Autowired private PatientService patientService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @Operation(summary = "Register a new patient")
    public ResponseEntity<Patient> createPatient(@RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.createPatient(patient));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST')")
    @Operation(summary = "Get all patients with optional search and pagination")
    public ResponseEntity<Page<Patient>> getAllPatients(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(patientService.getAllPatients(search, pageable));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RECEPTIONIST') or @patientSecurity.isOwner(#id, authentication)")
    @Operation(summary = "Get patient by ID")
    public ResponseEntity<Patient> getPatient(@PathVariable String id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get patient profile by user ID")
    public ResponseEntity<Patient> getPatientByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(patientService.getPatientByUserId(userId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST') or @patientSecurity.isOwner(#id, authentication)")
    @Operation(summary = "Update patient details")
    public ResponseEntity<Patient> updatePatient(@PathVariable String id, @RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.updatePatient(id, patient));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate a patient")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
