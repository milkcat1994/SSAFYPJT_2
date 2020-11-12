package com.hotsix.mimi.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonInclude;

@Entity
@Table(name="`COMPATIBILITY`")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Compatibility {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
    @Column(name = "FOOD_A")
    private String foodA;
    @Column(name = "FOOD_B")
    private String foodB;
    
    
    @Column(name = "DESCRIPTION")
    private String description;
    @Column(name = "SEARCH_CNT")
    private int searchCnt;
    
    @Formula("(select count(*) from REVIEW R where R.COMPATIBILITY_ID = id AND R.COMPATIBILITY_TYPE = 0)")
    private String reviewCnt;
    @Formula("(select avg(R.STAR) from REVIEW R where R.COMPATIBILITY_ID = id AND R.COMPATIBILITY_TYPE = 0)")
    private String avgStar;
    
}