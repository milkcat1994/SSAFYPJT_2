package com.hotsix.mimi.dto.request;

import java.util.List;

import org.hibernate.annotations.Formula;

import lombok.Data;

@Data
public class DiseaseRequest {

	 private List<InCompatibility> incompDisease;
	 
	 private List<Compatibility> compDisease; 
}
