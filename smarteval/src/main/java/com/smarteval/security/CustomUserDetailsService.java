package com.smarteval.security;

import com.smarteval.entity.User;
import com.smarteval.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // 🚨 THIS IS THE CRITICAL LINE
        // It maps your DB role to a Spring Authority
        List<SimpleGrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority(user.getRole().name())
        );

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                authorities // Pass the authorities here!
        );
    }
}