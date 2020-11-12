package com.hotsix.mimi.controller;

import java.util.List;

import com.hotsix.mimi.dao.request.StoreDao;
import com.hotsix.mimi.dto.BasicResponse;
import com.hotsix.mimi.dto.request.Store;
import com.hotsix.mimi.util.ItemBasedRecommend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
@RequestMapping("/store")

public class StoreController {

    @Autowired
    StoreDao storeDao;

    @GetMapping("/comp")
    @ApiOperation("궁합 음식 판매 음식점: /store/comp?food1=..&food2=..")
    public Object compatibilityStores(@RequestParam(required = true)String food1, @RequestParam(required = true)String food2) {
        food1 = food1.trim();   // 공백 제거
        food2 = food2.trim();
        final BasicResponse result = new BasicResponse();
        result.status = true;
        result.data = "success";
        result.object = storeDao.findByMenuLikeAndMenuLike(food1, food2);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

    @GetMapping("/near")
    @ApiOperation("가까운 궁합 음식 판매 음식점: /store/near?food1=..&food2=..&lat=..&lng=..")
    public Object nearbyStores(@RequestParam(required = true)String food1, @RequestParam(required = true)String food2,
                                    @RequestParam(required = true)double lat, @RequestParam(required = true)double lng) {
        food1 = food1.trim();   // 공백 제거
        food2 = food2.trim();
        // 음식점 거리
        ItemBasedRecommend itemBasedRecommend = new ItemBasedRecommend();

        List<Store> stores = storeDao.findByMenuLikeAndMenuLike(food1, food2);
        final BasicResponse result = new BasicResponse();
        result.status = true;
        result.data = "success";
        result.object = itemBasedRecommend.getStoreDistance(stores, lat, lng, food1, food2);
        return new ResponseEntity<>(result, HttpStatus.OK);
    }

}