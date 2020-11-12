package com.hotsix.mimi.dao.request;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hotsix.mimi.dto.request.Compatibility;
import com.hotsix.mimi.dto.request.Disease;

public interface DiseaseDao  extends JpaRepository<Disease, String>{
	@Query(value = "SELECT NAME FROM DISEASE;", nativeQuery = true)
	List<String> selectAll();
}
