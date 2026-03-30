package com.hospital.controller;

import com.hospital.model.Doctor;
import com.hospital.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@Tag(name = "Doctors")
public class DoctorController {

    @Autowired private DoctorService doctorService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add a new doctor")
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.createDoctor(doctor));
    }

    @GetMapping
    @Operation(summary = "Get all doctors")
    public ResponseEntity<Page<Doctor>> getAllDoctors(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        return ResponseEntity.ok(doctorService.getAllDoctors(search, pageable));
    }

    @GetMapping("/available")
    @Operation(summary = "Get available doctors")
    public ResponseEntity<List<Doctor>> getAvailableDoctors() {
        return ResponseEntity.ok(doctorService.getAvailableDoctors());
    }

    @GetMapping("/specialization/{spec}")
    @Operation(summary = "Get doctors by specialization")
    public ResponseEntity<List<Doctor>> getDoctorsBySpecialization(@PathVariable String spec) {
        return ResponseEntity.ok(doctorService.getDoctorsBySpecialization(spec));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get doctor by ID")
    public ResponseEntity<Doctor> getDoctor(@PathVariable String id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get doctor profile by user ID")
    public ResponseEntity<Doctor> getDoctorByUserId(@PathVariable String userId) {
        return ResponseEntity.ok(doctorService.getDoctorByUserId(userId));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @doctorSecurity.isOwner(#id, authentication)")
    @Operation(summary = "Update doctor profile")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable String id, @RequestBody Doctor doctor) {
        return ResponseEntity.ok(doctorService.updateDoctor(id, doctor));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Deactivate a doctor")
    public ResponseEntity<Void> deleteDoctor(@PathVariable String id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.noContent().build();
    }
}
