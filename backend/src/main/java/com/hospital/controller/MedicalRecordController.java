package com.hospital.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hospital.model.MedicalRecord;
import com.hospital.service.FileStorageService;
import com.hospital.service.MedicalRecordService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/medical-records")
@Tag(name = "Medical Records")
public class MedicalRecordController {

    @Autowired private MedicalRecordService medicalRecordService;
    @Autowired private FileStorageService fileStorageService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Create a medical record")
    public ResponseEntity<MedicalRecord> createRecord(@RequestBody MedicalRecord record) {
        return ResponseEntity.ok(medicalRecordService.createRecord(record));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get medical record by ID")
    public ResponseEntity<MedicalRecord> getRecord(@PathVariable String id) {
        return ResponseEntity.ok(medicalRecordService.getRecordById(id));
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get medical records by patient")
    public ResponseEntity<Page<MedicalRecord>> getByPatient(
            @PathVariable String patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(medicalRecordService.getRecordsByPatient(patientId, pageable));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Get medical records by doctor")
    public ResponseEntity<Page<MedicalRecord>> getByDoctor(
            @PathVariable String doctorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(medicalRecordService.getRecordsByDoctor(doctorId, pageable));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Update medical record")
    public ResponseEntity<MedicalRecord> updateRecord(
            @PathVariable String id, @RequestBody MedicalRecord record) {
        return ResponseEntity.ok(medicalRecordService.updateRecord(id, record));
    }

    @PostMapping("/{id}/attachments")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR')")
    @Operation(summary = "Upload attachment to medical record")
    public ResponseEntity<MedicalRecord> uploadAttachment(
            @PathVariable String id, @RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);
        medicalRecordService.addAttachment(id, fileName);
        return ResponseEntity.ok(medicalRecordService.getRecordById(id));
    }
}
