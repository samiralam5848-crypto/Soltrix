package com.jutahindustani.service;

import com.jutahindustani.dto.SignupRequest;
import com.jutahindustani.entity.User;

public interface UserService {
    User registerUser(SignupRequest signupRequest);
}
