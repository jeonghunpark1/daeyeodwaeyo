package com.daeyeodwaeyo.back.springboot.controller;

import com.daeyeodwaeyo.back.springboot.dto.UserLoginDTO;
import com.daeyeodwaeyo.back.springboot.dto.UserRegisterDTO;
import com.daeyeodwaeyo.back.springboot.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

//UserController는 회원가입 및 로그인 요청은 처리하는 컨트롤러이다.
//클라이언트로부터 요청을 받아 서비스를 호출한다.
@RestController
@RequestMapping("/api/users")
public class UserController {

  private final UserService userService;

  @Autowired
  public UserController(UserService userService) {
    this.userService = userService;
  }

  // 이미지 임시 업로드
  @PostMapping("/tempProfileImage")
  public ResponseEntity<String> uploadTempProfileImage(@RequestParam("file")MultipartFile file) throws IOException {
    String imageUrl = userService.saveTempImage(file); // 임시 이미지 저장 서비스 호출

//    확인용 코드
//    System.out.println(imageUrl);

    return ResponseEntity.ok(imageUrl);
  }

//  회원가입 엔드포인트
//  @param userRegisterDTO 클라이언트가 전달한 회원가입 정보
//  @return 성공 메시지 또는 에러 메시지
  @PostMapping("/signup")
  public ResponseEntity<String> registerUser(@Valid @RequestBody UserRegisterDTO userRegisterDTO) {
    String message = userService.registerUser(userRegisterDTO);
    return ResponseEntity.ok(message); // 회원가입 성공 시 성공 메시지 반환
  }

//  로그인 엔드포인트
//  @param userLoginDTO 클라이언트가 전달한 로그인 정보 (아이디와 비밀번호)
//  @return JWT 토큰 또는 에러 메시지
  @PostMapping("/login")
  public ResponseEntity<String> loginUser(@Valid @RequestBody UserLoginDTO userLoginDTO) {
    String token = userService.loginUser(userLoginDTO);
    return ResponseEntity.ok(token); // 로그인 성공 시 JWT 토큰 반환
  }

//  인증된 사용자만 접근 가능한 엔드포인트 (선택사항)
//  @return 인증된 사용자에게만 반환하는 메시지
  @GetMapping("/secure")
  public ResponseEntity<String> secureEndpoint() {
    return ResponseEntity.ok("인증된 사용자만 접근 가능합니다.");
  }
}
