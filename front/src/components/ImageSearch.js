import axios from 'axios';
import React, { useState } from 'react'

export default function ImageSearch() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseFile, setResponseFile] = useState(null); // 응답 파일 객체 저장

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // 이미지 전송 및 응답 받기
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("이미지를 선택하세요");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post("http://localhost:8080/api/images/removeBg", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        responseType: "blob", // 이미지 파일로 응답 받기
      });

      // 응답 이미지를 파일 객체로 저장
      const file = new File([response.data], "background-removed.png", { type: "image/png" });
      setResponseFile(file);
    } catch (err) {
      console.error("이미지 업로드 오류:", err);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  return (
    <div>
      <h1>배경 제거 이미지 업로드</h1>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>배경 제거</button>

      {responseFile && (
        <div>
          <h2>배경 제거된 이미지</h2>
          <img src={URL.createObjectURL(responseFile)} alt="배경 제거된 이미지" />
        </div>
      )}
    </div>
  )
}
