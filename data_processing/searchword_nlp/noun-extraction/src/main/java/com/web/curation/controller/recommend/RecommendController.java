package com.web.curation.controller.recommend;

import java.io.IOException;
import java.net.URISyntaxException;
import java.util.List;

import com.web.curation.util.Recommend;

import org.apache.mahout.cf.taste.common.TasteException;
import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;

@CrossOrigin(origins = { "*" }, maxAge = 6000)
@RestController
@RequestMapping("/recommend")

public class RecommendController {

    @GetMapping("/items")
    @ApiOperation("아이템 기반 추천 예시. Mahout")
    public List<RecommendedItem> recommendFood() throws IOException, TasteException, URISyntaxException {
        Recommend recommend = new Recommend();

        return recommend.recommendFoodItems();
    }


    @GetMapping("/needs")
    @ApiOperation("부족한 영양성분 기반 음식 아이템 추천")
    public List<Object> recommendFoodItems() {// (@Valid @RequestBody) {
        
        
        return null;
    }
    

}