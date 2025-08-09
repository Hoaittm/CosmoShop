package com.rainbowforest.userservice.service;

import com.rainbowforest.userservice.entity.User;
import com.rainbowforest.userservice.entity.UserDetails;
import com.rainbowforest.userservice.entity.UserRole;
import com.rainbowforest.userservice.repository.UserDetailsRepository;
import com.rainbowforest.userservice.repository.UserRepository;
import com.rainbowforest.userservice.repository.UserRoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserDetailsRepository userDetailsRepository;
    @Autowired
    private UserRoleRepository userRoleRepository;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.getOne(id);
    }

    @Override
    public UserDetails getUserDetailById(Long id) {
        return userDetailsRepository.getOne(id);
    }

    @Override
    public User getUserByName(String userName) {
        return userRepository.findByUserName(userName);
    }

    @Override
    public User findByUserName(String username) {
        return userRepository.findByUserName(username);
    }

    @Override
    public UserDetails getUserByEmail(String email) {
        return userDetailsRepository.findByEmail(email);
    }

    @Override
    public boolean deleteUserById(Long id) {
        User user = userRepository.findById(id).orElse(null);
        if (user != null) {
            userRepository.delete(user);
            return true;
        }
        return false;
    }

    @Override
    public User saveUser(User user) {
        user.setActive(1);
        user.setUserPassword(bCryptPasswordEncoder.encode(user.getUserPassword()));
        String roleName = user.getRole().getRoleName();
        UserRole role = userRoleRepository.findUserRoleByRoleName(roleName);
        user.setRole(role);

        return userRepository.save(user);
    }

    @Override
    public User saveUserWithoutPassword(User user) {
        user.setActive(1);
        String roleName = user.getRole().getRoleName();
        UserRole role = userRoleRepository.findUserRoleByRoleName(roleName);
        user.setRole(role);

        return userRepository.save(user);
    }

    public UserRole getDefaultRole() {
        return userRoleRepository.findUserRoleByRoleName("USER");
    }

    @Override
    public User updateUser(User user) {
        return userRepository.save(user);
    }

}
