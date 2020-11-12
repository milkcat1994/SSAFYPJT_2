package com.hotsix.mimi.dao.request;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hotsix.mimi.dto.request.UserDiet;

public interface UserDietDao extends JpaRepository<UserDiet, String> {
	@Query(value = "SELECT U.ID, U.DIET_TYPE, U.FOOD, U.CREATE_DATE, U.USER_ID, U.DISH, N.CARBOHYDRATE, N.PROTEIN, N.FAT, N.ENERGY\r\n" + 
			"FROM USER_DAYDIET U, NUTRIENT_NEW N\r\n" + 
			"WHERE N.FOOD = ?1;", nativeQuery = true)
	UserDiet selectDiet(String food);
	

}
