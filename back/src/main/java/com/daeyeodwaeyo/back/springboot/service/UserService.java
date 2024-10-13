package com.daeyeodwaeyo.back.springboot.service;

import com.daeyeodwaeyo.back.springboot.config.JwtUtil;
import com.daeyeodwaeyo.back.springboot.domain.User;
import com.daeyeodwaeyo.back.springboot.dto.UserInfoDTO;
import com.daeyeodwaeyo.back.springboot.dto.UserLoginDTO;
import com.daeyeodwaeyo.back.springboot.dto.UserRegisterDTO;
import com.daeyeodwaeyo.back.springboot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

// UserService는 회원가입, 로그인 등의 비즈니스 로직을 처리하는 클래스
// DTO를 엔티티로 변환하고 리포지토리와 상호작용한다.
@Service
@Transactional
public class UserService {

  @Autowired
  private UserRepository userRepository; // 리포지토리와 상호작용

  @Autowired
  private ContentService contentService;

  @Autowired
  private PasswordEncoder passwordEncoder; // 비밀번호 암호화

  @Autowired
  private JwtUtil jwtUtil;

//
//  private static final String TEMP_IMAGE_PATH = "/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/resources/images/tempImage"; // 임시 이미지 경로
//  private static final String PROFILE_IMAGE_PATH = "/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/resources/images/profileImage"; // 최종 이미지 경로
//
//
//  // 임시 이미지 저장
//  public String saveTempImage(MultipartFile file) throws IOException {
//    // 파일을 임시 경로에 저장하고 URL 반환
//    String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//    File tempFile = new File(TEMP_IMAGE_PATH, fileName);
//    file.transferTo(tempFile);
//    return PROFILE_IMAGE_PATH + fileName;
//  }
//
//  // 임시 이미지 폴더에서 프로필 사진 폴더로 이동
//  private void moveTempImageToProfile(String tempImageUrl) {
//    String fileName = tempImageUrl.substring(tempImageUrl.lastIndexOf("/") + 1);
//    File tempFile = new File(TEMP_IMAGE_PATH, fileName);
//    File profileFile = new File(PROFILE_IMAGE_PATH, fileName);
//    if (tempFile.exists()) {
//      tempFile.renameTo(profileFile); // 파일 이동
//    }
//  }
//
//  // 임시 이미지 폴더에 있는 사진 삭제
//  public void cleanUpTempImages() {
//    File tempDir = new File(TEMP_IMAGE_PATH);
//    File[] files = tempDir.listFiles();
//
//    if (files != null) {
//      for (File file : files) {
//        long diff = System.currentTimeMillis() - file.lastModified();
//        if (diff > TimeUnit.HOURS.toMillis(24)) { // 24시간이 지난 파일 삭제
//          file.delete();
//        }
//      }
//    }
//  }
//

  //  회원가입 처리 메서드
  //  @param userRegisterDTO 클라이언트에서 전달된 회원가입 정보
  //  @return 회원가입 성공 메시지
  public String registerUser(UserRegisterDTO userRegisterDTO) throws Exception{
    // DTO를 엔티티로 변환
    User user = new User();
    user.setId(userRegisterDTO.getId());
    // 비밀번호 암호화
    user.setPassword(passwordEncoder.encode(userRegisterDTO.getPassword()));
    user.setName(userRegisterDTO.getName());
    user.setPhoneNumber(userRegisterDTO.getPhoneNumber());
    user.setAddress(userRegisterDTO.getAddress());
    user.setEmail(userRegisterDTO.getEmail());
    user.setNickName(userRegisterDTO.getNickName());

    // 프로필 이미지 처리 로직
    if (!userRegisterDTO.getProfileImage().isEmpty()) {
      // 프로필 이미지 저장
      String profileImageURL = contentService.saveProfileImage(userRegisterDTO.getProfileImage());
      user.setProfileImage(profileImageURL);
    }

//    확인용 코드
//    System.out.println(userRegisterDTO.getId());
//    System.out.println(userRegisterDTO.getPassword());
//    System.out.println(userRegisterDTO.getName());
//    System.out.println(userRegisterDTO.getPhoneNumber());
//    System.out.println(userRegisterDTO.getAddress());
//    System.out.println(userRegisterDTO.getEmail());
//    System.out.println(userRegisterDTO.getProfileImage());
//    System.out.println(userRegisterDTO.getNickName());

    // 사용자 정보 저장
    userRepository.save(user);
    return "회원가입이 완료되었습니다.";
  }

