package com.studentshub.dto.display;

import com.fasterxml.jackson.annotation.JsonProperty;

public class JwtAuthResponse {
    private final String token;
    private final DisplayUserDto user;

    public JwtAuthResponse(String token, DisplayUserDto user) {
        this.token = token;
        this.user = user;
    }

    @JsonProperty("token")
    public String getToken() {
        return token;
    }

    @JsonProperty("user")
    public DisplayUserDto getUser() {
        return user;
    }
}
