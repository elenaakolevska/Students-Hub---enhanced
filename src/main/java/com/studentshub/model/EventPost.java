package com.studentshub.model;

import com.studentshub.model.enumerations.EventCategory;
import com.studentshub.model.enumerations.PostCategory;
import jakarta.persistence.*;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
//@NoArgsConstructor
public class EventPost extends Post {
    @Enumerated(EnumType.STRING)
    private EventCategory eventCategory;
    private String location;
    private boolean isFree;
    @Column(nullable = true)
    private Integer price;
    private String organizer;
    private String imageUrl;

    public EventPost() {
    }

    public EventPost(EventCategory eventCategory, String location, boolean isFree, Integer price, String organizer, String imageUrl) {
        this.eventCategory = eventCategory;
        this.location = location;
        this.isFree = isFree;
        this.price = price;
        this.organizer = organizer;
        this.imageUrl = imageUrl;
    }

    public EventPost(Long id, String title, String description, LocalDateTime createdAt, User owner, PostCategory category, EventCategory eventCategory, String location, boolean isFree, Integer price, String organizer, String imageUrl) {
        super(id, title, description, createdAt, owner, category);
        this.eventCategory = eventCategory;
        this.location = location;
        this.isFree = isFree;
        this.price = price;
        this.organizer = organizer;
        this.imageUrl = imageUrl;
    }
    @Override
    public String getDescription() {
        return super.getDescription();
    }
    @Override
    public void setDescription(String description) {
        super.setDescription(description);
    }

    public void setEventCategory(EventCategory eventCategory) {
        this.eventCategory = eventCategory;
    }


    public EventCategory getEventCategory() {
        return eventCategory;
    }

    public void setCategory(EventCategory category) {
        this.eventCategory = category;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isFree() {
        return isFree;
    }

    public void setFree(boolean free) {
        isFree = free;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getOrganizer() {
        return organizer;
    }

    public void setOrganizer(String organizer) {
        this.organizer = organizer;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
