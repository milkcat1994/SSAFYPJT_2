package com.hotsix.mimi.dao.request;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

import com.hotsix.mimi.dto.request.Store;
import com.hotsix.mimi.dto.request.StoreReview;


public interface StoreDao extends JpaRepository<Store, Integer> {
   // @Query(value = "select * from FOODMATE.STORE LIMIT 5;", nativeQuery = true)
   // List <Store> findfive();
    @Query(value = "select s.ID,s.NAME,s.AREA,s.TEL,s.ADDRESS,s.LATITUDE,s.LONGITUDE,s.CATEGORY,s.MENU from FOODMATE.STORE as s, (select * from FOODMATE.STORE_REVIEW where ID IN (select r.id from FOODMATE.STORE as s, FOODMATE.STORE_REVIEW as r where (s.CATEGORY = :param || s.MENU like %:param)  && r.STORE = s.ID   && r.SCORE >= 4 group by s.id ) and SCORE >= 4 group by STORE ) as r  where r.STORE = s.ID;", nativeQuery = true)
    List<Store> findUserRecommendStore(@Param("param") String param);

    @Query(value = "select s.ID,s.NAME,s.AREA,s.TEL,s.ADDRESS,s.LATITUDE,s.LONGITUDE,s.CATEGORY,s.MENU from FOODMATE.STORE as s, FOODMATE.STORE_REVIEW as r where (s.CATEGORY = :param || s.MENU like %:param)  && r.STORE = s.ID   && r.SCORE >= 4 group by s.id;", nativeQuery = true)
    List<Store> findHighScore(@Param("param") String param);
    
    @Query(value = "SELECT * FROM STORE WHERE MENU LIKE %?1% AND MENU LIKE %?2%", nativeQuery = true)
    List<Store> findByMenuLikeAndMenuLike(String food1, String food2);

    @Query(value = "SELECT CATEGORY FROM STORE group by CATEGORY;", nativeQuery = true)
    List<String> findCategory();

    @Query(value = "select s.ID,s.NAME,s.AREA,s.TEL,s.ADDRESS,s.LATITUDE,s.LONGITUDE,s.CATEGORY,s.MENU from STORE as s,(SELECT STORE,CONTENT from STORE_REVIEW where SCORE >=4 && CONTENT like %:param%) as r where s.ID=r.STORE;", nativeQuery = true)
    //@Query(value = "SELECT STORE from STORE_REVIEW where SCORE >=4 && CONTENT like '%매운%';", nativeQuery = true)
    //@Query(value = "SELECT STORE from STORE_REVIEW where SCORE >=4 && CONTENT like %:param%", nativeQuery = true)
    List<Store> findfilterHighScore(@Param("param") String param);
    
}
/*abstract
select s.ID,s.NAME,s.AREA,s.TEL,s.ADDRESS,s.LATITUDE,s.LONGITUDE,s.CATEGORY,s.MENU from FOODMATE.STORE as s,
	(select * from FOODMATE.STORE_REVIEW where ID IN (select r.id from FOODMATE.STORE as s, FOODMATE.STORE_REVIEW as r where (s.CATEGORY = :param || s.MENU like %:param)  && r.STORE = s.ID   && r.SCORE >= 4 group by s.id ) and SCORE >= 4 group by STORE ) as r -- store 갯수 group 화 
where r.STORE = s.ID;
*/
