package com.hotsix.mimi.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hotsix.mimi.dao.request.MissionDao;
import com.hotsix.mimi.dao.request.NutrientDao;
import com.hotsix.mimi.dao.request.UserDietDao;
import com.hotsix.mimi.dao.request.UserProfileDao;
import com.hotsix.mimi.dto.BasicResponse;
import com.hotsix.mimi.dto.request.Mission;
import com.hotsix.mimi.dto.request.Nutrient;
import com.hotsix.mimi.dto.request.UserDiet;
import com.hotsix.mimi.dto.request.UserProfile;
import com.hotsix.mimi.service.TargetService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import net.bytebuddy.dynamic.TargetType;
import springfox.documentation.swagger2.annotations.EnableSwagger2;
@ApiResponses(value = { @ApiResponse(code = 401, message = "Unauthorized", response = BasicResponse.class),
		@ApiResponse(code = 403, message = "Forbidden", response = BasicResponse.class),
		@ApiResponse(code = 404, message = "Not Found", response = BasicResponse.class),
		@ApiResponse(code = 500, message = "Failure", response = BasicResponse.class) })
@EnableSwagger2
@CrossOrigin(origins = { "*" })
@RestController
public class DietController {
	@Autowired
	UserProfileDao userProfileDao;
	
	@Autowired
	UserDietDao userDietDao;
	
	@Autowired
	NutrientDao nutrientDao;
	
	@Autowired
	MissionDao missionDao;
	
	@PostMapping("/profile/target")
	@ApiOperation(value = "회원 목표 설정")
	public Object registTarget(@Valid @RequestBody UserProfile user) {
		UserProfile targetUser = userProfileDao.getUserProfileByUid(user.getUid());
		//입력받은 몸무게와 타입을 갱신해준다.
		targetUser.setTargetType(user.getTargetType());
		targetUser.setTargetWeight(user.getTargetWeight());
		targetUser.setAge(user.getAge());
		targetUser.setGenderType(user.getGenderType());
		targetUser.setHeight(user.getHeight());

		TargetService targetService = new TargetService();
		// 타겟 타입
		int targetType = 0;
		if (targetUser.getTargetType().equals("체중감량")) targetType = 0;
		else if (targetUser.getTargetType().equals("체중증가")) targetType = 1;
		else if (targetUser.getTargetType().equals("근육생성")) targetType = 2;

		// 권장 섭취량
		Nutrient target = targetService.getIntakeRate(targetUser.getTargetWeight(), targetUser.getHeight(), targetUser.getGenderType(), targetType, targetUser.getAge());
		targetUser.setTargetEnergy(target.getEnergy());
		targetUser.setTargetCarbohidrate(target.getCarbohidrate());
		targetUser.setTargetProtein(target.getProtein());
		targetUser.setTargetFat(target.getFat());

		userProfileDao.save(targetUser);
		
		return new ResponseEntity<>(targetUser, HttpStatus.OK);
	}
	
	@PostMapping("/profile/diet")
	@ApiOperation(value = "식단관리 설정")
	public Object registDiet(@Valid @RequestBody UserDiet diet) {
		//입력받은 몸무게와 타입을 갱신해준다.
		//처음에 들어오면 음식이름, 타입,
		System.out.println(diet.toString());
		Nutrient nutrient = nutrientDao.findOneByFood(diet.getFood()); //성분 가져온다.
		System.out.println(nutrient.toString());
		diet.setCarbo(nutrient.getCarbohidrate()*diet.getDish());
		diet.setFat(nutrient.getFat()*diet.getDish());
		diet.setProtein(nutrient.getProtein()*diet.getDish());
		diet.setEnergy(nutrient.getEnergy()*diet.getDish());
		
		
		Mission mission = missionDao.findMissionByProfileUidAndCreateDate(diet.getUserId(), diet.getCreateDate());
		System.out.println(diet.getCreateDate());
		System.out.println(mission);
		if(mission == null) {
			UserProfile user = userProfileDao.getUserProfileByUid(diet.getUserId());
			
			mission = new Mission();
			mission.setCreateDate(diet.getCreateDate());
			mission.setProfileUid(diet.getUserId());
			mission.setProgress(true);
			mission.setResult(false);
			mission.setTargetCarbohidrate(user.getTargetCarbohidrate());
			mission.setTargetEnergy(user.getTargetEnergy());
			mission.setTargetFat(user.getTargetFat());
			mission.setTargetProtein(user.getTargetProtein());
			missionDao.save(mission);
		}

		diet.setMissionId(mission.getMid());
		userDietDao.save(diet);
		return new ResponseEntity<>(diet, HttpStatus.OK);
	}
	
	@GetMapping("/profile/diet")
	@ApiOperation(value = "음식검색을 위한 리스트 ")
	public Object getDietList() {
		List<Nutrient> nutrientList = nutrientDao.findAll();
		return new ResponseEntity<>(nutrientList, HttpStatus.OK);
	}
	
	@GetMapping("/profile/tag")
	@ApiOperation(value = "회원 취향태그 삭제")
	public Object deleteTag(@RequestParam("uid") String uid, @RequestParam("tagName") String tagName) {
		UserProfile profile = userProfileDao.getUserProfileByUid(uid);
		String getTag = profile.getTagName();
		System.out.println(tagName);
		getTag = getTag.replaceAll(tagName + ", ", "");
		System.out.println(getTag);
		profile.setTagName(getTag);
		
		userProfileDao.save(profile);
		return new ResponseEntity<>(profile, HttpStatus.OK);
	}
	
	@PostMapping("/profile/tag")
	@ApiOperation(value = "회원 취향태그 추가")
	public Object getProfile(@RequestParam("uid") String uid, @RequestParam("tagName") String tagName) {
		UserProfile profile = userProfileDao.getUserProfileByUid(uid);
		
		String getTag = profile.getTagName();
		if(getTag == null) getTag = "";
		profile.setTagName(getTag + tagName + ", ");
		
		userProfileDao.save(profile);
		return new ResponseEntity<>(profile, HttpStatus.OK);
	}
	
	
	@GetMapping("/profile")
	@ApiOperation(value = "회원 프로필 불러오기 ")
	public Object getProfile(@RequestParam("uid") String uid) {
		UserProfile targetUser = userProfileDao.getUserProfileByUid(uid);
		//입력받은 몸무게와 타입을 갱신해준다.
		return new ResponseEntity<>(targetUser, HttpStatus.OK);
	}
}
