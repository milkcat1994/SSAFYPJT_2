package com.hotsix.mimi.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
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

import com.hotsix.mimi.dao.request.CompatibilityDao;
import com.hotsix.mimi.dao.request.DiseaseDao;
import com.hotsix.mimi.dao.request.InCompatibilityDao;
import com.hotsix.mimi.dao.request.ReviewDao;
import com.hotsix.mimi.dto.request.Compatibility;
import com.hotsix.mimi.dto.request.Disease;
import com.hotsix.mimi.dto.request.DiseaseRequest;
import com.hotsix.mimi.dto.request.InCompatibility;
import com.hotsix.mimi.dto.request.Review;
import com.hotsix.mimi.dto.request.ReviewRequest;
import com.hotsix.mimi.dto.request.SearchRequest;
import com.hotsix.mimi.dto.BasicResponse;

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
public class CompatibilityController {

	@Autowired
	CompatibilityDao compatibilityDao;
	
	@Autowired
	InCompatibilityDao inCompatibilityDao;
	
	@Autowired
	DiseaseDao diseaseDao;
	
	@Autowired
	ReviewDao reviewDao;
	
	@GetMapping("/compatibility")
	@ApiOperation(value = "오늘의 궁합 Top3")
	public Object top3compatibility() throws IOException {
		List<Compatibility> top3Compatibility = compatibilityDao.findTop3ByOrderBySearchCntDesc();
		for(Compatibility temp : top3Compatibility) {
			System.out.println(temp.getFoodA() + " " + temp.getFoodB());
		}
		
		return new ResponseEntity<>(top3Compatibility, HttpStatus.OK);
	}
	
	@PostMapping("/compatibility")
	@ApiOperation(value = "검색어에 따른 궁합 리스트")
	public Object SearchCompatibility(@Valid @RequestBody Compatibility searchFood) throws IOException {
		List<Compatibility> compList 
		= compatibilityDao.findAllByFoodAOrFoodB(searchFood.getFoodA(), searchFood.getFoodA());
		if(compList.size() == 0) {
			return new ResponseEntity<>(compList, HttpStatus.OK);
		}
		for(Compatibility temp : compList) {
			System.out.println(temp.getFoodA() + " " + temp.getFoodB());
		}
		
		return new ResponseEntity<>(compList, HttpStatus.OK);
	}
	
	@PostMapping("/incompatibility")
	@ApiOperation(value = "검색어에 따른 상극 궁합 리스트")
	public Object SearchInCompatibility(@Valid @RequestBody InCompatibility searchFood) throws IOException {
		List<InCompatibility> inCompList 
		= inCompatibilityDao.findAllByFoodAOrFoodB(searchFood.getFoodA(), searchFood.getFoodA());
		
		if(inCompList.size() == 0) {
			return new ResponseEntity<>(inCompList, HttpStatus.OK);
		}
		for(InCompatibility temp : inCompList) {
			System.out.println(temp.getFoodA() + " " + temp.getFoodB());
		}
		
		return new ResponseEntity<>(inCompList, HttpStatus.OK);
	}
	
	@PostMapping("/disease")
	@ApiOperation(value = "질병에 따른 상극, 궁합 리스트")
	public Object SearchDisease(@Valid @RequestBody Disease disease) throws IOException {
		System.out.println(disease.getName());
		List<InCompatibility> inCompList 
		= inCompatibilityDao.findByDescriptionContaining(disease.getName());
		
		List<Compatibility> compList 
		= compatibilityDao.findByDescriptionContaining(disease.getName());
		
		DiseaseRequest list = new DiseaseRequest();
		list.setCompDisease(compList);
		list.setIncompDisease(inCompList);
		
		return new ResponseEntity<>(list, HttpStatus.OK);
	}
	
	@GetMapping("/searchword")
	@ApiOperation(value = "질병, 음식 검색단어 리스트")
	public Object SearchWord() {
		SearchRequest searchWordList = new SearchRequest();
		searchWordList.setDiesaseList(diseaseDao.selectAll());
		searchWordList.setCompList(compatibilityDao.selectAll());
		
		return new ResponseEntity<>(searchWordList, HttpStatus.OK);
	}
	
	
	@GetMapping("/compatibility/detail")
	@ApiOperation(value = "특정 음식 궁합에 대한 상세페이지")
	public Object CompatibilityDetail(@RequestParam("id") int id, @RequestParam("uid") String uid) {
		
		Compatibility detail = compatibilityDao.findOneById(id);
		ReviewRequest reviewRequest = new ReviewRequest(); //궁합과  사용자의 리뷰 작성 여부를 넘겨준다.
		if(reviewDao.findByCompatibilityIdAndUserId(id, uid) == null) { //사용자가 이 궁합에 리뷰를 작성한적이 없다면 
			reviewRequest.setReviewCheck(false);
		}else reviewRequest.setReviewCheck(true);
		detail.setSearchCnt(detail.getSearchCnt()+1); //현재 상세페이지로 넘어오게 된 궁합의 경우 검색횟수를 추가해준다.
		compatibilityDao.save(detail); //검색횟수 추가 후 update
		
		reviewRequest.setData(detail);
		return new ResponseEntity<>(reviewRequest, HttpStatus.OK);
	}
	
	@GetMapping("/incompatibility/detail")
	@ApiOperation(value = "특정 음식 상극에 대한 상세페이지")
	public Object InCompatibilityDetail(@RequestParam("id") int id, @RequestParam("uid") String uid) {
		InCompatibility detail = inCompatibilityDao.findOneById(id);
		ReviewRequest reviewRequest = new ReviewRequest(); //상극과  사용자의 리뷰 작성 여부를 넘겨준다.
		if(reviewDao.findByCompatibilityIdAndUserId(id, uid) == null) { //사용자가 이 상극에 리뷰를 작성한적이 없다면 
			reviewRequest.setReviewCheck(false);
		}else reviewRequest.setReviewCheck(true);
		detail.setSearchCnt(detail.getSearchCnt()+1); //현재 상세페이지로 넘어오게 된 상극의 경우 검색횟수를 추가해준다.
		inCompatibilityDao.save(detail); //검색횟수 추가 후 update
		
		reviewRequest.setData(detail);
		//현재 상극에 대해서는 리뷰의 경우 어떻게 할 지 정해야 한다.
		return new ResponseEntity<>(detail, HttpStatus.OK);
	}
	
	@PostMapping("/compatibility/detail")
	@ApiOperation(value = "특정 궁합에 대한 리뷰등록")
	public Object CompatibilityReview(@Valid @RequestBody Review review) {
		reviewDao.save(review);
		
		return new ResponseEntity<>(true, HttpStatus.OK);
	}
}