package com.studentshub.model;

import jakarta.persistence.*;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
//@NoArgsConstructor
public class HousingPost extends Post {
    private String municipality;
    private String location;
    private Integer price;
    @ElementCollection
    private List<String> images;
    private boolean isFound;
    @ManyToMany
    private List<Tag> tags;

    public String getMunicipality() {
        return municipality;
    }

    public void setMunicipality(String municipality) {
        this.municipality = municipality;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public List<String> getImages() {
        return images;
    }

    public void setImages(List<String> images) {
        this.images = images;
    }

    public boolean isFound() {
        return isFound;
    }

    public void setFound(boolean found) {
        isFound = found;
    }

    public List<Tag> getTags() {
        return tags;
    }

    public void setTags(List<Tag> tags) {
        this.tags = tags;
    }

    public HousingPost() {
    }

    public HousingPost(String municipality, String location, Integer price, List<String> images, boolean isFound, List<Tag> tags) {
        this.municipality = municipality;
        this.location = location;
        this.price = price;
        this.images = images;
        this.isFound = isFound;
        this.tags = tags;
    }
}