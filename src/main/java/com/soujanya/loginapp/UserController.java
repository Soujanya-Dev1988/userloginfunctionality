package com.soujanya.loginapp;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/api/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/api/login")
    public String login(@RequestBody LoginRequest request) {
        User user = userRepository.findByUsername(request.username());

        if (user == null) {
            return "Wrong username or password";
        }

        if (user.getPassword().equals(request.password())) {
            return "Login successful";
        }

        return "Wrong username or password";
    }
}