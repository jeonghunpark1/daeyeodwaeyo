# API 엔드포인트
import shutil
import os
from fastapi.responses import JSONResponse
from app.utils.similarity import find_similar_images

from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import StreamingResponse
from app.models.YOLOv8Model import predict_category  # 모델 예측 함수 임포트
from app.utils.image_utils import remove_background # 배경 제거 함수
from app.schemas.image_schema import CategoryPrediction

router = APIRouter()


# id와 name 매핑을 위한 딕셔너리 생성
CATEGORY_MAPPING = {
    1: "캠핑-블루투스 스피커",
    2: "캠핑-의자",
    3: "캠핑-화로",
    4: "캠핑-아이스박스",
    5: "캠핑-랜턴",
    6: "캠핑-테이블",
    7: "캠핑-텐트",
}

# # 카테고리 예측 엔드포인트 / ResNet50 모델
# @router.post("/predict", response_model=CategoryPrediction)
# async def predict(file: UploadFile = File(...)):
#     try:
#         image = Image.open(file.file)
#         category_scores = predict_category(image)  # 배열 형식의 예측 결과
#         # 가장 높은 값을 가지는 인덱스를 category로 변환
#         category_index = category_scores.argmax()  # 예측된 카테고리 인덱스
#         category = str(category_index)  # 인덱스를 문자열로 변환하거나 적절한 카테고리 이름으로 변환
#         return {"category": category}
#     except Exception as e:
#         print(f"Prediction error: {e}")  # 에러 내용을 출력
#         raise HTTPException(status_code=500, detail="Internal Server Error during prediction")

router = APIRouter()

# 카테고리 예측 엔드포인트
@router.post("/fastapi/predict")
async def predict(file: UploadFile = File(...)):
    try:
        category = predict_category(file)
        if category:
            return {"category": category}
        raise HTTPException(status_code=500, detail="No objects detected in the image")
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during prediction")

@router.post("/fastapi/removeBg")
async def remove_bg(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        result_image = remove_background(image_data)
        return StreamingResponse(result_image, media_type="image/png")
    except Exception as e:
        print(f"Error removing background: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during background removal")

# 유사 이미지 검색 요청
@router.post("/fastapi/similarity")
async def similarity_search(file: UploadFile = File(...)):
    try:
        # 요청 받은 이미지 파일 임시 저장
        temp_path = f"temp_{file.filename}"
        with open(temp_path, "wb") as buffer:
            buffer.write(await file.read())

        # 폴더 내 유사한 이미지 찾기
        folder_path = "/opt/homebrew/var/www/resources/images/productImage"  # 비교할 이미지 폴더 경로
        similar_images = find_similar_images(temp_path, folder_path)

        # 임시 파일 삭제
        os.remove(temp_path)

        return JSONResponse(content={"similar_images": similar_images})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))