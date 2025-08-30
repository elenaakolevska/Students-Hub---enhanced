package com.studentshub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.HeadersConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUsernamePasswordAuthenticationProvider authProvider;


        public SecurityConfig(CustomUsernamePasswordAuthenticationProvider authProvider) {
                this.authProvider = authProvider;
        }

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
            .cors(cors -> cors
                .configurationSource(request -> {
                    CorsConfiguration corsConfig = new CorsConfiguration();
                    corsConfig.setAllowedOrigins(List.of("http://localhost:3000"));
                    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfig.setAllowedHeaders(List.of("*") );
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                })
            )
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(HeadersConfigurer.FrameOptionsConfig::sameOrigin))
                        .authorizeHttpRequests(requests -> requests
                                .requestMatchers("/users/register", "/users/login", "/uploads/**", "/assets/**", "/css/**", "/js/**", "/images/**", "/webjars/**").permitAll()
                                .requestMatchers("/admin/**").hasRole("ADMIN")
                                .requestMatchers("/api/**", "/chat/**").authenticated()
                                .anyRequest().permitAll()
                        )
                        .formLogin(form -> form
                            .loginPage("/users/login")
                            .permitAll()
                        )
                        .logout(logout -> logout
                            .logoutUrl("/users/logout")
                            .permitAll()
                        )
                        .sessionManagement(session -> session
                            .maximumSessions(1)
                            .maxSessionsPreventsLogin(false)
                        );
                return http.build();
        }



    @Bean
    public AuthenticationManager authManager(HttpSecurity http) throws Exception {
        AuthenticationManagerBuilder authenticationManagerBuilder =
                http.getSharedObject(AuthenticationManagerBuilder.class);
        authenticationManagerBuilder.authenticationProvider(authProvider);
        return authenticationManagerBuilder.build();
    }
}
