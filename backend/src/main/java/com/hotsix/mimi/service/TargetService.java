package com.hotsix.mimi.service;

import com.hotsix.mimi.dto.request.Nutrient;

public class TargetService {
    
    final int[] s = {5, -151};    // 0: 남, 1: 여
    final double[][] nutrientRate = {{0.3, 0.4, 0.3}, {0.5, 0.3, 0.2}, {0.4, 0.4, 0.2}};  // 0: 감량, 1: 체중증가, 2: 벌크업

    public Nutrient getIntakeRate(int targetWeight, int height, int genderType, int targetType, int age) {
        // 목표 열량 (kcal)
        double targetEnergy = ( (10 * targetWeight) + (6.25 * height) - (5.0 * age) + s[genderType] ) * 1.4;
        // 목표 탄수화물 섭취량 (g)
        double targetCarbohidrate = (double)(targetEnergy * nutrientRate[targetType][0]) / 4.0;
        // 목표 단백질 섭취량 (g)
        double targetProtein = (targetEnergy * nutrientRate[targetType][1]) / 4.0;
        // 목표 지방 섭취량 (g)
        double targetFat = (targetEnergy * nutrientRate[targetType][2]) / 9.0;

        Nutrient target = new Nutrient();
        target.setEnergy(targetEnergy);
        target.setCarbohidrate(targetCarbohidrate);
        target.setProtein(targetProtein);
        target.setFat(targetFat);
        
        return target;
    }
    
}
