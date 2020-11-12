package com.hotsix.mimi.dao.request;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hotsix.mimi.dto.request.Compatibility;

public interface CompatibilityDao extends JpaRepository<Compatibility, String> {
	List<Compatibility> findTop3ByOrderBySearchCntDesc();
	
	List<Compatibility> findAllByFoodAOrFoodB(String foodA, String foodB);
	
	@Query(value = "SELECT FOOD_A FROM COMPATIBILITY UNION SELECT FOOD_B FROM COMPATIBILITY order by FOOD_A;", nativeQuery = true)
	List<String> selectAll();
	
	Compatibility findOneById(int id);
	
	List<Compatibility> findByDescriptionContaining(String disease);
}