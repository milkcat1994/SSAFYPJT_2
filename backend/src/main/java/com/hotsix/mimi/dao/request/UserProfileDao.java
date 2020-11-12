
package com.hotsix.mimi.dao.request;


import org.springframework.data.jpa.repository.JpaRepository;

import com.hotsix.mimi.dto.request.UserProfile;

public interface UserProfileDao extends JpaRepository<UserProfile, String> {
	UserProfile getUserProfileByUid(String uid);

	UserProfile getUserProfileByNickname(String nickname);
	
	

}
