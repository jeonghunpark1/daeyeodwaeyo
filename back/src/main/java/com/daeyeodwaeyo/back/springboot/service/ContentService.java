package com.daeyeodwaeyo.back.springboot.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

// 이미지, 동영상 등의 콘텐츠의 비즈니스 로직을 처리하는 클래스
// 회원가입 또는 상품 등록을 할 때 작성 중에는 임시 폴더에 저장하고 최종적으로 마무리 되었을 땐 최종 폴더로 이동
@Service
public class ContentService {

  private final String TEMP_IMAGE_PATH = "/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/resources/images/tempImage/"; // 임시 이미지 경로
  private final String PROFILE_IMAGE_PATH = "/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/resources/images/profileImage/"; // 최종 이미지 경로
  private final String TEMP_VIDEO_PATH = "/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/resources/videos/tempVideo/"; // 임시 동영상 경로
  private final String PRODUCT_VIDEO_PATH = "/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/resources/videos/productVideo/"; // 최종 물건 동영상 경로

  public String saveProfileImage(MultipartFile file) throws IOException {
    String OriginalFileName = "";
    if (!file.isEmpty()) {
      String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
      File finalFile = new File(PROFILE_IMAGE_PATH, fileName);

      // 파일을 프로필 폴더에 저장
      file.transferTo(finalFile);

      // 파일 이름 추출
      OriginalFileName = fileName;
    }
    return OriginalFileName;
  }

  // 임시 파일 저장
//  public String saveTempFile(MultipartFile file) throws IOException {
//    // MIME 타입을 확인하여 이미지 또는 동영상인지 구분
//    String contentType = file.getContentType();
//
//    // 이미지 처리
//    if (contentType != null && contentType.startsWith("image/")) {
//      String contentName = UUID.randomUUID() + "_image_" + file.getOriginalFilename();
//      File tempImageFile = new File(TEMP_IMAGE_PATH, contentName);
//      file.transferTo(tempImageFile);
//      return PROFILE_IMAGE_PATH + contentName; // 이미지 저장 후 URL 반환
//    }
//    // 동영상 처리
//    else if (contentType != null && contentType.startsWith("video/")) {
//      String contentName = UUID.randomUUID() + "_video_" + file.getOriginalFilename();
//      File tempVideoFile = new File(TEMP_VIDEO_PATH, contentName);
//      file.transferTo(tempVideoFile);
//      return PRODUCT_VIDEO_PATH + contentName;
//    } else {
//      throw new IllegalArgumentException("지원하지 않는 파일 형식입니다.");
//    }
//  }
//
//  // 임시 파일 폴더에서 최종 파일 폴더로 이동
//  public void moveTempFileToFinal(String tempFileUrl, String category) {
//    String fileName = tempFileUrl.substring(tempFileUrl.lastIndexOf("/") + 1);
//    File tempFile = null;
//    File finalFile = null;
//
//    // 이미지 파일 처리
//    if (tempFileUrl.contains("image")) {
//      // 프로필 사진 파일 처리
//      if (category.equals("profileImage")) {
//        tempFile = new File(TEMP_IMAGE_PATH, fileName);
//        finalFile = new File(PROFILE_IMAGE_PATH, fileName);
//      }
//      // 동영상 파일 처리
//      else if (tempFileUrl.contains("video")) {
//        tempFile = new File(TEMP_VIDEO_PATH, fileName);
//        // 물건 홍보 영상 파일 처리
//        if (category.equals("productVideo")) {
//          finalFile = new File(PRODUCT_VIDEO_PATH, fileName);
//        }
//      }
//    }
//    // 파일이 존재할 경우 이동
//    if (tempFile != null && tempFile.exists()) {
//      tempFile.renameTo(finalFile); // 파일 이동
//    }
//  }
//
//  // 임시 파일 폴더에서 24시간이 지난 파일 삭제
//  public void cleanUpTempFiles() {
//    // 이미지 파일 폴더
//    File tempImageDir = new File(TEMP_IMAGE_PATH);
//    File[] imageFiles = tempImageDir.listFiles();
//
//    // 동영상 파일 폴더
//    File tempVideoDir = new File(TEMP_VIDEO_PATH);
//    File[] videoFiles = tempVideoDir.listFiles();
//
//    // 이미지 파일 삭제
//    if (imageFiles != null) {
//      for (File file : imageFiles) {
//        long diff = System.currentTimeMillis() - file.lastModified();
//        // 24시간이 지난 파일 삭제
//        if (diff > TimeUnit.HOURS.toMillis(24)) {
//          file.delete();
//        }
//      }
//    }
//    // 동영상 파일 삭제
//    else if (videoFiles != null) {
//      for (File file : videoFiles) {
//        long diff = System.currentTimeMillis() - file.lastModified();
//        // 24시간이 지난 파일 삭제
//        if (diff > TimeUnit.HOURS.toMillis(24)) {
//          file.delete();
//        }
//      }
//
//    }
//  }
}
