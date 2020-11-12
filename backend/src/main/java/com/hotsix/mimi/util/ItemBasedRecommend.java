package com.hotsix.mimi.util;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import com.hotsix.mimi.dto.NutrientSimilarity;
import com.hotsix.mimi.dto.StoreDistance;
import com.hotsix.mimi.dto.request.Nutrient;
import com.hotsix.mimi.dto.request.Store;


public class ItemBasedRecommend {
    final double stdScore = 10.0;        // 표준 점수
    final int recommendNum = 10;    // 추천 개수

    public List<NutrientSimilarity> getEuclideanDistance(List<Nutrient> foods, NutrientSimilarity needs){

        // 점심, 저녁 고려
        Date date_now = new Date(System.currentTimeMillis()); // 현재시간을 가져와 Date형으로 저장한다
        SimpleDateFormat hour_format = new SimpleDateFormat("HH"); 
        int hour = Integer.parseInt(hour_format.format(date_now));
        int division;

        // System.out.println(hour_format.format(date_now)); 

        if (hour <= 10) division = 3;   // 아침
        else if (hour <= 15) division = 2;  // 점심
        else division = 1;  // 저녁
        
        double energy = needs.getEnergy() / division;
        double protein = needs.getProtein() / division;
        double carbohydrate = needs.getCarbohidrate() / division;
        double fat = needs.getFat() / division;


        List<NutrientSimilarity> recommendList = new ArrayList<NutrientSimilarity>();

        for (Nutrient nutrient : foods) {
            // FOOD, ENERGY, PROTEIN, FAT, CARBOHYDRATE, CALCIUM, SODIUM, IRON, P, K, VITAMIN_B1, VITAMIN_B2, VITAMIN_C
            // 유클리디안 거리 구하기
            double sum = 0;
            // 표준 점수화
            // double stdEnergy = (needs.getEnergy() * stdScore) / nutrient.getEnergy();
            // double stdProtein = (needs.getProtein() * stdScore) / nutrient.getProtein();
            // double stdFat = (needs.getFat() * stdScore) / nutrient.getFat();
            // double stdCarbohidrate = (needs.getCarbohidrate() * stdScore) / nutrient.getCalcium();


            // energy distance, g기준 맞추기 위해 5.1나눔 칼로리 평균 그람수....
            sum += (nutrient.getEnergy()- energy)/5.1 * (nutrient.getEnergy() - energy)/5.1;
            // protein distance
            sum += (nutrient.getProtein() - protein) * (nutrient.getProtein() - protein);
            // fat distance
            sum += (nutrient.getFat() - fat) * (nutrient.getFat() - fat);
            // carbohudrate distance
            sum += (nutrient.getCarbohidrate() - carbohydrate) * (nutrient.getCarbohidrate() - carbohydrate);
        
            // 유사도 계산
            double similarity = 1 / (1 + Math.sqrt(sum));

            NutrientSimilarity nutrientSimilarity = new NutrientSimilarity(
                nutrient.getId(), nutrient.getFood(), nutrient.getEnergy(), nutrient.getProtein(), 
                nutrient.getFat(), nutrient.getCarbohidrate());
            nutrientSimilarity.setSimilarity(similarity);
            recommendList.add(nutrientSimilarity);
        }

        // 유사도 높은순 정렬
        recommendList.sort(new Comparator<NutrientSimilarity>(){
            @Override
            public int compare(NutrientSimilarity o1, NutrientSimilarity o2) {
                double a = o1.getSimilarity();
                double b = o2.getSimilarity();
                if (a > b) return -1;
                else if (a < b) return 1;
                else return 0;
            }
        });

        // 상위 recommendNum개 추천
        return recommendList.subList(0, recommendNum);
    }
    

    public List<StoreDistance> getStoreDistance(List<Store> stores, double lat, double lng, String food1, String food2){
        List<StoreDistance> nearStoreList = new ArrayList<StoreDistance>();

        for (Store store: stores) {

            double sum = 0;
            sum += (lat - store.getLatitude()) * (lat - store.getLatitude());
            sum += (lng - store.getLongitude()) * (lng - store.getLongitude());

            // 메뉴 정리. 궁합음식 있는 메뉴만 저장
            StringBuilder compMenu = new StringBuilder();
            String[] menuList = store.getMenu().split("\\|");

            for (String menu: menuList) {
                if (menu.indexOf(food1) >= 0 || menu.indexOf(food2) >= 0) {
                    compMenu.append(menu + "|");
                }
            }

            StoreDistance storeDist = new StoreDistance(store.getId(), store.getName(), store.getArea(), store.getTel(), 
                store.getAddress(), store.getLatitude(), store.getLongitude(), store.getCategory(), compMenu.toString().substring(0, compMenu.length()-1));
            storeDist.setDistance(sum);

            nearStoreList.add(storeDist);
        }

        nearStoreList.sort(new Comparator<StoreDistance>(){
            @Override
            public int compare(StoreDistance o1, StoreDistance o2) {
                double a = o1.getDistance();
                double b = o2.getDistance();
                if (a > b) return 1;
                else if (a < b) return -1;
                else return 0;
            }
        });

        return nearStoreList;
    }

}
