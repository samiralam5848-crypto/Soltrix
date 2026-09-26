package com.jutahindustani.service;

import com.jutahindustani.dto.SignupRequest;
import com.jutahindustani.entity.Cart;
import com.jutahindustani.entity.Role;
import com.jutahindustani.entity.User;
import com.jutahindustani.repository.CartRepository;
import com.jutahindustani.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User registerUser(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        Role role = signupRequest.isAdmin() ? Role.ROLE_ADMIN : Role.ROLE_CUSTOMER;

        User user = User.builder()
                .name(signupRequest.getName())
                .email(signupRequest.getEmail())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

        // Auto-create a shopping cart for the user
        Cart cart = Cart.builder()
                .user(savedUser)
                .build();
        cartRepository.save(cart);

        return savedUser;
    }
}
