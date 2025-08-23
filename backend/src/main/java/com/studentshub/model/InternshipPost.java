package com.studentshub.model;

import com.studentshub.model.enumerations.PostCategory;
import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
public class InternshipPost extends Post {
    private String company;
    private String facultyFilter;
    private String position;
    private String logoUrl;

    public InternshipPost(String company, String facultyFilter, String position, String logoUrl) {
        this.company = company;
        this.facultyFilter = facultyFilter;
        this.position = position;
        this.logoUrl = logoUrl;
    }

    public InternshipPost() {
    }

    public InternshipPost(Long id, String title, String description, LocalDateTime createdAt, User owner, PostCategory category, String company, String facultyFilter, String position, String logoUrl) {
        super(id, title, description, createdAt, owner, category);
        this.company = company;
        this.facultyFilter = facultyFilter;
        this.position = position;
        this.logoUrl = logoUrl;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getFacultyFilter() {
        return facultyFilter;
    }

    public void setFacultyFilter(String facultyFilter) {
        this.facultyFilter = facultyFilter;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
}
