# 배포 가이드

## Vercel 배포 (권장)

### 1. Vercel 계정 생성
1. [Vercel](https://vercel.com)에 접속하여 계정 생성
2. GitHub 계정으로 로그인 (권장)

### 2. GitHub에 코드 푸시
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 3. 데이터베이스 설정

#### 옵션 A: Vercel Postgres (권장)
1. Vercel 대시보드에서 프로젝트 생성
2. "Storage" 탭에서 "Create Database" 클릭
3. "Postgres" 선택
4. 데이터베이스 생성 후 연결 정보 복사

#### 옵션 B: 무료 PostgreSQL 서비스
- [Supabase](https://supabase.com) (무료 티어 제공)
- [Neon](https://neon.tech) (무료 티어 제공)
- [Railway](https://railway.app) (무료 크레딧 제공)

### 4. Prisma 스키마 업데이트

PostgreSQL을 사용하려면 `prisma/schema.prisma` 파일을 수정해야 합니다:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

그리고 마이그레이션:
```bash
npx prisma migrate dev --name init
```

### 5. 환경 변수 설정

Vercel 대시보드에서:
1. 프로젝트 → Settings → Environment Variables
2. 다음 변수 추가:
   - `DATABASE_URL`: PostgreSQL 연결 문자열
   - `NEXTAUTH_SECRET`: 랜덤 문자열 (예: `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: 배포된 URL (예: `https://your-app.vercel.app`)

### 6. 배포

Vercel이 자동으로 GitHub와 연동되어 배포됩니다.
- 코드를 푸시하면 자동 배포
- Pull Request마다 프리뷰 배포

## Railway 배포 (대안)

### 1. Railway 계정 생성
1. [Railway](https://railway.app)에 접속
2. GitHub 계정으로 로그인

### 2. 새 프로젝트 생성
1. "New Project" 클릭
2. "Deploy from GitHub repo" 선택
3. 저장소 선택

### 3. PostgreSQL 추가
1. "New" → "Database" → "PostgreSQL" 선택
2. 자동으로 `DATABASE_URL` 환경 변수 설정됨

### 4. 환경 변수 설정
- `NEXTAUTH_SECRET`: 랜덤 문자열
- `NEXTAUTH_URL`: Railway에서 제공하는 URL

## 배포 후 확인사항

1. 데이터베이스 마이그레이션 실행
2. 첫 교사 계정 생성 테스트
3. 학생 등록 테스트
4. 투두리스트 기능 테스트

## 문제 해결

### 빌드 오류
- `prisma generate`가 빌드 과정에 포함되어 있는지 확인
- 환경 변수가 올바르게 설정되었는지 확인

### 데이터베이스 연결 오류
- `DATABASE_URL` 형식 확인
- SSL 연결이 필요한 경우 `?sslmode=require` 추가

### Prisma 클라이언트 오류
- 빌드 시 `prisma generate` 실행 확인
- `package.json`의 `postinstall` 스크립트 확인

