import cv2
import torch
from PIL import Image
from ultralytics import YOLO
import numpy as np

# YOLOv8 모델 로드
model = YOLO('/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/fastAPI/app/models/YoloV8_custom_model.pt')

# def predict_category(img: Image.Image):
#     """
#     사용자 정의 YOLOv8 모델로 카테고리 예측
#     Args:
#         img (Image.Image): 입력 이미지
#     Returns:
#         str: 예측된 카테고리 (문자열)
#     """
#     # 이미지 예측 수행
#     results = model(img)
#
#     # 예측된 객체의 이름 추출 (가장 높은 점수 기준)
#     predictions = results.pandas().xyxy[0]
#     if len(predictions) > 0:
#         category = predictions.iloc[0]['name']
#     else:
#         category = "No objects detected"
#
#     return category

def predict_category(file):
    # 이미지를 읽고 전처리
    image = np.array(Image.open(file.file))  # UploadFile에서 직접 이미지 배열로 변환
    resized_image = cv2.resize(image, (640, 640))  # YOLO 입력 크기에 맞게 리사이즈
    model = YOLO('/Users/giho/Desktop/anyang/graduationProject/daeyeodwaeyo/fastAPI/app/models/YoloV8_custom_model.pt')  # 모델 경로

    # YOLO 모델로 예측
    results = model(resized_image, conf=0.1)  # conf=0.2, iou ..
    if results and len(results[0].boxes) > 0:
        max_confidence_index = results[0].boxes.conf.argmax().item()
        max_confidence_box = results[0].boxes[max_confidence_index]

        # 가장 높은 신뢰도를 가진 클래스 라벨 선택
        cls_index = int(max_confidence_box.cls.item())
        label = engToKor(results[0].names[cls_index])

        return label  # 클래스 라벨만 문자열로 반환
    else:
        return "No objects detected"

def engToKor(label):
    category, name = label.split("-")

    if (category == "camping"):
        category = "캠핑"
        if (name == "bluetoothSpeaker"):
            name = "블루투스 스피커"
        elif (name == "chair"):
            name = "의자"
        elif (name == "grill"):
            name = "화로"
        elif (name == "iceBox"):
            name = "아이스박스"
        elif (name == "lantern"):
            name = "랜턴"
        elif (name == "table"):
            name = "테이블"
        elif (name == "tent"):
            name = "텐트"

    return category + "-" + name