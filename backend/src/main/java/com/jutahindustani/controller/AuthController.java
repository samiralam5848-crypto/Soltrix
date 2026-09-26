package com.jutahindustani.controller;

import com.jutahindustani.dto.JwtResponse;
import com.jutahindustani.dto.LoginRequest;
import com.jutahindustani.dto.MessageResponse;
import com.jutahindustani.dto.SignupRequest;
import com.jutahindustani.entity.User;
import com.jutahindustani.security.JwtTokenProvider;
import com.jutahindustani.security.UserPrincipal;
import com.jutahindustani.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/auth", "/api/auth"})
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping({"/signup", "/register"})
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        try {
            User user = userService.registerUser(signUpRequest);
            return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            String role = userPrincipal.getAuthorities().stream()
                    .map(grantedAuthority -> grantedAuthority.getAuthority())
                    .findFirst()
                    .orElse("ROLE_CUSTOMER");

            return ResponseEntity.ok(new JwtResponse(
                    jwt,
                    userPrincipal.getId(),
                    userPrincipal.getEmail(),
                    userPrincipal.getName(),
                    role
            ));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(new MessageResponse("Error: Invalid email or password!"));
        }
    }
}
