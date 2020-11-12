package com.hotsix.mimi.dao.request;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hotsix.mimi.dto.request.Review;


public interface ReviewDao extends JpaRepository<Review, String>{
	List<Review> findAll();
	
	Review findByCompatibilityIdAndUserId(int id, String uid);
}
