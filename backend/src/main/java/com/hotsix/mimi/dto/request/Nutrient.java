package com.hotsix.mimi.dto.request;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name="`NUTRIENT_NEW`")
// @Table(name="`NUTRIENT`")
@Data
public class Nutrient {
    // FOOD, ENERGY, PROTEIN, FAT, CARBOHYDRATE, CALCIUM, SODIUM, IRON, P, K, VITAMIN_B1, VITAMIN_B2, VITAMIN_C
    // ID, FOOD, ENERGY, CARBOHYDRATE, PROTEIN, FAT, CHOLESTEROL, FIBER, SODIUM
    @Id
	private int id;

    @Column(name = "FOOD")
    private String food;

    @Column(name = "ENERGY")
    private double energy;

    @Column(name = "PROTEIN")
    private double protein;

    @Column(name = "FAT")
    private double fat;

    @Column(name = "CARBOHYDRATE")
    private double carbohidrate;

    // @Column(name = "CALCIUM")
    // private double calcium;

    @Column(name = "SODIUM")
    private double sodium;

    // @Column(name = "IRON")
    // private double iron;

    // @Column(name = "P")
    // private double p;

    // @Column(name = "K")
    // private double k;

    // @Column(name = "VITAMIN_B1")
    // private double vitaminB1;

    // @Column(name = "VITAMIN_B2")
    // private double vitaminB2;
    
    // @Column(name = "VITAMIN_C")
    @Column(name = "CHOLESTEROL")
    private double cholesterol;

    @Column(name = "FIBER")
    private double fiber;
}