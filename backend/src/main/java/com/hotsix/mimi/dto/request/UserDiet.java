package com.hotsix.mimi.dto.request;

import java.time.LocalDateTime;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="`USER_DAYDIET`")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDiet {
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	 private String id;
	 
	 @Column(name = "DIET_TYPE")
	 private int dietType;
	 
	 @Column(name = "FOOD")
	 private String food;
	 
	 @Column(name = "DISH")
	 private int dish;
	 
	 @Column(name = "CREATE_DATE")
	 private Date createDate;
	 
	 @Column(name = "USER_ID")
	 private String userId;
	 
	 @Column(name = "MISSION_ID")
	 private String missionId;
	 
	 @Column(name = "CARBOHYDRATE")
	 private double carbo;
	 
	 @Column(name = "PROTEIN")
	 private double protein;
	 
	 @Column(name = "FAT")
	 private double fat;
	 
	 @Column(name = "ENERGY")
	 private double energy;
	 
}
