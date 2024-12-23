package com.daeyeodwaeyo.back.springboot.service;

import com.daeyeodwaeyo.back.springboot.domain.Product;
import com.daeyeodwaeyo.back.springboot.domain.ProductImage;
import com.daeyeodwaeyo.back.springboot.domain.ProductVideo;
import com.daeyeodwaeyo.back.springboot.repository.ProductImageRepository;
import com.daeyeodwaeyo.back.springboot.repository.ProductVideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// 이미지, 동영상 등의 콘텐츠의 비즈니스 로직을 처리하는 클래스
// 회원가입 또는 상품 등록을 할 때 작성 중에는 임시 폴더에 저장하고 최종적으로 마무리 되었을 땐 최종 폴더로 이동
@Service
public class ContentService {

  @Autowired
  private ProductImageRepository productImageRepository;

  @Autowired
  private ProductVideoRepository productVideoRepository;

  // 프로필 이미지 경로
  private final String PROFILE_IMAGE_PATH = "/opt/homebrew/var/www/resources/images/profileImage/";

  // 상품 이미지 경로
  private final String PRODUCT_IMAGE_PATH = "/opt/homebrew/var/www/resources/images/productImage/";

  // 상품 동영상 경로
  private final String PRODUCT_VIDEO_PATH = "/opt/homebrew/var/www/resources/videos/productVideo/";

  private String imagePath(String category, String name) {
    String url = PRODUCT_IMAGE_PATH;
    if (category.equals("캠핑")) {
      url += "camping/";
      if (name.equals("블루투스 스피커")) {
        return url + "bluetoothSpeaker";
      }
      else if (name.equals("의자")) {
        return url + "chair";
      }
      else if (name.equals("화로")) {
        return url + "grill";
      }
      else if (name.equals("랜턴")) {
        return url + "lantern";
      }
      else if (name.equals("테이블")) {
        return url + "table";
      }
      else if (name.equals("아이스박스")) {
        return url + "iceBox";
      }
      else if (name.equals("텐트")) {
        return url + "tent";
      }
      else {
        return PRODUCT_IMAGE_PATH;
      }
    }
    else {
      return PRODUCT_IMAGE_PATH;
    }
  }

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

  // 프로필 사진을 삭제하는 메서드
  public boolean deleteProfileImage(String profileImageName) throws IOException {
    // 프로필 이미지 경로에서 삭제할 파일을 지정
    File fileToDelete = new File(PROFILE_IMAGE_PATH, profileImageName);

    // 파일이 존재하는지 확인
    if (fileToDelete.exists()) {
      // 파일이 존재하면 삭제
      boolean deleted = fileToDelete.delete();
      System.out.println("파일이 삭제되었습니다.");
      // 삭제 여부 반환 (true: 성공, false: 실패)
      return deleted;
    } else {
      // 파일이 존재하지 않으면 false 반환
      System.out.println("파일이 존재하지 않습니다.");
      return false;
    }
  }

  // 물건 등록할 때 입력한 이미지를 저장하는 메서드
  public List<String> saveProductImage(List<MultipartFile> images, Product product) {

    List<String> imageNames = new ArrayList<>();

    // 상품 이미지 저장
    for (MultipartFile image : images) {
      String imageId = UUID.randomUUID().toString();
      String imageName = imageId + "_" + image.getOriginalFilename();
      File imageFile = new File(PRODUCT_IMAGE_PATH, imageName);
      try {
        image.transferTo(imageFile);
        System.out.println("save image name: " + imageName);
        ProductImage productImage = new ProductImage();
        productImage.setId(imageId);
        productImage.setImageUrl(imageName);
        productImage.setProduct(product);
        productImageRepository.save(productImage);
        imageNames.add(imageName);
        System.out.println("이미지 저장 완료");
      } catch (IOException e) {
        System.err.println("Failed to store image: " + imageName);
        return null;
      }
    }
    return imageNames;
  }

  // 상품 사진을 삭제하는 메서드
  public boolean deleteProductImage(List<String> imageNames) {
    for (String imageName : imageNames) {
      // 프로필 이미지 경로에서 삭제할 파일을 지정
      File fileToDelete = new File(PRODUCT_IMAGE_PATH, imageName);

      // 파일이 존재하는지 확인
      if (fileToDelete.exists()) {
        // 파일이 존재하면 삭제
        boolean deleted = fileToDelete.delete();
        if (deleted) {
          System.out.println("파일이 삭제되었습니다.");
        } else {
          System.out.println("파일이 삭제되지 않았습니다.");
          return deleted;
        }
      } else {
        // 파일이 존재하지 않으면 false 반환
        System.out.println("파일이 존재하지 않습니다.");
        return false;
      }
    }
    return true;
  }

  // 물건 등록할 때 입력한 비디오를 저장하는 메서드
  public String saveProductVideo(MultipartFile video, Product product) {

    String videoName = "";

    if (video != null) {
      String videoId = UUID.randomUUID().toString();
      videoName = videoId + "_" + video.getOriginalFilename();
      File videoFile = new File(PRODUCT_VIDEO_PATH, videoName);
      try {
        video.transferTo(videoFile);
        System.out.println("save video name: " + videoName);
        ProductVideo productVideo = new ProductVideo();
        productVideo.setId(videoId);
        productVideo.setVideoUrl(videoName);
        productVideo.setProduct(product);
        productVideoRepository.save(productVideo);
        System.out.println("비디오 저장 완료");
      } catch (IOException e) {
        System.err.println("Failed to store video: " + videoName);
        return null; // 비디오 저장 실패 시 null 반환
      }
    }
    return videoName;
  }

  // 상품 동영상을 삭제하는 메서드
  public boolean deleteProductVideo(String videoName) {
    // 프로필 이미지 경로에서 삭제할 파일을 지정
    File fileToDelete = new File(PRODUCT_VIDEO_PATH, videoName);

    // 파일이 존재하는지 확인
    if (fileToDelete.exists()) {
      // 파일이 존재하면 삭제
      boolean deleted = fileToDelete.delete();
      System.out.println("파일이 삭제되었습니다.");
      // 삭제 여부 반환 (true: 성공, false: 실패)
      return deleted;
    } else {
      // 파일이 존재하지 않으면 false 반환
      System.out.println("파일이 존재하지 않습니다.");
      return false;
    }
  }
}
