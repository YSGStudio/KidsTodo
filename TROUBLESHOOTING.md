# 로그인/회원가입 문제 해결

## 가능한 원인

### 1. 데이터베이스 마이그레이션 미완료 (가장 가능성 높음)

Vercel 배포 후 데이터베이스 테이블이 생성되지 않았을 수 있습니다.

**해결 방법:**
```bash
# 로컬에서 실행 (DATABASE_URL 환경 변수 필요)
DATABASE_URL="your-vercel-postgres-url" npx prisma migrate deploy
```

또는 Vercel 대시보드에서:
1. Functions 탭
2. 새 함수 생성 또는 기존 함수 수정
3. 마이그레이션 코드 실행

### 2. 환경 변수 미설정

필수 환경 변수가 설정되지 않았을 수 있습니다:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

**확인 방법:**
- Vercel → Settings → Environment Variables

### 3. 데이터베이스 연결 오류

PostgreSQL 연결 문자열이 잘못되었을 수 있습니다.

**확인 사항:**
- `DATABASE_URL` 형식이 올바른지
- SSL 연결이 필요한 경우 `?sslmode=require` 추가

### 4. API 라우트 오류

브라우저 개발자 도구에서 네트워크 탭 확인:
- 오류 메시지 확인
- 응답 상태 코드 확인

## 빠른 해결 방법

### 1단계: 데이터베이스 마이그레이션 실행

```bash
# Vercel CLI 사용
npx vercel env pull .env.local
DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d '=' -f2) npx prisma migrate deploy
```

### 2단계: 브라우저 콘솔 확인

1. 개발자 도구 열기 (F12)
2. Console 탭에서 오류 확인
3. Network 탭에서 API 요청 확인

### 3단계: Vercel 로그 확인

1. Vercel 대시보드 → 프로젝트
2. Functions 탭 → 로그 확인
3. 오류 메시지 확인

