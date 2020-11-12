package com.hotsix.mimi.dto.request;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name="`STORE`")
@Data
public class Store {
    // ID, NAME, AREA, TEL, ADDRESS, LATITUDE, LONGITUDE, CATEGORY, MENU
    @Id
    private int id;

    @Column(name = "NAME")
    private String name;
    
    @Column(name = "AREA")
    private String area;
    
    @Column(name = "TEL")
    private String tel;
    
    @Column(name = "ADDRESS")
    private String address;
    
    @Column(name = "LATITUDE")
    private double latitude;
    
    @Column(name = "LONGITUDE")
    private double longitude;
    
    @Column(name = "CATEGORY")
    private String category;
    
    @Column(name = "MENU")
    private String menu;
    
}
