package com.studentshub.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {



    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception)
            throws IOException, ServletException {
        // Постави порака како атрибут за UI-то (на пр. Thymeleaf)
        request.getSession().setAttribute("error", "Неуспешен логин: " + exception.getMessage());

        // Пренасочи назад на страната за логин
        response.sendRedirect("/login?error");
    }
}
