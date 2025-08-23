package com.studentshub.model;

import jakarta.persistence.Entity;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
public class TransportPost extends Post {
    private LocalDateTime departureDatetime;
    private String providerName;
    private String locationFrom;
    private String locationTo;
    private Integer price;
    private String contactInfo;


    public TransportPost(LocalDateTime departureDatetime, String providerName, String locationFrom, String locationTo, Integer price, String contactInfo) {
        this.departureDatetime = departureDatetime;
        this.providerName = providerName;
        this.locationFrom = locationFrom;
        this.locationTo = locationTo;
        this.price = price;
        this.contactInfo = contactInfo;
    }

    public TransportPost() {
    }
    public String getContactInfo() {
        return contactInfo;
    }
    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }
    public LocalDateTime getDepartureDatetime() {
        return departureDatetime;
    }

    public void setDepartureDatetime(LocalDateTime departureDatetime) {
        this.departureDatetime = departureDatetime;
    }

    public String getProviderName() {
        return providerName;
    }

    public void setProviderName(String providerName) {
        this.providerName = providerName;
    }

    public String getLocationFrom() {
        return locationFrom;
    }

    public void setLocationFrom(String locationFrom) {
        this.locationFrom = locationFrom;
    }

    public String getLocationTo() {
        return locationTo;
    }

    public void setLocationTo(String locationTo) {
        this.locationTo = locationTo;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }
}