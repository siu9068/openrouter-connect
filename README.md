# Open Router Connect

OpenRouter API를 통한 AI 모델 연결 및 검증 시스템입니다.

## 프로젝트 개요

Open Router Connect는 OpenRouter API를 통해 다양한 AI 모델에 연결하고, 해당 모델들의 성능과 응답 품질을 검증하는 NestJS 기반 백엔드 애플리케이션입니다. LangChain을 활용하여 효율적인 AI 모델 관리와 테스트를 제공합니다.

## 주요 기능

- **단일 모델 테스트**: 특정 AI 모델의 연결 상태 및 응답 품질 확인
- **배치 테스트**: 여러 모델에 대한 일괄 테스트 수행
- **모델 상태 조회**: 실시간 모델 연결 상태 모니터링
- **포괄적인 로깅**: Winston을 사용한 구조화된 로그 관리

## 기술 스택

- **Backend**: NestJS (TypeScript)
- **AI Library**: LangChain v0.3
- **API Integration**: OpenRouter API (400+ AI models)
- **Logging**: Winston
- **Testing**: Jest

## 설치 및 실행

### 1. 의존성 설치

```bash
# 코어 패키지 설치 (peer dependency)
npm install @langchain/core

# 나머지 의존성 설치
npm install langchain @langchain/openai axios winston dotenv
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 값들을 설정하세요:

```bash
# OpenRouter API 설정
OPENROUTER_API_KEY=your_openrouter_api_key_here

# 기본 모델 설정
DEFAULT_MODEL=meta-llama/llama-3.1-8b-instruct:free

# 로깅 설정
LOG_LEVEL=info

# 애플리케이션 설정
PORT=3000
NODE_ENV=development
```

### 3. 애플리케이션 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run start:prod

# 빌드
npm run build

# 특정 포트에서 실행 (예: 3001)
PORT=3001 npm run start:dev
```

### 4. Swagger API 문서

애플리케이션이 실행되면 다음 URL에서 Swagger UI를 통해 API를 테스트할 수 있습니다:

- **Swagger UI**: http://localhost:3000/api (기본 포트)
- **포트 3001 사용 시**: http://localhost:3001/api

Swagger UI에서는 다음 기능을 제공합니다:
- 📋 **모든 API 엔드포인트 문서화**
- 🧪 **브라우저에서 직접 API 테스트**
- 📝 **요청/응답 예시 및 스키마**
- 🔍 **API 파라미터 및 응답 형식 상세 설명**

## API 엔드포인트

> **💡 팁**: 아래 API들을 Swagger UI에서 쉽게 테스트할 수 있습니다!

### 단일 모델 테스트
```http
POST /api/models/test
Content-Type: application/json

{
  "modelName": "meta-llama/llama-3.1-8b-instruct:free",
  "prompt": "Hello, how are you?",
  "temperature": 0.7,
  "maxTokens": 150
}
```

### 배치 테스트
```http
POST /api/models/batch-test
Content-Type: application/json

{
  "models": [
    "meta-llama/llama-3.1-8b-instruct:free",
    "mistralai/mistral-7b-instruct:free"
  ],
  "prompt": "Explain quantum computing in simple terms",
  "config": {
    "temperature": 0.5,
    "maxTokens": 200
  }
}
```

### 모델 상태 조회
```http
GET /api/models/status?model=meta-llama/llama-3.1-8b-instruct:free
```

### 사용 가능한 모델 목록
```http
GET /api/models/available
```

### 헬스 체크
```http
GET /api/models/health
```

## 지원하는 주요 AI 모델

### 무료 모델
- `meta-llama/llama-3.1-8b-instruct:free`
- `meta-llama/llama-3.1-70b-instruct:free`
- `mistralai/mistral-7b-instruct:free`
- `google/gemma-7b-it:free`
- `microsoft/phi-3-mini-128k-instruct:free`

### 프리미엄 모델
- `openai/gpt-3.5-turbo`
- `openai/gpt-4`
- `anthropic/claude-3-sonnet`
- `google/gemini-pro`

## 테스트 실행

```bash
# 단위 테스트
npm run test

# 테스트 커버리지
npm run test:cov

# E2E 테스트
npm run test:e2e

# 테스트 감시 모드
npm run test:watch
```

## 로그 관리

로그는 다음 위치에 저장됩니다:
- `logs/combined.log`: 모든 로그
- `logs/error.log`: 에러 로그만

개발 환경에서는 콘솔에도 로그가 출력됩니다.

## OpenRouter API 키 발급

1. [OpenRouter](https://openrouter.ai/) 웹사이트 방문
2. 계정 생성 및 로그인
3. API 키 생성
4. `.env` 파일에 키 설정

## 라이선스

이 프로젝트는 UNLICENSED 라이선스를 사용합니다.

## 기여하기

1. 이 저장소를 포크합니다
2. 기여할 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 문의

프로젝트에 대한 문의사항이 있으시면 이슈를 생성해주세요.