  // 아이디 중복확인 처리 메서드
  public boolean isIdDuplicate(String id) {
    return userRepository.existsById(id);
  }

  // 아이디 중복확인 처리 메서드
  public boolean isNickNameDuplicate(String nickName) {
    return userRepository.existsByNickName(nickName);
  }

  // 아이디 찾기 메서드
  public String findId(String name, String email) {
    Optional<User> userOptional = userRepository.findByNameAndEmail(name, email);
    if (userOptional.isPresent()) {
      return userOptional.get().getId(); // 사용자의 ID 반환
    } else {
      throw new RuntimeException("사용자를 찾을 수 없습니다.");
    }
  }

  // 비밀번호 찾기 메서드 / 임시 비밀번호 생성
  public String generateTempPassword(String name, String id, String email) {
    Optional<User> userOptional = userRepository.findByNameAndIdAndEmail(name, id, email);
    if (userOptional.isPresent()) {
      // 임시 비밀번호 생성
      String tempPassword = UUID.randomUUID().toString().substring(0, 8); // 8자리 임시 비밀번호
      String encodedPassword = passwordEncoder.encode(tempPassword);

      // 사용자 비밀번호 업데이트
      User user = userOptional.get();
      user.setPassword(encodedPassword);
      userRepository.save(user);

      // 임시 비밀번호 반환
      return tempPassword;
    } else {
      throw new RuntimeException("사용자를 찾을 수 없습니다.");
    }
  }

//  로그인 처리 메서드
//  @param userLoginDTO 클라이언트에서 전달된 로그인 정보
//  @return 로그인 성공 시 JWT 토큰 변환, 실패 시 예외 발생
  public User loginUser(UserLoginDTO userLoginDTO) throws Exception {
//    // 아이디로 사용자 조회
//    User user = userRepository.findById(userLoginDTO.getId())
//            .orElseThrow(() -> new IllegalArgumentException("아이디를 찾을 수 없습니다."));
//
//    // 비밀번호가 일치하는지 확인
//    if (passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword())) {
//      // 비밀번호가 일치하면 JWT 토큰 생성
//      return jwtUtil.generateToken(user.getId());
//    } else {
//      // 비밀번호가 일치하지 않으면 예외 발생
//      throw new IllegalArgumentException("잘못된 비밀번호입니다.");
//    }
    User user = userRepository.findById(userLoginDTO.getId()).orElseThrow(() -> new UsernameNotFoundException("아이디가 존재하지 않습니다."));
    System.out.println("userLoginDTO" + userLoginDTO.getPassword());
    System.out.println("user" + user.getPassword());
    boolean matches = passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword());
    System.out.println(matches);
    if(passwordEncoder.matches(userLoginDTO.getPassword(), user.getPassword())) {
      System.out.println("로그인 성공");
      return user; // 인증 성공
    } else {

      throw new Exception("아이디 또는 비밀번호가 일치하지 않습니다.");
    }
  }

  public Boolean checkPassword(UserInfoDTO userInfoDTO, String inputPassword) throws Exception {
    String userPassword = userInfoDTO.getPassword();

    boolean matches = passwordEncoder.matches(inputPassword, userPassword);

    // 테스트 출력
    System.out.println("inputPassword: " + inputPassword);
    System.out.println("matches: " + matches);

    if(passwordEncoder.matches(inputPassword, userPassword)) {
      // 테스트 출력
      System.out.println("비밀번호 일치");

      return matches;
    } else {
      // 테스트 출력
      System.out.println("비밀번호 불일치");

      return matches;
    }
  }

  public String changePassword(UserInfoDTO userInfoDTO) throws Exception {

    String userId = userInfoDTO.getId();
    String changePassword = userInfoDTO.getPassword();
    User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("아이디가 존재하지 않습니다."));
    String userPassword = user.getPassword();

    Boolean matches = passwordEncoder.matches(changePassword, userPassword);

    // 테스트 출력
    System.out.println("matches: " + matches);
    System.out.println("changePassword: " + changePassword);

    if (passwordEncoder.matches(changePassword, userPassword)) {
      System.out.println("이전과 동일한 비밀번호입니다.");
      return "Not change";
    } else {
      String encodedPassword = passwordEncoder.encode(changePassword);
      // 사용자 비밀번호 업데이트
      user.setPassword(encodedPassword);
      userRepository.save(user);

      System.out.println("비밀번호가 변경되었습니다.");
      return "success";
    }
  }
}
