import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts';

const PriceGraph = ({ priceList }) => {

  // 평균 가격 계산 (정수로 변환)
  const averagePrice = Math.round(priceList.reduce((sum, price) => sum + price, 0) / priceList.length);

  // 가격에 천 단위 콤마를 추가하는 함수
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // 가격 분포를 히스토그램 데이터로 변환
  const histogramData = priceList.reduce((acc, price) => {
    const range = `${Math.floor(price / 10) * 10}-${Math.floor(price / 10) * 10 + 10}`;
    const existingRange = acc.find(data => data.range === range);
    if (existingRange) {
      existingRange.count += 1;
    } else {
      acc.push({ range, count: 1 });
    }
    return acc;
  }, []);

  // range를 기준으로 오름차순 정렬
  histogramData.sort((a, b) => {
    const aRangeStart = parseInt(a.range.split('-')[0], 10);
    const bRangeStart = parseInt(b.range.split('-')[0], 10);
    return aRangeStart - bRangeStart;
  });

  // 히스토그램 데이터에서 count의 최대값 계산
  const maxCount = Math.max(...histogramData.map(data => data.count));

  // 커스텀 Y축 라벨 컴포넌트
  const CustomYAxisLabel = ({ viewBox, text }) => {
    const { x, y } = viewBox;
    return (
      <text x={x + 30} y={y + 20} textAnchor="middle" fill="#666">
        {text.split("").map((char, index) => (
          <tspan x={x + 30} dy={index === 0 ? 0 : 18} key={index}>
            {char}
          </tspan>
        ))}
      </text>
    );
  };

  // Custom Tooltip 컴포넌트
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // range 값에 천 단위 표시
      const [start, end] = label.split("-").map(num => parseInt(num).toLocaleString());

      return (
        <div style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc'}}>
          <p>{`${start}원 - ${end}원`}</p> {/* 천 단위 표시된 범위 */}
          <p style={{ color: '#8884d8' }}>상품수: {payload[0].value}</p>
          <p style={{ color: '#8884d8' }}>평균 가격: {formatPrice(averagePrice)} 원</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={histogramData} margin={{ top: 20, right: 20, bottom: 20, left: -15}}>
        <CartesianGrid strokeDasharray="3 3" />
        
        {/* X축 및 Y축 설정 */}
        <XAxis dataKey="range" label={{ value: '가격분포', position: 'insideBottom', offset: -10 }} tick={{ fontSize: 14 }} tickFormatter={formatPrice} interval={1}/>
        <YAxis label={<CustomYAxisLabel text="상품수" />} tickCount={maxCount + 1} allowDecimals={false} domain={[0, maxCount]} />

        {/* 툴팁 추가 */}
        <Tooltip content={<CustomTooltip />} />

        {/* 히스토그램 막대 */}
        <Bar dataKey="count" fill="#8884d8" />

        {/* 평균 가격선 */}
        <ReferenceLine y={averagePrice} label={{ position: 'top', value: `평균 가격: ${formatPrice(averagePrice)} 원` }} stroke="red" strokeDasharray="3 3" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default PriceGraph;