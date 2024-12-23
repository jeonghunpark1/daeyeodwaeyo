package com.daeyeodwaeyo.back.springboot.service;

import jakarta.mail.*;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.core.parameters.P;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Properties;

@Service
public class EmailService {

  @Autowired
  private JavaMailSender javaMailSender; // Spring Boot의 JavaMailSener 주입

  @Autowired
  private SpringTemplateEngine templateEngine;

  // 인증 코드를 포함한 이메일을 전송하는 메서드
  public void sendVerificationEmail(String recipient, String code, String type) throws MessagingException {
//    MimeMessage message = mailSender.createMimeMessage();
//    MimeMessageHelper helper = new MimeMessageHelper(message, true);
//
//    helper.setTo(recipient); // 수신자 설정
//    helper.setSubject("Verification Code"); // 이메일 제목 설정
//    helper.setText("Your verification code is: " + code, true); // 이메일 내용 설정
//
//    mailSender.send(message); // 이메일 전송

//    SimpleMailMessage message = new SimpleMailMessage();
//    message.setFrom("dlrlghproject0429@gmail.com");
//    message.setTo(recipient);
//    message.setText("Your verification code is: " + code);
//    message.setSubject("회원가입 인증번호");
//
//    mailSender.send(message);

    MimeMessage mimeMessage = javaMailSender.createMimeMessage();

    MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
    mimeMessageHelper.setTo(recipient); // 수신자 설정
    if (type.equals("id")) {
      mimeMessageHelper.setSubject("아이디 찾기 인증번호"); // 메일 제목
    }
    else if (type.equals("password")) {
      mimeMessageHelper.setSubject("비밀번호 찾기 인증번호"); // 메일 제목
    }
    else if (type.equals("signUp")) {
      mimeMessageHelper.setSubject("회원가입 인증번호"); // 메일 제목
    }
    mimeMessageHelper.setText(setContext(code, type), true); // 메일 본문 내용, HTML 여부
    javaMailSender.send(mimeMessage);

    System.out.println("Mail Sent successfully...");
  }

  // 4자리 인증 코드를 생성하는 메서드
  public String generateVerificationCode() {
    return String.valueOf((int)(Math.random() * 9000) + 1000); // 1000 ~ 9999의 난수 생성
  }

  // thymeleaf를 통한 html 적용
  public String setContext(String code, String type) {
    Context context = new Context();
    context.setVariable("code", code);
    if (type.equals("id")) {
      return templateEngine.process("sendCode_findId", context);
    }
    else if (type.equals("password")) {
      return templateEngine.process("sendCode_findPassword", context);
    }
    else if (type.equals("signUp")) {
      return templateEngine.process("sendCode_signUp", context);
    }
    else {
      return null;
    }
  }
}

