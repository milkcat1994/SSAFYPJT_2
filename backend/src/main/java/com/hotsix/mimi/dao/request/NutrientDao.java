package com.hotsix.mimi.dao.request;

import java.util.List;

import com.hotsix.mimi.dto.request.Nutrient;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NutrientDao extends JpaRepository<Nutrient, String> {
	// 음식을의 영양성분 전체 검색
	List<Nutrient> findAll();
	
	Nutrient findOneByFood(String food);
}