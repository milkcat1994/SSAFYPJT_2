package com.hotsix.mimi.dao.request;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import com.hotsix.mimi.dto.request.Mission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MissionDao extends JpaRepository<Mission, String> {

	Mission findMissionByProfileUidAndCreateDate(String profile_uid, Date date);
	
	
	List<Mission> findMissionByProfileUid(String profile_uid);
	
	Mission getMissionByMid(String mid);
	
}
