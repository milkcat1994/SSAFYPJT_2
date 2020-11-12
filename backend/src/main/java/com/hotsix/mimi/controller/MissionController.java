package com.hotsix.mimi.controller;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.servlet.http.HttpSession;

import com.hotsix.mimi.dao.request.MissionDao;
import com.hotsix.mimi.dto.BasicResponse;
import com.hotsix.mimi.dto.MissionDetail;
import com.hotsix.mimi.dto.request.Mission;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
// import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;

@ApiResponses(value = {
    @ApiResponse(
        code = 401,
        message = "Unauthorized",
        response = BasicResponse.class
    ),
    @ApiResponse(code = 403, message = "Forbidden", response = BasicResponse.class),
    @ApiResponse(code = 404, message = "Not Found", response = BasicResponse.class),
    @ApiResponse(code = 500, message = "Failure", response = BasicResponse.class)
})

// @CrossOrigin(origins = { "http://localhost:3000" })
@RestController
public class MissionController {
    @Autowired MissionDao missionDao;

    @GetMapping("/mission")
    @ApiOperation(value = "목표 조회")
    public Object getMissionList(
    		@RequestParam("uid") String uid
    )throws IOException {
    	List<Mission> missionList = missionDao.findMissionByProfileUid(uid);
       
    	return new ResponseEntity<>(missionList, HttpStatus.OK);
    }
    
    @PostMapping("/mission/detail")
    @ApiOperation(value = "목표 조회")
    public Object getMissionDetailList(
    		@RequestBody MissionDetail missionDetail
    )throws IOException {
        System.out.println(missionDetail.getDate());
    	Mission mission = missionDao.findMissionByProfileUidAndCreateDate(missionDetail.getUid(), missionDetail.getDate());
       
    	return new ResponseEntity<>(mission, HttpStatus.OK);
    }
}
