package com.hotsix.mimi.dto;

import lombok.Data;

@Data
public class NutrientSimilarity {
    private int id;
    private String food;
    private double energy;
    private double protein;
    private double fat;
    private double carbohidrate;
    // private double calcium;
    // private double sodium;
    // private double iron;
    // private double p;
    // private double k;
    // private double vitaminB1;
    // private double vitaminB2;
    // private double vitaminC;
    public double similarity;

    public NutrientSimilarity(){}

    public NutrientSimilarity(int id, String food, double energy, double protein, double fat, double carbohidrate) {
        this.id = id;
        this.food = food;
        this.energy = energy;
        this.protein = protein;
        this.fat = fat;
        this.carbohidrate = carbohidrate;
    }

}
