# ResNet 모델 로드 및 유틸 함수
# ResNet 모델을 로드하고 분류를 수행하는 함수

import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
from PIL import Image
import os

# 학습된 사용자 정의 ResNet50 모델 불러오기
custom_model = load_model("/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/fastAPI/app/models/ResNet50_v1i_50layer_Adam00001_78percent_model.keras")

# 기본 ResNet50 모델 불러오기 (유사도 계산용)
base_resnet = ResNet50(weights="imagenet", include_top=False) # 최종 분류 계층 제거, 특성 추출에 사용

def predict_category(img: Image.Image):
    """
    사용자 정의 ResNet50 모델로 카테고리 예측
    Args:
        img (Image.Image): 입력 이미지
    Returns:
        str: 예측된 카테고리 (문자열)
    """
    img = img.resize((224, 224)) # 모델 입력 크기에 맞춤
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # 예측
    predictions = custom_model.predict(img_array)
    predicted_category = predictions[0] # 카테고리 문자열로 나오는 값
    return predicted_category

def extract_features(img: Image.Image):
    """
    기본 ResNet50 모델을 이용해 이미지의 특성 백터를 추출
    Args:
        img (Image.Image): 입력 이미지
    Returns:
        np.ndarray: 특성 백터
    """
    img = img.resize((224, 224)) # 모델 입력 크기에 맞춤
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)

    # 특성 백터 추출
    features = base_resnet.predict(img_array)
    return features.flatten()