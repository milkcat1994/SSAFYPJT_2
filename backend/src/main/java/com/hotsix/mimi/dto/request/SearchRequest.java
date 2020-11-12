package com.hotsix.mimi.dto.request;

import java.util.List;

import lombok.Data;

@Data
public class SearchRequest {
	private List<String> compList;
	
	private List<String> diesaseList;
}
