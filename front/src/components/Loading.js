import React, { useEffect, useState, useRef } from 'react';
import { SyncLoader } from 'react-spinners';

export default function Loading({ loading }) {
  const containerRef = useRef(null); // 상위 컨테이너 참조를 위한 useRef
  const [spinnerSize, setSpinnerSize] = useState(25); // 스피너 크기를 저장하는 상태

  // 상위 컨테이너 크기에 따라 스피너 크기 업데이트하는 함수
  const updateSpinnerSize = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth; // 상위 컨테이너의 너비
      const newSize = Math.max(15, containerWidth * 0.1); // 상위 컨테이너 너비의 5%로 스피너 크기 설정
      setSpinnerSize(newSize);
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 초기 크기 설정
    updateSpinnerSize();

    // 창 크기 변경 시 크기 업데이트
    window.addEventListener('resize', updateSpinnerSize);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('resize', updateSpinnerSize);
    };
  }, []);

  // 스타일 오버라이드 설정
  const override = {
    textAlign: 'center',
    // backgroundColor: 'white'
  };

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%', padding: '20px', boxSizing: 'border-box'}}>
      <SyncLoader
        color="black"
        loading={loading}
        cssOverride={override}
        size={spinnerSize} // 동적으로 조정된 크기 적용
        speedMultiplier={0.8}
        margin={5}
      />
      <h3>로딩중...</h3>
    </div>
  );
}
