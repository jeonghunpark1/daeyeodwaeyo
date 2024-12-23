# FastAPI 서버 시작 파일
# uvicorn app.main:app --reload --host 0.0.0.0 --port=8001

from fastapi import FastAPI
from app.api import endpoints

app = FastAPI()

# 엔드포인트 등록
app.include_router(endpoints.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)