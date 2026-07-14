# AgriSage

작물 사진 한 장으로 병충해를 진단하고, 판단 근거를 설명하고, 상황에 맞는 방제 방법을 추천하고, 방제 이후까지 확인해주는 AI 기반 농업 지원 서비스.

PRD: 팀 C (Hyunjun Lee, Hanmin Bae, Minseong Hong, Najin Son, Sehyeon Kim)

## 구조

- `frontend/` — React + Vite + Tailwind
- `backend/` — Node.js + Express

## 로컬 실행 (개발 모드)

```bash
# backend (http://localhost:4000)
cd backend
npm install
npm run dev

# frontend (http://localhost:5173, /api는 backend로 프록시됨)
cd frontend
npm install
npm run dev
```

## 프로덕션 빌드 (Render 배포와 동일한 방식)

```bash
npm install --prefix frontend && npm run build --prefix frontend
npm install --prefix backend
node backend/src/server.js
```

`http://localhost:4000` 하나로 프론트+백엔드가 함께 뜹니다.

## Render 배포

저장소 루트의 `render.yaml`을 Render에서 Blueprint로 연결하면 자동으로 배포됩니다.

1. Render 대시보드 → "New +" → "Blueprint"
2. 이 GitHub 저장소 연결
3. `render.yaml` 설정이 자동 인식되어 Node 웹 서비스 하나로 배포됨 (Health Check: `/api/health`)

## 진행 상황

- [x] FR-1 이미지 업로드 + 진단 결과 화면 (현재는 mock 데이터)
- [ ] FR-2 LLM 기반 결과 설명
- [ ] FR-3 맞춤형 방제 추천
- [ ] FR-4 PLS 안전기준 체크
- [ ] FR-5 사후관리 알림
