package com.hospital.service;

import com.hospital.exception.ResourceNotFoundException;
import com.hospital.model.Bill;
import com.hospital.repository.BillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class BillingService {

    @Autowired private BillRepository billRepository;

    public Bill createBill(Bill bill) {
        bill.setPaymentStatus(Bill.PaymentStatus.PENDING);
        calculateTotals(bill);
        return billRepository.save(bill);
    }

    public Bill getBillById(String id) {
        return billRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found: " + id));
    }

    public Page<Bill> getBillsByPatient(String patientId, Pageable pageable) {
        return billRepository.findByPatientId(patientId, pageable);
    }

    public Bill updatePayment(String id, double amount, String method) {
        Bill bill = getBillById(id);
        bill.setPaidAmount(bill.getPaidAmount() + amount);
        bill.setPaymentMethod(method);
        if (bill.getPaidAmount() >= bill.getTotalAmount()) {
            bill.setPaymentStatus(Bill.PaymentStatus.PAID);
            bill.setPaymentDate(java.time.LocalDateTime.now());
        } else if (bill.getPaidAmount() > 0) {
            bill.setPaymentStatus(Bill.PaymentStatus.PARTIAL);
        }
        return billRepository.save(bill);
    }

    public Bill updateBill(String id, Bill updated) {
        Bill existing = getBillById(id);
        existing.setItems(updated.getItems());
        existing.setDiscount(updated.getDiscount());
        existing.setNotes(updated.getNotes());
        calculateTotals(existing);
        return billRepository.save(existing);
    }

    private void calculateTotals(Bill bill) {
        double subtotal = 0;
        if (bill.getItems() != null) {
            for (Bill.BillItem item : bill.getItems()) {
                item.setTotal(item.getQuantity() * item.getUnitPrice());
                subtotal += item.getTotal();
            }
        }
        bill.setSubtotal(subtotal);
        bill.setTax(subtotal * 0.1); // 10% tax
        bill.setTotalAmount(subtotal + bill.getTax() - bill.getDiscount());
    }

    public double getTotalRevenue() {
        return billRepository.findByPaymentStatus(Bill.PaymentStatus.PAID)
                .stream().mapToDouble(Bill::getPaidAmount).sum();
    }
}
