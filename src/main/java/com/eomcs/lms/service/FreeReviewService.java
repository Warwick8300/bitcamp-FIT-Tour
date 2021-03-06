package com.eomcs.lms.service;

import java.util.HashMap;
import java.util.List;
import com.eomcs.lms.domain.City;
import com.eomcs.lms.domain.FreeReview;

public interface FreeReviewService {
	

	int add(FreeReview freeReview);

  List<FreeReview> list(int pageNo, int pageSize, String search);


  int delete(int no);

  FreeReview get(int no);

  int update(FreeReview freeReview);

  FreeReview getMemberId(int no);

  int addFreeReviewCity(HashMap<String, Object> paramMap);

  List<City> getCityName(int no);

  int deleteFreeReviewCity(int no);
  
  List<FreeReview> findByTourNo(int no);

  int size(int searchCagetory, String search);

  int citySize(List<String> citys);

  List<FreeReview> cityList(int pageNo, int pageSize, List<String> citys);

  int reservationNull(int no);

	
}
