package com.hotsix.mimi.dto.request;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="`INCOMPATIBILITY`")
@Data
@NoArgsConstructor
@AllArgsConstructor
//@IdClass(InCompatibility.class)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InCompatibility  implements Serializable {
	
	private static final long serialVersionUID = 1L;
	@Id
	private int id;
	
    @Column(name = "FOOD_A")
    private String foodA;
    
    @Column(name = "FOOD_B")
    private String foodB;
    
    
    @Column(name = "DESCRIPTION")
    private String description;
    @Column(name = "SEARCH_CNT")
    private int searchCnt;
    
    @Formula("(select count(*) from REVIEW R where R.COMPATIBILITY_ID = id AND R.COMPATIBILITY_TYPE = 1)")
    private String reviewCnt;
    @Formula("(select avg(R.STAR) from REVIEW R where R.COMPATIBILITY_ID = id AND R.COMPATIBILITY_TYPE = 1)")
    private String avgStar;
    
}
