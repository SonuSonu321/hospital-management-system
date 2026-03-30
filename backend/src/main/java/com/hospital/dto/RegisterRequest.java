package com.hospital.dto;

import com.hospital.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Set;

public class RegisterRequest {
    @NotBlank
    private String name;
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 6)
    private String password;
    private String phone;
    private Set<User.Role> roles;

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public Set<User.Role> getRoles() { return roles; }
    public void setRoles(Set<User.Role> roles) { this.roles = roles; }
}
