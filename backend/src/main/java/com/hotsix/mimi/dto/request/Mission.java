// 하단 DB 설정 부분은 Sub PJT II에서 데이터베이스를 구성한 이후에 주석을 해제하여 사용.

package com.hotsix.mimi.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.Formula;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name="`MISSION`")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@ToString
public class Mission{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="MID")
    private String mid;
    
    @Column(name="CREATE_DATE")
    private Date createDate;
    @Column(name="PROGRESS_TYPE")
    private boolean progress;
    @Column(name="RESULT")
    private boolean result;
//    private String missionType; //+-기능이 따로 필요없을거같아서 String타입
    
    @ColumnDefault(value = "0")
    @Column(name = "TARGET_ENERGY")
    private double targetEnergy;

    @ColumnDefault(value = "0")
    @Column(name = "TARGET_CARBOHIDRATE")
    private double targetCarbohidrate;

    @ColumnDefault(value = "0")
    @Column(name = "TARGET_PROTEIN")
    private double targetProtein;

    @ColumnDefault(value = "0")
    @Column(name = "TARGET_FAT")
    private double targetFat;
    
    
    @Column(name="PROFILE_UID")
    private String profileUid; // 언더바 있는 컬럼
    
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "MISSION_ID")
    private List<UserDiet> members = new ArrayList<>();
    
//    @Formula("(select D.* from USER_DIET D where D.USER_ID = profileUid AND D.CREATE_DATE = createDate)")
//    private List<UserDiet> dietList;
}
