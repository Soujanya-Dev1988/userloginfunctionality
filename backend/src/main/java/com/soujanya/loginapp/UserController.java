package com.soujanya.loginapp;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200")
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

    @PostMapping("/api/signup")
    public String signup(@RequestBody LoginRequest request) {
        User existing = userRepository.findByUsername(request.username());

        if (existing != null) {
            return "Username already taken";
        }

        User newUser = new User(request.username(), request.password());
        userRepository.save(newUser);
        return "Sign up successful";
    }
    @PostMapping("/api/details")
    public String saveDetails(@RequestBody DetailsRequest request) {
        User user = userRepository.findByUsername(request.username());

        if (user == null) {
            return "User not found";
        }

        if (!request.phone().matches("[0-9]+")) {
            return "Phone number must contain only numbers";
        }

        user.updateDetails(request.firstName(), request.lastName(), request.address(), request.phone());
        userRepository.save(user);

        return "Details saved successfully";
    }
}