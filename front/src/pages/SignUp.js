import {React, useEffect, useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import style from "../styles/signup/signup.module.css";
import input_style from "../styles/login_signup_input.module.css";
import SignUpUserInfo from './signup/SignUpUserInfo';
import SignUpCertification from './signup/SignUpCertification';
import SignUpUserProfile from './signup/SignUpUserProfile';

export default function SignUp() {

  const [currentPage, setCurrentPage] = useState(1);  

  const [id, setId] = useState("");
  const [availableId, setAvailableId] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [emailId, setEmailId] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [certificationNumber, setCertificationNumber] = useState("");
  const [profileImage, setProfileImage] = useState("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png");
  const [profileImageURL, setProfileImageURL] = useState(""); // 이미지 URL 저장
  const [nickName, setNickName] = useState("");
  const [availableNickName, setAvailableNickName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [idValid, setIdValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(false);
  const [rePasswordValid, setRePasswordValid] = useState(false);
  const [nameValid, setNameValid] = useState(false);
  const [phoneNumberValid, setPhoneNumberValid] = useState(false);
  const [addressValid, setAddressValid] = useState(false);
  const [detailAddressValid, setDetailAddressValid] = useState(false);
  const [zipCodeValid, setZipCodeValid] = useState(false);
  const [emailIdValid, setEmailIdValid] = useState(false);
  const [emailDomainValid, setEmailDomainValid] = useState(false);
  const [certificationNumberValid, setCertificationNumberValid] = useState(false);
  const [profileImageValid, setProfileImageValid] = useState(true);
  const [profileImageURLValid, setProfileImageURLValid] = useState(true);
  const [nickNameValid, setNickNameValid] = useState(false);

  const [isEmailSend, setIsEmailSend] = useState(false);

  // overlap은 true일 때 사용가능한 id, nickName
  const [idOverlap, setIdOverlap] = useState(false);
  const [nickNameOverlap, setNickNameOverlap] = useState(false);
  
  const setStateValid = (type, value) => {
    if(type === "id") {
      const idRegex = /^[a-zA-Z0-9ㄱ-하-ㅣ가-힣]{4,}$/; // 영문 4글자 이상
      const valid = idRegex.test(value);
      // console.log("id valid: ", valid);
      setIdValid(valid);
    }
    else if (type === "idOverlap") {
      setIdOverlap(value);
      console.log("id overlap: ", getStateValid("idOverlap"));
    }
    else if (type === "password") {
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // 영문, 숫자, 특수문자 포함 8글자 이상
      const valid = passwordRegex.test(value);
      // console.log("password valid: ", valid);
      setPasswordValid(valid);
    }
    else if (type === "rePassword") {
      if(getStateValid("password")) {
        const valid = getStateValue("password") == value;
        setRePasswordValid(valid);
        // console.log("rePassword valid: ", valid);
      }
      else {
        setRePasswordValid(false);
      }
      
    }
    else if (type === "name") {
      const nameRegex = /^[^\s](\S*(\s\S+)*)?$/; // 한 글자 이상 / 앞 뒤에는 공백이 불가능하고, 문자 사이에는 공백을 허용
      const valid = nameRegex.test(value);
      // console.log("name valid: ", valid);
      setNameValid(valid);
    }
    else if (type === "phoneNumber") {
      const phoneNumberRegex = /^\d{3}-\d{4}-\d{4}$/; // 000-0000-0000 형태
      const valid = phoneNumberRegex.test(value);
      // console.log("phoneNumber valid: ", valid);
      setPhoneNumberValid(valid);
    }
    else if (type === "address") {
      const addressRegex = /^[^\s](\S*(\s\S+)*)?$/; // 한 글자 이상 / 앞 뒤에는 공백이 불가능하고, 문자 사이에는 공백을 허용
      const valid = addressRegex.test(value);
      // console.log("address valid: ", valid);
      setAddressValid(valid);
    }
    else if (type === "detailAddress") {
      const detailAddressRegex = /^[^\s](\S*(\s\S+)*)?$/; // 한 글자 이상 / 앞 뒤에는 공백이 불가능하고, 문자 사이에는 공백을 허용
      const valid = detailAddressRegex.test(value);
      // console.log("detailAddress valid: ", valid);
      setDetailAddressValid(valid);
    }
    else if (type === "zipCode") {
      const zipCodeRegex = /^[^\s](\S*(\s\S+)*)?$/; // 한 글자 이상 / 앞 뒤에는 공백이 불가능하고, 문자 사이에는 공백을 허용
      const valid = zipCodeRegex.test(value);
      // console.log("zipCode valid: ", valid);
      setZipCodeValid(valid);
    }
    else if (type === "emailId") {
      const emailIdRegex = /^\S+$/; // 공백 없이 한 글자 이상
      const valid = emailIdRegex.test(value);
      console.log("emailId valid: ", valid);
      setEmailIdValid(valid);
    }
    else if (type === "emailDomain") {
      const emailDomainRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // 영문 대소문자, 숫자, . 또는 - 하나 이상 / .필수 / 영문 대소문자 2글자 이상
      const valid = emailDomainRegex.test(value);
      console.log("emailDomain valid: ", valid);
      setEmailDomainValid(valid);
    }
    else if (type === "isEmailSend") {
      setIsEmailSend(value);
      console.log("isEmailSend: ", isEmailSend);
    }
    else if (type === "certificationNumber") {
      setCertificationNumberValid(value);
      console.log("certificationNumberValid: ", certificationNumberValid);
    }
    else if (type === "profileImage") {
      setProfileImageValid(value);
    }
    else if (type === "profileImageURL") {
      setProfileImageURLValid(value);
    }
    else if (type === "nickName") {
      const nickNameRegex = /^[^\s](\S*(\s\S+)*)?$/; // 한 글자 이상 / 앞 뒤에는 공백이 불가능하고, 문자 사이에는 공백을 허용
      const valid = nickNameRegex.test(value);
      console.log("nickName valid: ", valid);
      setNickNameValid(valid);
    }
    else if (type === "nickNameOverlap") {
      setNickNameOverlap(value);
      console.log("nickName overlap: ", getStateValid("nickNameOverlap"));
    }
  }

  const getStateValid = (type) => {
    if(type === "id") {
      return idValid;
    }
    else if(type === "idOverlap") {
      return idOverlap;
    }
    else if (type === "password") {
      return passwordValid;
    }
    else if (type === "rePassword") {
      return rePasswordValid;
    }
    else if (type === "name") {
      return nameValid;
    }
    else if (type === "phoneNumber") {
      return phoneNumberValid;
    }
    else if (type === "address") {
      return addressValid;
    }
    else if (type === "detailAddress") {
      return detailAddressValid;
    }
    else if (type === "zipCode") {
      return zipCodeValid;
    }
    else if (type === "emailId") {
      return emailIdValid;
    }
    else if (type === "emailDomain") {
      return emailDomainValid;
    }
    else if (type === "isEmailSend") {
      return isEmailSend
    }
    else if (type === "certificationNumber") {
      return certificationNumberValid;
    }
    else if (type === "profileImage") {
      return profileImageValid;
    }
    else if (type === "profileImageURL") {
      return profileImageURLValid;
    }
    else if (type === "nickName") {
      return nickNameValid;
    }
    else if (type === "nickNameOverlap") {
      return nickNameOverlap;
    }
  }

  const setStateValue = (type, value) => {
    if(type === "id") {
      setId(value);
    }
    else if (type === "availableId") {
      setAvailableId(value);
    }
    else if (type === "password") {
      setPassword(value);
    }
    else if (type === "rePassword") {
      setRePassword(value);
    }
    else if (type === "name") {
      setName(value);
    }
    else if (type === "phoneNumber") {
      // 전화번호 정규식
      const phoneNumberRegex = /^[0-9\b -]{0,13}$/;
      const phoneNumberValid = phoneNumberRegex.test(value)
      if (phoneNumberValid) {
        setPhoneNumber(value);
      }
    }
    else if (type === "address") {
      setAddress(value);
    }
    else if (type === "detailAddress") {
      setDetailAddress(value);
    }
    else if (type === "zipCode") {
      setZipCode(value);
    }
    else if (type === "emailId") {
      setEmailId(value);
    }
    else if (type === "emailDomain") {
      setEmailDomain(value);
    }
    else if (type === "certificationNumber") {
      setCertificationNumber(value);
    }
    else if (type === "profileImage") {
      setProfileImage(value);
    }
    else if (type === "profileImageURL") {
      setProfileImageURL(value);
    }
    else if (type === "nickName") {
      setNickName(value);
    }
    else if (type === "availableNickName") {
      setAvailableNickName(value);
    }
  }

  const getStateValue = (type) => {
    if(type === "id") {
      return id;
    }
    if(type === "availableId") {
      return availableId;
    }
    else if (type === "password") {
      return password;
    }
    else if (type === "rePassword") {
      return rePassword;
    }
    else if (type === "name") {
      return name;
    }
    else if (type === "phoneNumber") {
      return phoneNumber;
    }
    else if (type === "address") {
      return address;
    }
    else if (type === "detailAddress") {
      return detailAddress;
    }
    else if (type === "zipCode") {
      return zipCode;
    }
    else if (type === "emailId") {
      return emailId;
    }
    else if (type === "emailDomain") {
      return emailDomain;
    }
    else if (type === "certificationNumber") {
      return certificationNumber;
    }
    else if (type === "profileImage") {
      return profileImage;
    }
    else if (type === "profileImageURL") {
      return profileImageURL;
    }
    else if (type === "nickName") {
      return nickName;
    }
    else if(type === "availableNickName") {
      return availableNickName;
    }
  }

  // 회원가입 처리 함수
  const handleSignUp = async (event) => {

    const formData = new FormData();
    const fullAddress = `${address} ${detailAddress} (${zipCode})`
    const fullEmail = `${emailId}@${emailDomain}`

    formData.append("id", id);
    formData.append("password", password);
    formData.append("name", name);
    formData.append("phoneNumber", phoneNumber);
    formData.append("address", fullAddress);
    formData.append("email", fullEmail);
    formData.append("profileImage", profileImage)
    formData.append("nickName", nickName);

    // 확인용 코드
    // alert(JSON.stringify(userData));

    try {
      const response = await axios.post('http://localhost:8080/api/users/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',

        },
        withCredentials: true // 클라이언트와 서버가 통신할 때 쿠키와 같은 인증 정보 값을 공유하겠다는 설정
      }); // 회원가입 API 호출
      if(response && response.data) {
        alert(response.data); // 성공 메시지 출력
        navigate('/login'); // 회원가입 성공 시 로그인 페이지로 이동
      } else {
        throw new Error("서버로부터 유효한 응답을 받지 못했습니다.");
      }
    } catch (err) {
      if (err.response) {
        // 서버가 응답을 보냈으나 실패한 경우
        setError(`Error: ${err.response.status} - ${err.response.data}`);
      } else if (err.request) {
          // 요청이 보내졌지만 응답을 받지 못한 경우
          setError("서버로부터 응답이 없습니다.");
      } else {
          // 요청을 보내는 중에 발생한 다른 오류
          setError(`요청 중 오류 발생: ${err.message}`);
      }
    }
    
    // 확인용 코드
    // alert(JSON.stringify("에러: ", error));
  }

  const showSignupPage = (currentPage) => {
    switch(currentPage) {
      case 1:
        return <SignUpUserInfo  setStateValue={setStateValue} getStateValue={getStateValue} setStateValid={setStateValid} getStateValid={getStateValid}/>
      case 2:
        return <SignUpCertification setStateValue={setStateValue} getStateValue={getStateValue} setStateValid={setStateValid} getStateValid={getStateValid}/>
      case 3:
        return <SignUpUserProfile setStateValue={setStateValue} getStateValue={getStateValue} setStateValid={setStateValid} getStateValid={getStateValid}/>
    }
  };

  const buttonByPage = (currentPage) => {
    switch(currentPage) {
      case 1:
        return (
          <div className={style.page_button_wrap}>
            <button className={style.cancel_button}>취소</button>
            {/* <button className={`${style.next_button} `} onClick={() => {setCurrentPage(currentPage+1)}}>다음</button> */}
            <button className={`${style.next_button} ${inputValidByPage(currentPage) ? style.actived_button : style.disabled_button}`} disabled={inputValidByPage(currentPage) ? false : true} onClick={() => {setCurrentPage(currentPage+1)}}>다음</button>
          </div>
        )
      case 2:
        return (
          <div className={style.page_button_wrap}>
            <button className='previous_button' onClick={() => {setCurrentPage(currentPage-1)}}>이전</button>
            <button className={`${style.next_button} ${inputValidByPage(currentPage) ? style.actived_button : style.disabled_button}`} disabled={inputValidByPage(currentPage) ? false : true} onClick={() => {setCurrentPage(currentPage+1)}}>다음</button>
          </div>
        )
      case 3:
        return (
          <div className={style.page_button_wrap}>
            <button className='previous_button' onClick={() => {setCurrentPage(currentPage-1)}}>이전</button>
            <button className={`${style.signup_button} ${inputValidByPage(currentPage) ? style.actived_button : style.disabled_button}`} disabled={inputValidByPage(currentPage) ? false : true} onClick={handleSignUp}>회원가입</button>
          </div>
        )
    }
  };

  // 회원가입 페이지 별로 사용자가 값을 다 알맞게 입력했는지 확인하는 메서드
  const inputValidByPage = (currentPage) => {
    if (currentPage == 1) {
      return idValid && idOverlap && passwordValid && rePasswordValid && nameValid && phoneNumberValid && addressValid && detailAddressValid && zipCodeValid ? true : false;
    }
    else if (currentPage == 2) {
      console.log("emailidValid: ", emailIdValid);
      console.log("emailDomainValid: ", emailDomainValid);
      console.log("certificationNumberValid: ", certificationNumberValid);
      console.log("true or false: ", emailIdValid && emailDomainValid && certificationNumberValid ? true : false);
      return emailIdValid && emailDomainValid && certificationNumberValid ? true : false;
    }
    else {
      return nickNameValid ? true : false;
    }
  }

  const progressBox = (currentPage) => {
    let arr = [];
    for(let i=0; i<currentPage; i++) {
      arr.push(
        <div className={`${style.progressBox_activated} ${style.progressBox}`}></div>
      )
    }
    for(let k=0; k<3-currentPage; k++) {
      arr.push(
        <div className={`${style.progressBox_disabled} ${style.progressBox}`}></div>
      )
    }
    return arr;
  }

  // 전화번호 자동으로 '-' 넣어주기
  useEffect(() => {
    if (phoneNumber.length === 10) {
      setPhoneNumber(phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
    }
    if (phoneNumber.length === 13) {
      setPhoneNumber(phoneNumber.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
    } 
  }, [phoneNumber]);
  
  // SignUpUserInfo.js에서 입력하는 값 검증
  useEffect(() => {
    setStateValid("id", id);
    setStateValid("password", password);
    setStateValid("rePassword", rePassword);
    setStateValid("name", name);
    setStateValid("phoneNumber", phoneNumber);
    setStateValid("address", address);
    setStateValid("detailAddress", detailAddress);
    setStateValid("zipCode", zipCode);
  }, [id, password, rePassword, name, phoneNumber, address, detailAddress, zipCode])

  // SignUpCertification.js에서 입력하는 값 검증
  useEffect(() => {
    setStateValid("emailId", emailId);
    setStateValid("emailDomain", emailDomain);
    setStateValid("isEmailSend", isEmailSend);
  }, [emailId, emailDomain, isEmailSend])

  // SignUpUserProfile.js에서 입력하는 값 검증
  useEffect(() => {
    setStateValid("profileImage", profileImage);
    setStateValid("profileImageURL", profileImageURL);
    setStateValid("nickName", nickName);
  }, [profileImage, profileImageURL, nickName])


  return (
    <div className={style.signup_page}>
      <div className={style.signup_content_wrap}>
        <div className={style.progressBox_wrap}>
          {progressBox(currentPage)}
        </div>
        <div className={style.signup_content}>
          <div className={style.signup_title}>
            <h1>회원가입</h1>
          </div>
          { showSignupPage(currentPage) }
          { buttonByPage(currentPage) }
        </div>
      </div>
      
    </div>
  )
}

// 아이디
// 비밀번호
// 비밀번호 확인

// 이름
// 전화번호
// 주소
//-------------

// 이메일
// 인증번호
//--------------

// 프로필 사진
// 닉네임
