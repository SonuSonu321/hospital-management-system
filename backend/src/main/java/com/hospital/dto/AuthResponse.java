package com.hospital.dto;

import com.hospital.model.User;
import java.util.Set;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String name;
    private String email;
    private Set<User.Role> roles;

    public AuthResponse(String token, String id, String name, String email, Set<User.Role> roles) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = roles;
    }

    public String getToken() { return token; }
    public String getType() { return type; }
    public String getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Set<User.Role> getRoles() { return roles; }
}
