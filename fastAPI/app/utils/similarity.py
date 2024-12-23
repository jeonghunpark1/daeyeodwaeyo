import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from tensorflow.keras.preprocessing import image
import os
import random
import tensorflow as tf
from sklearn.preprocessing import normalize
import cv2

# 랜덤 시드 설정 (결정성 보장)
SEED = 42
random.seed(SEED)
np.random.seed(SEED)
tf.random.set_seed(SEED)

# TensorFlow의 비결정적 동작 방지 설정
tf.config.experimental.enable_op_determinism()

# ResNet50 모델 로드 (결정성을 위해 설정)
model = ResNet50(weights='imagenet', include_top=False, pooling='avg')

# CSV 파일 경로
CSV_FILE_PATH = "/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/fastAPI/app/utils/features.csv"


# 특징 추출 함수 (ResNet50)
def extract_features(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_data = image.img_to_array(img)
    img_data = np.expand_dims(img_data, axis=0)
    img_data = preprocess_input(img_data)

    # TensorFlow 세션 내에서 모델 예측 수행
    features = model.predict(img_data)

    # 특성 값 정규화 (L2 정규화)
    features = normalize(features, norm='l2')
    return features.flatten()


# 색상 히스토그램 추출 함수
def extract_color_histogram(img_path, bins=(8, 8, 8)):
    image = cv2.imread(img_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    # 이미지의 색상 히스토그램을 계산하고 정규화
    hist = cv2.calcHist([image], [0, 1, 2], None, bins, [0, 256, 0, 256, 0, 256])
    hist = cv2.normalize(hist, hist).flatten()
    return hist


# 폴더 내에서 유사한 이미지 검색 함수
def find_similar_images(input_image_path, folder_path, top_n=50):
    # 입력 이미지의 특징 및 색상 히스토그램 추출
    input_feature = extract_features(input_image_path)
    input_histogram = extract_color_histogram(input_image_path)

    similarities = []
    image_names = []

    # 파일 정렬하여 항상 동일한 순서로 처리
    for filename in sorted(os.listdir(folder_path)):
        if filename.endswith((".jpg", ".jpeg", ".png")):
            img_path = os.path.join(folder_path, filename)
            # 비교할 이미지의 특징 및 색상 히스토그램 추출
            feature = extract_features(img_path)
            histogram = extract_color_histogram(img_path)

            # 특징과 히스토그램을 결합하여 유사도 계산
            combined_input = np.concatenate([input_feature, input_histogram])
            combined_feature = np.concatenate([feature, histogram])
            similarity = cosine_similarity([combined_input], [combined_feature])[0][0]

            similarities.append(similarity)
            image_names.append(filename)

    # 유사도 기준으로 상위 50개 선택
    top_indices = np.argsort(similarities)[-top_n:][::-1]
    similar_images = [image_names[i] for i in top_indices]
    return similar_images
