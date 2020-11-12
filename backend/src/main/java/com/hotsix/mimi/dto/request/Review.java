package com.hotsix.mimi.dto.request;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="`REVIEW`")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Review {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
//	@ManyToOne
//	@JoinColumn(name ="COMPATIBILITY_ID")
//    private Compatibility compatibility;
	
    @Column(name = "STAR")
    private double star;
    
    @Column(name = "COMPATIBILITY_ID")
    private int compatibilityId;
    
    @Column(name = "USER_ID")
    private String userId;
    
    @Column(name = "COMPATIBILITY_TYPE")
    private int compatibilityType;
}
