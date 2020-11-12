package com.web.curation.util;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.apache.mahout.cf.taste.common.TasteException;
import org.apache.mahout.cf.taste.impl.common.LongPrimitiveIterator;
import org.apache.mahout.cf.taste.impl.model.file.FileDataModel;
import org.apache.mahout.cf.taste.impl.recommender.GenericItemBasedRecommender;
import org.apache.mahout.cf.taste.impl.similarity.EuclideanDistanceSimilarity;
import org.apache.mahout.cf.taste.model.DataModel;
import org.apache.mahout.cf.taste.recommender.ItemBasedRecommender;
import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.apache.mahout.cf.taste.similarity.ItemSimilarity;

public class Recommend {

    public List<RecommendedItem> recommendFoodItems() throws IOException, TasteException {
        String path = "C:/workspace/PJT-workspace/PJT2-2/data_processing/searchword_nlp/noun-extraction/src/main/resources/";
        DataModel model = new FileDataModel(new File(path + "test.csv"));
        // ItemSimilarity similarity = new TanimotoCoefficientSimilarity(model);
        ItemSimilarity similarity = new EuclideanDistanceSimilarity(model);
        // ItemSimilarity similarity = new PearsonCorrelationSimilarity(model);
        ItemBasedRecommender itemRecommender = new GenericItemBasedRecommender(model, similarity);
        LongPrimitiveIterator ids = model.getItemIDs();

        Long itemId = ids.nextLong();
        System.out.println(itemId);

        for(LongPrimitiveIterator items = model.getItemIDs(); items.hasNext();){
            System.out.print(items.nextLong() + ", ");
        }
        System.out.println();

        List<RecommendedItem> recommendations = itemRecommender.mostSimilarItems(itemId, 5);
        for (RecommendedItem recommendation : recommendations) {
            System.out.println(recommendation);
        }

        return recommendations;
    }

}
