package com.rainbowforest.userservice.service;

import java.util.List;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.entity.UserDetails;
import com.rainbowforest.userservice.entity.UserRole;

public interface UserService {
    List<User> getAllUsers();

    User getUserById(Long id);

    UserDetails getUserDetailById(Long id);

    public User updateUser(User user);

    User getUserByName(String userName);

    public boolean deleteUserById(Long id);

    User saveUser(User user);

    User findByUserName(String username);

    public UserDetails getUserByEmail(String email);

    public User saveUserWithoutPassword(User user);

    public UserRole getDefaultRole();
}
