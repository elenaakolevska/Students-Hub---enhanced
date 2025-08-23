package com.studentshub.model;

import com.studentshub.model.enumerations.PostCategory;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class TutorPost extends Post {
    private String tutorName;
    private String faculty;
    private boolean worksOnline;
    private Integer price;
    private String subject;
    @ManyToOne
    @JoinColumn(name = "tutor_id")
    private User tutor;



    public TutorPost(String tutorName, String faculty, boolean worksOnline, Integer price, String subject, User tutor) {
        this.tutorName = tutorName;
        this.faculty = faculty;
        this.worksOnline = worksOnline;
        this.price = price;
        this.subject = subject;
        this.tutor = tutor;
    }
    public TutorPost(Long id, String title, String description, LocalDateTime createdAt, User owner, PostCategory category,
                     String tutorName, String faculty, boolean worksOnline, Integer price, String subject, User tutor) {
        super(id, title, description, createdAt, owner, category);
        this.tutorName = tutorName;
        this.faculty = faculty;
        this.worksOnline = worksOnline;
        this.price = price;
        this.subject = subject;
        this.tutor = tutor;
    }


    public TutorPost() {
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public User getTutor() {
        return tutor;
    }

    public void setTutor(User tutor) {
        this.tutor = tutor;
    }

    public String getTutorName() {
        return tutorName;
    }

    public void setTutorName(String tutorName) {
        this.tutorName = tutorName;
    }

    public String getFaculty() {
        return faculty;
    }

    public void setFaculty(String faculty) {
        this.faculty = faculty;
    }

    public boolean isWorksOnline() {
        return worksOnline;
    }

    public void setWorksOnline(boolean worksOnline) {
        this.worksOnline = worksOnline;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }


}