package com.hotsix.mimi.dto;

import lombok.Data;

@Data
public class StoreDistance {
    private int id;
    private String name;
    private String area;
    private String tel;
    private String address;
    private double latitude;
    private double longitude;
    private String category;
    private String menu;
    private double distance;

    public StoreDistance(){}

    public StoreDistance(int id, String name, String area, String tel, String address, double latitude, 
                        double longitude, String category, String menu){
        this.id = id;
        this.name = name;
        this.area = area;
        this.tel = tel;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.category = category;
        this.menu = menu;
    }
}
