# Pydantic 스키마 정의

from pydantic import BaseModel
from typing import List, Tuple

class CategoryPrediction(BaseModel):
    category: str

class SimilarImage(BaseModel):
    filename: str
    similarity: float

class SimilarImagesResponse(BaseModel):
    similar_images: List[SimilarImage]