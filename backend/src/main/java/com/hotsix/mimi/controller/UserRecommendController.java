package com.hotsix.mimi.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.Set;
import java.util.UUID;

import javax.validation.Valid;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.hotsix.mimi.dao.UserDao;
import com.hotsix.mimi.dao.request.StoreDao;
import com.hotsix.mimi.dao.request.UserProfileDao;
import com.hotsix.mimi.dto.request.Store;
import com.hotsix.mimi.dto.request.StoreReview;
import com.hotsix.mimi.dto.request.UserProfile;
import com.hotsix.mimi.dto.BasicResponse;
import com.hotsix.mimi.dto.user.User;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@ApiResponses(value = { @ApiResponse(code = 401, message = "Unauthorized", response = BasicResponse.class),
		@ApiResponse(code = 403, message = "Forbidden", response = BasicResponse.class),
		@ApiResponse(code = 404, message = "Not Found", response = BasicResponse.class),
		@ApiResponse(code = 500, message = "Failure", response = BasicResponse.class)})
@EnableSwagger2
//@CrossOrigin(origins = { "https://i3a307.p.ssafy.io" }) //이쪽에 있는 내용만 받아온다는것.
@CrossOrigin(origins = { "*" })


@RestController
public class UserRecommendController {

	@Autowired
	StoreDao storeDao;

	List<String> taste =Arrays.asList("매운","친절한","양이많은","아기자기","인테리어가좋은","이국적인","기념일","가족모임","신선한","몸보신","전망좋은","회식","유명한","깔끔한","얼큰한","존맛탱","깨끗한","고급스러운","담백한","건강한","단","분위기좋은","가성비","데이트","무료주차");

	@PostMapping("/recommend/userbased")
	@ApiOperation(value = "userbased 사용자와 비슷한 취향의 사람들이 추천하는 다른 매장")
	public Object GetRecommendedStore(@Valid @RequestBody String inputWord) throws IOException {
		String keyword =inputWord;
		System.out.println("시작>>>"+inputWord);
		List<Store> storeList = storeDao.findUserRecommendStore(keyword);
		System.out.println(storeList);
        //if (storeList != null) {
		return new ResponseEntity<>(storeList, HttpStatus.OK);
		//} else {
		//	return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		//}
	}
	
	@PostMapping("/recommend/store")
	@ApiOperation(value = "userbased 키워드의 매장중 평점 4이상의 매장")
	public Object StoreHighScore(@Valid @RequestBody String inputWord) throws IOException {
		
		String keyword =inputWord;
		List<Store> storeList;
		
		if(taste.contains(keyword)){ // taste 에 포함되는 단어면 "filter list 키워드(매운,단,짠,분위기)가 들어간 리뷰의 매장중 평점 4이상의 매장"
			
			switch(keyword){
				case "친절한":
					keyword="친절";
					break;
				case "깔끔한":
					keyword="깔끔";
					break;
				case "유명한":
					keyword="유명";
					break;
				case "전망좋은":
					keyword="뷰";
					break;
				case "가족모임":
					keyword="가족";
					break;
				case "신선한":
					keyword="신선";
					break;
				case "이국적인":
					keyword="이국";
					break;
				case "인테리어가좋은":
					keyword="인테리어";
					break;
				case "양이많은":
					keyword="양이 많";
					break;

			}
			
			storeList = storeDao.findfilterHighScore(keyword);
		}else{ 
			storeList = storeDao.findHighScore(keyword); // "userbased 키워드의 매장중 평점 4이상의 매장"
		}
        //if (storeList != null) {
		return new ResponseEntity<>(storeList, HttpStatus.OK);
		//} else {
		//	return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		//}
	}
	// 식당 카테고리 extraction
	@PostMapping("/recommend/category")
	@ApiOperation(value = "Store의 category 목록")
	public Object StoreGetCategory() throws IOException {
		
		List<String> storeList = storeDao.findCategory();
		Set<String> categorySet =new HashSet();
		
		for (String string : taste) {
			categorySet.add(string);
		}
		
		for (String string : storeList) {
			if(string.contains("|")){
				for (String str : string.split("\\|")) {
					if(str.contains("전문")) continue;
					categorySet.add(str);
				}
			}else{
				if(!string.equals("")){
					categorySet.add(string);
				}
				
			}
			
		}
		
		System.out.println("카테고리 수:"+categorySet.size());
        //if (storeList != null) {
		return new ResponseEntity<>(categorySet, HttpStatus.OK);
		//} else {
		//	return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		//}
	}


}