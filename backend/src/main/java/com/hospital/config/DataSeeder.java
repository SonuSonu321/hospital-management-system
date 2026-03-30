package com.hospital.config;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.hospital.model.Doctor;
import com.hospital.model.Patient;
import com.hospital.model.User;
import com.hospital.repository.DoctorRepository;
import com.hospital.repository.PatientRepository;
import com.hospital.repository.UserRepository;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired private UserRepository userRepository;
    @Autowired private DoctorRepository doctorRepository;
    @Autowired private PatientRepository patientRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedReceptionist();
        seedDoctors();
        seedPatients();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail("admin@hospital.com")) return;
        User admin = new User();
        admin.setName("Admin");
        admin.setEmail("admin@hospital.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setPhone("9000000001");
        admin.setRoles(Set.of(User.Role.ROLE_ADMIN));
        userRepository.save(admin);
        log.info("Seeded admin -> admin@hospital.com / admin123");
    }

    private void seedReceptionist() {
        if (userRepository.existsByEmail("reception@hospital.com")) return;
        User rec = new User();
        rec.setName("Receptionist");
        rec.setEmail("reception@hospital.com");
        rec.setPassword(passwordEncoder.encode("recep123"));
        rec.setPhone("9000000002");
        rec.setRoles(Set.of(User.Role.ROLE_RECEPTIONIST));
        userRepository.save(rec);
        log.info("Seeded receptionist -> reception@hospital.com / recep123");
    }

    private void seedDoctors() {
        seedDoctor("Dr. Arjun Sharma", "arjun@hospital.com", "9100000001",
                "Cardiology", "MBBS, MD", 12, "LIC-001", 800.0,
                List.of(makeSchedule("MONDAY", "09:00", "17:00", 30),
                        makeSchedule("WEDNESDAY", "09:00", "17:00", 30),
                        makeSchedule("FRIDAY", "09:00", "13:00", 30)));

        seedDoctor("Dr. Priya Mehta", "priya@hospital.com", "9100000002",
                "Neurology", "MBBS, DM", 8, "LIC-002", 1000.0,
                List.of(makeSchedule("TUESDAY", "10:00", "16:00", 30),
                        makeSchedule("THURSDAY", "10:00", "16:00", 30)));

        seedDoctor("Dr. Rahul Verma", "rahul@hospital.com", "9100000003",
                "Orthopedics", "MBBS, MS", 15, "LIC-003", 700.0,
                List.of(makeSchedule("MONDAY", "08:00", "14:00", 30),
                        makeSchedule("THURSDAY", "08:00", "14:00", 30),
                        makeSchedule("SATURDAY", "09:00", "12:00", 30)));

        seedDoctor("Dr. Sneha Patel", "sneha@hospital.com", "9100000004",
                "Pediatrics", "MBBS, DCH", 6, "LIC-004", 600.0,
                List.of(makeSchedule("MONDAY", "09:00", "17:00", 30),
                        makeSchedule("TUESDAY", "09:00", "17:00", 30),
                        makeSchedule("WEDNESDAY", "09:00", "17:00", 30)));

        seedDoctor("Dr. Kavita Nair", "kavita@hospital.com", "9100000005",
                "Dermatology", "MBBS, DVD", 9, "LIC-005", 650.0,
                List.of(makeSchedule("MONDAY", "10:00", "15:00", 30),
                        makeSchedule("WEDNESDAY", "10:00", "15:00", 30),
                        makeSchedule("FRIDAY", "10:00", "14:00", 30)));

        seedDoctor("Dr. Suresh Iyer", "suresh@hospital.com", "9100000006",
                "Gastroenterology", "MBBS, DM", 11, "LIC-006", 900.0,
                List.of(makeSchedule("TUESDAY", "09:00", "16:00", 30),
                        makeSchedule("FRIDAY", "09:00", "16:00", 30)));

        seedDoctor("Dr. Ananya Bose", "ananya@hospital.com", "9100000007",
                "Gynecology", "MBBS, MS", 14, "LIC-007", 750.0,
                List.of(makeSchedule("MONDAY", "09:00", "17:00", 30),
                        makeSchedule("THURSDAY", "09:00", "17:00", 30),
                        makeSchedule("SATURDAY", "09:00", "13:00", 30)));

        seedDoctor("Dr. Manoj Tiwari", "manoj@hospital.com", "9100000008",
                "Psychiatry", "MBBS, MD", 7, "LIC-008", 850.0,
                List.of(makeSchedule("TUESDAY", "11:00", "17:00", 30),
                        makeSchedule("THURSDAY", "11:00", "17:00", 30)));

        seedDoctor("Dr. Ritu Gupta", "ritu@hospital.com", "9100000009",
                "Ophthalmology", "MBBS, MS", 10, "LIC-009", 700.0,
                List.of(makeSchedule("MONDAY", "08:00", "14:00", 30),
                        makeSchedule("WEDNESDAY", "08:00", "14:00", 30),
                        makeSchedule("FRIDAY", "08:00", "12:00", 30)));

        seedDoctor("Dr. Deepak Joshi", "deepak@hospital.com", "9100000010",
                "ENT", "MBBS, MS", 13, "LIC-010", 600.0,
                List.of(makeSchedule("TUESDAY", "09:00", "15:00", 30),
                        makeSchedule("SATURDAY", "09:00", "13:00", 30)));

        seedDoctor("Dr. Pooja Reddy", "pooja@hospital.com", "9100000011",
                "Endocrinology", "MBBS, DM", 5, "LIC-011", 950.0,
                List.of(makeSchedule("MONDAY", "10:00", "16:00", 30),
                        makeSchedule("THURSDAY", "10:00", "16:00", 30)));

        seedDoctor("Dr. Nikhil Desai", "nikhil@hospital.com", "9100000012",
                "Pulmonology", "MBBS, MD", 8, "LIC-012", 800.0,
                List.of(makeSchedule("WEDNESDAY", "09:00", "15:00", 30),
                        makeSchedule("FRIDAY", "09:00", "15:00", 30)));

        seedDoctor("Dr. Shweta Kulkarni", "shweta@hospital.com", "9100000013",
                "Nephrology", "MBBS, DM", 16, "LIC-013", 1100.0,
                List.of(makeSchedule("TUESDAY", "08:00", "14:00", 30),
                        makeSchedule("THURSDAY", "08:00", "14:00", 30)));

        seedDoctor("Dr. Aakash Malhotra", "aakash@hospital.com", "9100000014",
                "Oncology", "MBBS, MD", 18, "LIC-014", 1200.0,
                List.of(makeSchedule("MONDAY", "09:00", "15:00", 30),
                        makeSchedule("WEDNESDAY", "09:00", "15:00", 30)));

        seedDoctor("Dr. Meera Pillai", "meera@hospital.com", "9100000015",
                "Rheumatology", "MBBS, MD", 7, "LIC-015", 850.0,
                List.of(makeSchedule("TUESDAY", "10:00", "16:00", 30),
                        makeSchedule("FRIDAY", "10:00", "16:00", 30)));
    }

    private void seedDoctor(String name, String email, String phone,
                             String spec, String qual, int exp,
                             String license, double fee, List<Doctor.Schedule> schedules) {
        if (userRepository.existsByEmail(email)) return;

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("doctor123"));
        user.setPhone(phone);
        user.setRoles(Set.of(User.Role.ROLE_DOCTOR));
        user = userRepository.save(user);

        Doctor doctor = new Doctor();
        doctor.setUserId(user.getId());
        doctor.setName(name);
        doctor.setEmail(email);
        doctor.setPhone(phone);
        doctor.setSpecialization(spec);
        doctor.setQualification(qual);
        doctor.setExperienceYears(exp);
        doctor.setLicenseNumber(license);
        doctor.setConsultationFee(fee);
        doctor.setSchedules(schedules);
        doctor.setAvailable(true);
        doctorRepository.save(doctor);

        log.info("Seeded doctor -> {} / doctor123", email);
    }

    private Doctor.Schedule makeSchedule(String day, String start, String end, int slotMins) {
        Doctor.Schedule s = new Doctor.Schedule();
        s.setDayOfWeek(day);
        s.setStartTime(LocalTime.parse(start));
        s.setEndTime(LocalTime.parse(end));
        s.setSlotDurationMinutes(slotMins);
        return s;
    }

    private void seedPatients() {
        seedPatient("Amit Kumar", "amit@example.com", "9200000001",
                "1990-05-15", "MALE", "B+");
        seedPatient("Sunita Rao", "sunita@example.com", "9200000002",
                "1985-11-22", "FEMALE", "O+");
        seedPatient("Vikram Singh", "vikram@example.com", "9200000003",
                "1978-03-08", "MALE", "A+");
    }

    private void seedPatient(String name, String email, String phone,
                              String dob, String gender, String blood) {
        if (userRepository.existsByEmail(email)) return;

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("patient123"));
        user.setPhone(phone);
        user.setRoles(Set.of(User.Role.ROLE_PATIENT));
        user = userRepository.save(user);

        Patient patient = new Patient();
        patient.setUserId(user.getId());
        patient.setName(name);
        patient.setEmail(email);
        patient.setPhone(phone);
        patient.setDateOfBirth(LocalDate.parse(dob));
        patient.setGender(gender);
        patient.setBloodGroup(blood);
        patientRepository.save(patient);

        log.info("Seeded patient -> {} / patient123", email);
    }
}
