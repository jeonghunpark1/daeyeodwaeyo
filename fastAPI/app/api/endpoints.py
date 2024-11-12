# API 엔드포인트

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
@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        category = predict_category(file)
        if category:
            return {"category": category}
        raise HTTPException(status_code=500, detail="No objects detected in the image")
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during prediction")

@router.post("/removeBg")
async def remove_bg(file: UploadFile = File(...)):
    try:
        image_data = await file.read()
        result_image = remove_background(image_data)
        return StreamingResponse(result_image, media_type="image/png")
    except Exception as e:
        print(f"Error removing background: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error during background removal")

# # 유사한 이미지 찾기 엔드포인트
# @router.post("/similarity", response_model=SimilarImagesResponse)
# async def find_similar_images(file: UploadFile = File(...), folder_path: str = ""):
#     input_image = Image.open(file.file)
#     similar_images = find_most_similar_images(input_image, folder_path)
#
#     response = [SimilarImage(filename=name, similarity=score) for name, score in similar_images]
#     return {"similar_images": response}