package com.hospital.service;

import com.hospital.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String storeFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException ex) {
            throw new BadRequestException("Could not store file: " + ex.getMessage());
        }
    }

    public byte[] loadFile(String fileName) {
        try {
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(fileName);
            return Files.readAllBytes(filePath);
        } catch (IOException ex) {
            throw new BadRequestException("File not found: " + fileName);
        }
    }
}
