package com.hotsix.mimi.dto.request;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "`STORE_REVIEW`")
@Data
public class StoreReview {
    @Id
    private int id;

    private String store;
    private String user;
    private String score;
    private String content;
    private String reg_time;

    public int getId() {
        return this.id;
    }


    public void setId(int id) {
        this.id = id;
    }

 


}
