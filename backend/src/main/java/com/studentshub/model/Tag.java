package com.studentshub.model;

import com.studentshub.model.enumerations.PostCategory;
import jakarta.persistence.*;

@Entity
public class Tag {
    @Id
    @GeneratedValue (strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    private PostCategory postCategory;

    public Tag() {
    }

    public Tag(Long id, String name, PostCategory postCategory) {
        this.id = id;
        this.name = name;
        this.postCategory = postCategory;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public PostCategory getPostCategory() {
        return postCategory;
    }

    public void setPostCategory(PostCategory postCategory) {
        this.postCategory = postCategory;
    }
}

