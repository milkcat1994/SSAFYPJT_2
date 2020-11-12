// 하단 DB 설정 부분은 Sub PJT II에서 데이터베이스를 구성한 이후에 주석을 해제하여 사용.

package com.hotsix.mimi.dto.request;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonInclude;

import org.hibernate.annotations.ColumnDefault;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name="`USER_PROFILE`")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserProfile {
    @Id
    @Column(name = "UID")
    private String uid;
    @Column(name = "NICKNAME")
    private String nickname;
    @Column(name = "TARGET_WEIGHT")
    private int targetWeight;
    @Column(name = "TARGET_TYPE")
    private String targetType;
    @Column(name = "HEIGHT")
    private int height;
    @Column(name = "GENDER_TYPE")
    private int genderType;
    
    @Column(name = "IMGURL")
    private String imgurl;
    
    @Column(name = "ACCOUNT_TYPE")
    private int accountType;
    

    // 권장 영양 섭취량을 위한 칼럼들
    @Column(name = "AGE")
    private int age;

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
    
    @Column(name = "TAG_NAME")
    private String tagName;
    //해당 회원에 대한 프로필상의 식단을 가져온다.
    @OneToMany(fetch = FetchType.EAGER)
    @JoinColumn(name = "USER_ID")
    private List<UserDiet> members = new ArrayList<>();
}
