# 이미지 처리 유틸리티
from rembg import remove
from PIL import Image
import io
import tempfile

def remove_background(image_data):
    input_image = Image.open(io.BytesIO(image_data))
    output_image = remove(input_image)

    output_buffer = io.BytesIO()
    output_image.save(output_buffer, format="PNG")
    output_buffer.seek(0)

    return output_buffer

# params = {
#     # 객체와 배경의 경계를 더 부드럽게 처리
#     # 값: True, False / 기본값: False
#     "alpha_matting" : False,
#
#     # 전경(foreground) 픽셀을 결정하는 기준 임계값. 이 값보다 높은 픽셀은 전경으로 간주됨. 값을 높일수록 전경 영역이 확장됨.
#     # 값: 0 ~ 255 / 일반적으로 240
#     "alpha_matting_foreground_threshold" : 240,
#
#     # 배경(background) 픽셀을 결정하는 임계값. 이 값보다 낮은 필섹은 배경으로 간주됨.
#     # 값: 0 ~ 255 / 일반적으로 10 ~ 20
#     "alpha_matting_background_threshold" : 15,
#
#     # 전경과 배경의 구조적 침식(erode) 크기를 설정하는 값. 값을 키우면 경계가 더 두꺼워져, 배경과 전경의 구분이 명확해짐
#     # 값: 양의 정수(1 이상) / 일반적으로 5 ~ 15
#     "alpha_matting_erode_structure_size" : 10,
#
#     # 이미지 크기를 기준으로 하는 기초 크기. 알파 매트 기법을 적용하기 전에 이미지가 이 크기로 리사이즈 됨. 값을 키우면 더 세밀한 매트 처리가 가능하지만 처리 시간이 길어짐.
#     # 값: 양의 정수(1 이상) / 일반적으로 1000 ~ 1500
#     "alpha_matting_base_size" : 1000,
# }
# # 실행 예시
# input_file = "product_723.jpg"
# output_file = "bg-product_723.png"  # 확장자를 .png로 지정
# remove_background(input_file, output_file)
