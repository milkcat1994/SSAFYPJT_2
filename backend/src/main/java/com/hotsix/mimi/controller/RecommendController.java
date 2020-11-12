package com.hotsix.mimi.controller;

import com.hotsix.mimi.dao.request.NutrientDao;
import com.hotsix.mimi.dto.BasicResponse;
import com.hotsix.mimi.dto.NutrientSimilarity;
import com.hotsix.mimi.util.ItemBasedRecommend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@ApiResponses(value = { @ApiResponse(code = 401, message = "Unauthorized", response = BasicResponse.class),
		@ApiResponse(code = 403, message = "Forbidden", response = BasicResponse.class),
		@ApiResponse(code = 404, message = "Not Found", response = BasicResponse.class),
		@ApiResponse(code = 500, message = "Failure", response = BasicResponse.class) })
@EnableSwagger2
@CrossOrigin(origins = { "*" })
@RestController
@RequestMapping("/recommend")

public class RecommendController {

    @Autowired
    NutrientDao nutrientDao;

    @PostMapping("/nutrient/")
    @ApiOperation("부족 영양성분 기반 음식 추천")
    public Object recommendNeedsFood(@RequestBody NutrientSimilarity needs) {
        ItemBasedRecommend recommender = new ItemBasedRecommend();
        final BasicResponse result = new BasicResponse();
        result.status = true;
        result.data = "success";
        result.object = recommender.getEuclideanDistance(nutrientDao.findAll(), needs);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}