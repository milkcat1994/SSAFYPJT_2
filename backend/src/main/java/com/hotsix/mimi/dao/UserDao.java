
package com.hotsix.mimi.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hotsix.mimi.dto.user.User;

public interface UserDao extends JpaRepository<User, String> {
	User getUserByEmail(String email);

	User getUserByUid(String uid);

	User getUserByNickname(String nickname);
	
	User getUserByEmailAndPw(String email, String pw);

	Optional<User> findUserByEmailAndPw(String email, String pw);

	User findUserByEmail(String email);

	User getUserByEmailAndAccountType(String email, int accountType);

	User getUserByEmailAndNicknameAndUid(String email, String nickName, String uid);

}
