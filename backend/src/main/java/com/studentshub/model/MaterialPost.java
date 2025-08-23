package com.studentshub.model;

import com.studentshub.model.enumerations.PostCategory;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
public class MaterialPost extends Post {
    private Double rating;
    private String fileUrl;
    @ManyToMany
    private List<Tag> tags;
    private String originalFileName;
    private String subject;





    public MaterialPost() {
    }

    public MaterialPost(Long id, String title, String description, LocalDateTime createdAt, User owner, PostCategory category,
                        Double rating, String fileUrl, List<Tag> tags, String originalFileName, String subject) {
        super(id, title, description, createdAt, owner, category);
        this.rating = rating;
        this.fileUrl = fileUrl;
        this.tags = tags;
        this.originalFileName = originalFileName;
        this.subject = subject;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }
}
