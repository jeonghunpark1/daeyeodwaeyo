package com.daeyeodwaeyo.back.springboot.config;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

  private String SECRET_KEY = "secret"; // 토큰 서명에 사용할 비밀 키

//  JWT 토큰을 생성하는 메서드
//  @param userId 사용자 ID
//  @return 생성된 JWT 토큰
  public String generateToken(String userId) {
    return Jwts.builder()
            .setSubject(userId) // 사용자 ID를 서브젝트로 설정
            .setIssuedAt(new Date()) // 토큰 생성 시간
            .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10시간 유효
            .signWith(SignatureAlgorithm.HS256, SECRET_KEY) // HMAC SHA256 알고리즘으로 서명
            .compact();
  }

  // JWT 토큰에서 사용자 이름(아이디)을 추출하는 메서드
  public String extractUsername(String token) {
    return extractClaim(token, Claims::getSubject); // 토큰의 'sub' 필드에서 사용자 이름(아이디) 추출
  }

  // JWT 토큰에서 만료 시간을 추출하는 메서드
  public Date extractExpiration(String token) {
    return extractClaim(token, Claims::getExpiration); // 만료 시간 추출
  }

  // JWT 토큰에서 클레임을 추출하는 메서드
  public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
    final Claims claims = extractAllClaims(token); // 토큰의 모든 클레임을 추출
    return claimsResolver.apply(claims); // 특정 클레임 추출
  }

  // JWT 토큰에서 모든 클레임을 추출하는 메서드
  public Claims extractAllClaims(String token) {
    try {
      return Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
    } catch (Exception e) {
      throw new MalformedJwtException("Invalid JWT Token", e); // 에러 핸들링 추가
    }

  }

  // JWT 토큰이 만료되었는지 확인하는 메서드
  private Boolean isTokenExpired(String token) {
    return extractExpiration(token).before(new Date()); // 만료 시간과 현재 시간을 비교
  }

  // JWT 토큰이 유효한지 확인하는 메서드
  public Boolean validateToken(String token, String username) {
    final String extractedUsername = extractUsername(token); // 토큰에서 사용자 이름 추출
    return (extractedUsername.equals(username) && !isTokenExpired(token)); // 토큰의 사용자 이름이 일치하고 만료되지 않음
  }
}
