package com.hospital.service;

import com.hospital.dto.AuthRequest;
import com.hospital.dto.AuthResponse;
import com.hospital.dto.RegisterRequest;
import com.hospital.exception.BadRequestException;
import com.hospital.model.User;
import com.hospital.repository.UserRepository;
import com.hospital.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtils jwtUtils;

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRoles());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already in use");
        }
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRoles(request.getRoles() != null ? request.getRoles() : Set.of(User.Role.ROLE_PATIENT));
        userRepository.save(user);
        String jwt = jwtUtils.generateTokenFromEmail(user.getEmail());
        return new AuthResponse(jwt, user.getId(), user.getName(), user.getEmail(), user.getRoles());
    }
}
