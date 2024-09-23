package com.daeyeodwaeyo.back.springboot.controller;

import com.daeyeodwaeyo.back.springboot.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/email")
public class EmailController {

  @Autowired
  private EmailService emailService; // 이메일 전송 서비스 의존성 주입

  // 이메일로 인증 코드 전송하는 API
  @PostMapping("/sendCode")
  public ResponseEntity<String> sendVerificationCode(@RequestBody Map<String, String> request, HttpSession session) {
    String email = request.get("email");
    try {
      // 인증 코드 생성
      String verificationCode = emailService.generateVerificationCode();
      // 이메일 전송
      emailService.sendVerificationEmail(email, verificationCode);
      // 생성된 인증 코드를 세션에 저장
      session.setAttribute("verificationCode", verificationCode);

      // 세션에 저장된 인증번호 확인
      System.out.println("session/ verificationCode: " + session.getAttribute("verificationCode"));

      // 성공 메시지 응답
      return ResponseEntity.ok("이메일 전송에 성공했습니다.");
    } catch (MessagingException e) {
      // 이메일 전송 실패 시 오류 메시지 응답
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("이메일 전송에 실패했습니다.");
    }
  }

  // 사용자가 입력한 인증 코드를 검증하는 API
  @PostMapping("/checkCode")
  public ResponseEntity<String> verifyCode(@RequestBody Map<String, String> request, HttpSession session) {
    // 세션에 저장된 인증 코드를 가져옴
    String sessionCode = (String) session.getAttribute("verificationCode");
    String userCode = request.get("code");
    try {
      if (sessionCode != null && sessionCode.equals(userCode)) {
        session.removeAttribute("verificationCode");
        System.out.println("remove verificationCode");
        System.out.println("verificationCode after remove: " + session.getAttribute("verificationCode"));

        return ResponseEntity.ok("인증번호가 일치합니다.");
      } else {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("인증번호가 일치하지 않습니다.");
      }
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("인증번호 확인 요청을 실패했습니다.");
    }
  }
}
