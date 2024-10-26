# API 엔드포인트

from fastapi import APIRouter, File, UploadFile
from PIL import Image
from app.models.resnet import predict_category
from app.utils.similarity import find_most_similar_images
from app.schemas.image_schema import CategoryPrediction, SimilarImagesResponse, SimilarImage
from fastapi import HTTPException

router = APIRouter()

# 카테고리 예측 엔드포인트
@router.post("/predict", response_model=CategoryPrediction)
async def predict(file: UploadFile = File(...)):
    try:
        image = Image.open(file.file)
        category_scores = predict_category(image)  # 배열 형식의 예측 결과
        # 가장 높은 값을 가지는 인덱스를 category로 변환
        category_index = category_scores.argmax()  # 예측된 카테고리 인덱스
        category = str(category_index)  # 인덱스를 문자열로 변환하거나 적절한 카테고리 이름으로 변환
        return {"category": category}
    except Exception as e:
        print(f"Prediction error: {e}")  # 에러 내용을 출력
        raise HTTPException(status_code=500, detail="Internal Server Error during prediction")

# 유사한 이미지 찾기 엔드포인트
@router.post("/similarity", response_model=SimilarImagesResponse)
async def find_similar_images(file: UploadFile = File(...), folder_path: str = ""):
    input_image = Image.open(file.file)
    similar_images = find_most_similar_images(input_image, folder_path)

    response = [SimilarImage(filename=name, similarity=score) for name, score in similar_images]
    return {"similar_images": response}