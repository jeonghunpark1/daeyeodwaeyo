# 이미지 유사도 측정 유틸리티
import os

import numpy as np
from typing import List, Tuple
from PIL import Image
from app.models.resnet import extract_features

def calculate_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
    """
    두 벡터 간의 코사인 유사도 계산
    Args:
        vec1 (np.ndarray): 벡터 1
        vec2 (np.ndarray): 벡터 2
    Returns:
        float: 코사인 유사도
    """
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def find_most_similar_images(input_image: Image.Image, image_folder: str) -> List[Tuple[str, float]]:
    """
    입력 이미지와 가장 유사한 10개 이미지 찾기
    Args:
        input_image (Image.Image): 입력 이미지
        image_folder (str): 비교할 이미지가 저장된 폴더 경로
    Returns:
        List[Tuple[str, float]]: 유사한 이미지 파일명과 유사도 점수 리스트
    """
    input_features = extract_features(input_image)
    similarities = []

    for filename in os.listdir(image_folder):
        img_path = os.path.join(image_folder, filename)
        img = Image.open(img_path)
        img_features = extract_features(img)
        similarity = calculate_cosine_similarity(input_features, img_features)
        similarities.append((filename, similarity))

    # 유사도 높은 상위 10개 이미지 반환
    similarities.sort(key=lambda x: x[1], reverse=True)
    return similarities[:10]