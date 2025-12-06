# Vercel 배포 설정 가이드

## 오류 해결: DATABASE_URL 환경 변수 설정

### 1단계: Vercel에서 환경 변수 설정

1. Vercel 대시보드 → 프로젝트 → **Settings** → **Environment Variables**

2. 다음 환경 변수 추가:

   #### 필수 변수
   - **`DATABASE_URL`**
     - 값: PostgreSQL 연결 문자열
     - 예: `postgresql://user:password@host:5432/dbname?sslmode=require`
     - Environment: Production, Preview, Development 모두 선택

   - **`NEXTAUTH_SECRET`**
     - 값: 랜덤 문자열 (최소 32자)
     - 생성 방법:
       ```bash
       openssl rand -base64 32
       ```
     - 또는 온라인 생성기 사용
     - Environment: Production, Preview, Development 모두 선택

   - **`NEXTAUTH_URL`**
     - 값: 배포된 URL
     - 예: `https://your-app.vercel.app`
     - Environment: Production만 선택 (또는 Preview도)

### 2단계: PostgreSQL 데이터베이스 생성

#### 옵션 A: Vercel Postgres (권장)

1. Vercel 대시보드 → 프로젝트 → **Storage** 탭
2. **"Create Database"** 클릭
3. **"Postgres"** 선택
4. 데이터베이스 이름 입력
5. **"Create"** 클릭
6. 자동으로 `DATABASE_URL` 환경 변수가 설정됨

#### 옵션 B: Supabase (무료)

1. https://supabase.com 접속 및 로그인
2. 새 프로젝트 생성
3. Settings → Database → Connection string 복사
4. Vercel 환경 변수에 `DATABASE_URL`로 추가

#### 옵션 C: Neon (무료)

1. https://neon.tech 접속 및 로그인
2. 새 프로젝트 생성
3. Connection string 복사
4. Vercel 환경 변수에 `DATABASE_URL`로 추가

### 3단계: 데이터베이스 마이그레이션

환경 변수 설정 후, 데이터베이스 테이블을 생성해야 합니다.

#### 방법 1: Vercel 대시보드에서 실행 (권장)

1. Vercel 대시보드 → 프로젝트 → **Deployments**
2. 최신 배포 클릭 → **Functions** 탭
3. 또는 **Settings** → **Functions**에서 새 함수 생성

#### 방법 2: 로컬에서 실행

```bash
# DATABASE_URL 환경 변수 설정
export DATABASE_URL="your-postgres-url"

# 마이그레이션 실행
npx prisma migrate deploy
```

#### 방법 3: Vercel CLI 사용

```bash
# Vercel CLI 설치 (없는 경우)
npm i -g vercel

# 로그인
vercel login

# 환경 변수 설정
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
vercel env add NEXTAUTH_URL

# 마이그레이션 실행
vercel env pull .env.local
DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d '=' -f2) npx prisma migrate deploy
```

### 4단계: 재배포

1. Vercel 대시보드 → **Deployments**
2. 최신 배포 → **"Redeploy"** 클릭
3. 또는 GitHub에 코드를 푸시하면 자동 재배포

### 5단계: 확인

배포 완료 후:
1. 배포된 URL 접속
2. 교사 회원가입 테스트
3. 학생 등록 테스트

## 문제 해결

### 빌드 오류가 계속 발생하는 경우

1. **환경 변수 확인**
   - Settings → Environment Variables에서 모든 변수가 설정되었는지 확인
   - Environment가 올바르게 선택되었는지 확인 (Production, Preview, Development)

2. **빌드 로그 확인**
   - Deployments → 최신 배포 → Build Logs 확인
   - 오류 메시지 확인

3. **Prisma 스키마 확인**
   - `prisma/schema.prisma`가 PostgreSQL로 설정되어 있는지 확인
   - `provider = "postgresql"` 확인

### 데이터베이스 연결 오류

- `DATABASE_URL` 형식 확인
- SSL 연결이 필요한 경우 `?sslmode=require` 추가
- 방화벽 설정 확인 (Vercel IP 허용)

