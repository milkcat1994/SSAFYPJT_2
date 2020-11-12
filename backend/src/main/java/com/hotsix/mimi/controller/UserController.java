package com.hotsix.mimi.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
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

import com.hotsix.mimi.dao.UserDao;
import com.hotsix.mimi.dao.request.UserProfileDao;
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
		@ApiResponse(code = 500, message = "Failure", response = BasicResponse.class) })
@EnableSwagger2
@CrossOrigin(origins = { "*" })
@RestController
public class UserController {

	@Autowired
	UserDao userDao;
	
	@Autowired
	UserProfileDao userProfileDao;
	
	@Autowired
	public JavaMailSender javaMailSender;

	@PostMapping("/user/login")
	@ApiOperation(value = "mimi 로그인")
	public Object login(@Valid @RequestBody User user) throws IOException {
		Optional<User> userOpt = userDao.findUserByEmailAndPw(user.getEmail(), user.getPw());
		System.out.println("아아");
		if (userOpt.isPresent()) {
			User loginUser = new User();
			loginUser = userOpt.get();
			
			//
//			File f = new File("http://j3a306.p.ssafy.io/lion.png");
			
//			feed.setImageUrl("data:image/png;base64, " + sbase64);
			//
			
//			if (userOpt.get().getImageUrl() != null) {
//				File f = new File(userOpt.get().getImageUrl());
//				String sbase64 = null;
//				if (f.isFile()) {
//					byte[] bt = new byte[(int) f.length()];
//					FileInputStream fis = new FileInputStream(f);
//					try {
//						fis.read(bt);
//						sbase64 = new String(Base64.encodeBase64(bt));
//						user.setImageUrl("data:image/png;base64, " + sbase64);
//					} finally {
//						fis.close();
//					}
//				}
//			}
			return new ResponseEntity<>(loginUser, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
	}

	@PostMapping("/user")
	@ApiOperation(value = "가입하기")
	public Object join(@Valid @RequestBody User user) throws IllegalStateException, IOException {
		final BasicResponse result = new BasicResponse();
		result.status = true;
		if (userDao.getUserByEmail(user.getEmail()) != null) { //이메일이 존재할 경우 실패
			result.data = "email_fail";
			return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
		} else if (userDao.getUserByNickname(user.getNickname()) != null) { //닉네임이 이미 존재할 경우 실패
			result.data = "nickname_fail";
			return new ResponseEntity<>(result, HttpStatus.NOT_FOUND);
		}
		System.out.println("하이하이");
		
		
		UUID uuid = UUID.randomUUID(); //랜덤한 id를 생성해준다.
		User joinUser = new User(); //회원가입시의 User table에 insert
		joinUser.setUid(uuid.toString());
		joinUser.setEmail(user.getEmail());
		joinUser.setPw(user.getPw());
		joinUser.setNickname(user.getNickname());
		joinUser.setAccountType(0); // mimi 사이트 회원의 경우 accountType 0 부여
		userDao.save(joinUser);

		UserProfile profileUser = new UserProfile();
		profileUser.setUid(uuid.toString());
		profileUser.setNickname(user.getNickname());
		profileUser.setImgurl(null); //초기 프로필 사진에 대해서는 null을 넣어준다.
		profileUser.setAccountType(0);
		userProfileDao.save(profileUser);
		//회원가입에 성공했을 경우 메세지
		result.data = "success";
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@PostMapping(value = "/email")
	@ApiOperation(value = "이메일인증")
	public ResponseEntity<BasicResponse> sendMail(@Valid @RequestBody Map<String, String> data) {
		SimpleMailMessage simpleMessage = new SimpleMailMessage();
		int random = new Random().nextInt(900000) + 100000;
		String authCode = String.valueOf(random);
		System.out.println(data.get("email"));
		simpleMessage.setTo(data.get("email"));
		simpleMessage.setSubject("이메일 인증 확인 메일");
		simpleMessage.setText(" 인증번호 : " + authCode);
		javaMailSender.send(simpleMessage);

		// 추가로 뷰에 autoCode저장 + 확인필요
		final BasicResponse result = new BasicResponse();
		result.status = true;
		result.data = "success";
		result.object = authCode;
		
		return new ResponseEntity<>(result, HttpStatus.OK);
	}

	@PostMapping("/user/Google")
	@ApiOperation(value = "구글 로그인, 이메일 DB에 있으면 로그인시켜주고 없으면 회원가입 후 로그인!")
	public Object gLogin(@Valid @RequestBody Map<String, String> data) {
		String email = data.get("gEmail");
		String nickname = data.get("gNickname");
		User user = new User();
		if (userDao.getUserByEmailAndAccountType(email, 1) == null) {
			UUID uuid = UUID.randomUUID(); //랜덤한 id를 생성해준다.
			user.setUid(uuid.toString());
			user.setAccountType(1); //Account Type : 1 은 Google계정
			user.setEmail(email);
			user.setNickname(nickname);
			user.setPw("");
			userDao.save(user);
			
			UserProfile profileUser = new UserProfile();
			profileUser.setUid(uuid.toString());
			profileUser.setNickname(nickname);
			profileUser.setImgurl(data.get("img")); //초기 프로필 사진에 대해서는 null을 넣어준다.
			profileUser.setAccountType(1);
			userProfileDao.save(profileUser);
		}else {
			user = userDao.getUserByEmailAndAccountType(email, 1); //존재하던 아이디라면 불러와준다.
		}
		

		return new ResponseEntity<>(user, HttpStatus.OK);
	}

	@PostMapping("/user/Kakao")
	@ApiOperation(value = "카카오 로그인, 이메일 DB에 있으면 로그인시켜주고 없으면 회원가입 후 로그인!")
	public Object kLogin(@Valid @RequestBody Map<String, String> data) {
		String email = data.get("email");
		String nickname = data.get("nickname");
		User user = new User();
		if (userDao.getUserByEmailAndAccountType(email, 2) == null) {
			UUID uuid = UUID.randomUUID(); //랜덤한 id를 생성해준다.
			user.setUid(uuid.toString());
			user.setAccountType(2); //Account Type : 2는 Kakao계정
			user.setEmail(email);
			user.setNickname(nickname);
			user.setPw("");
			userDao.save(user);
		}else {
			user = userDao.getUserByEmailAndAccountType(email, 2); //존재하던 아이디라면 불러와준다.
		}
		
		return new ResponseEntity<>(user, HttpStatus.OK);
	}

	@DeleteMapping("/user")
	@ApiOperation(value = "회원 탈퇴")
	public Object remove(@Valid @RequestBody User user) {
		User delUser = userDao.getUserByEmailAndPw(user.getEmail(), user.getPw());
		if (delUser != null) {
			UserProfile delUserProfile = userProfileDao.getUserProfileByUid(user.getUid());
			userProfileDao.delete(delUserProfile); //프로파일상의 계정 삭제
			userDao.delete(delUser); //계정 삭제
			return new ResponseEntity<>(delUser, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
		}
	}

}