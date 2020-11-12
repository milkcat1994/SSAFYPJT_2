package com.hotsix.mimi.dao.request;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hotsix.mimi.dto.request.Compatibility;
import com.hotsix.mimi.dto.request.InCompatibility;

public interface InCompatibilityDao extends JpaRepository<InCompatibility, String> {
	List<InCompatibility> findAllByFoodAOrFoodB(String foodA, String foodB);
	
	
	InCompatibility findOneById(int id);
	
	List<InCompatibility> findByDescriptionContaining(String disease);
}