package com.hospital.controller;

import com.hospital.model.Bill;
import com.hospital.service.BillingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bills")
@Tag(name = "Billing")
public class BillingController {

    @Autowired private BillingService billingService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @Operation(summary = "Create a bill")
    public ResponseEntity<Bill> createBill(@RequestBody Bill bill) {
        return ResponseEntity.ok(billingService.createBill(bill));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get bill by ID")
    public ResponseEntity<Bill> getBill(@PathVariable String id) {
        return ResponseEntity.ok(billingService.getBillById(id));
    }

    @GetMapping("/patient/{patientId}")
    @Operation(summary = "Get bills by patient")
    public ResponseEntity<Page<Bill>> getBillsByPatient(
            @PathVariable String patientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(billingService.getBillsByPatient(patientId, pageable));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @Operation(summary = "Update bill")
    public ResponseEntity<Bill> updateBill(@PathVariable String id, @RequestBody Bill bill) {
        return ResponseEntity.ok(billingService.updateBill(id, bill));
    }

    @PatchMapping("/{id}/payment")
    @PreAuthorize("hasAnyRole('ADMIN', 'RECEPTIONIST')")
    @Operation(summary = "Record payment")
    public ResponseEntity<Bill> recordPayment(
            @PathVariable String id, @RequestBody Map<String, Object> body) {
        double amount = Double.parseDouble(body.get("amount").toString());
        String method = body.get("method").toString();
        return ResponseEntity.ok(billingService.updatePayment(id, amount, method));
    }
}
