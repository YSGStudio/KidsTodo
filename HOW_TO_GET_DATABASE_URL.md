# DATABASE_URL 가져오는 방법

## 방법 1: Vercel Postgres 사용 시 (가장 쉬움)

### 1단계: Vercel 대시보드에서 Storage 확인

1. **Vercel 대시보드** 접속: https://vercel.com/dashboard
2. 프로젝트 선택 (KidsTodo)
3. 좌측 메뉴에서 **"Storage"** 탭 클릭

### 2단계: 데이터베이스 확인

- **이미 데이터베이스가 있다면:**
  - 데이터베이스 이름 클릭
  - **"Settings"** 탭 클릭
  - **"Connection String"** 섹션에서 `DATABASE_URL` 복사
  - 또는 **"Environment Variables"** 섹션에서 자동으로 설정된 `DATABASE_URL` 확인

- **데이터베이스가 없다면:**
  1. **"Create Database"** 버튼 클릭
  2. **"Postgres"** 선택
  3. 데이터베이스 이름 입력 (예: `kids-todo-db`)
  4. **"Create"** 클릭
  5. 생성 후 자동으로 `DATABASE_URL` 환경 변수가 설정됨

### 3단계: Environment Variables에서 확인

1. 프로젝트 → **Settings** → **Environment Variables**
2. `DATABASE_URL` 변수 찾기
3. 값 복사 (눈 아이콘 클릭하여 표시)

## 방법 2: Supabase 사용 시

### 1단계: Supabase 프로젝트 접속

1. https://supabase.com 접속 및 로그인
2. 프로젝트 선택

### 2단계: Connection String 복사

1. 좌측 메뉴 → **Settings** (톱니바퀴 아이콘)
2. **"Database"** 클릭
3. **"Connection string"** 섹션
4. **"URI"** 탭 선택
5. 연결 문자열 복사
   - 형식: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`
6. 비밀번호를 실제 비밀번호로 교체

### 3단계: Vercel에 환경 변수로 추가

1. Vercel → 프로젝트 → Settings → Environment Variables
2. **"Add New"** 클릭
3. Key: `DATABASE_URL`
4. Value: 복사한 연결 문자열
5. Environment: Production, Preview, Development 모두 선택
6. **"Save"** 클릭

## 방법 3: Neon 사용 시

### 1단계: Neon 프로젝트 접속

1. https://neon.tech 접속 및 로그인
2. 프로젝트 선택

### 2단계: Connection String 복사

1. 프로젝트 대시보드에서 **"Connection Details"** 클릭
2. **"Connection string"** 복사
   - 형식: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`

### 3단계: Vercel에 환경 변수로 추가

위와 동일하게 Vercel에 추가

## 방법 4: Vercel CLI로 가져오기

```bash
# Vercel CLI 설치 (없는 경우)
npm i -g vercel

# 로그인
vercel login

# 프로젝트 디렉토리로 이동
cd /Users/yangseung-geun/TodoTest

# 환경 변수 가져오기
vercel env pull .env.local

# DATABASE_URL 확인
cat .env.local | grep DATABASE_URL
```

## DATABASE_URL 형식 예시

```
postgresql://user:password@host:5432/dbname?sslmode=require
```

또는

```
postgresql://postgres.xxxxx:password@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
```

## 중요 사항

⚠️ **보안 주의:**
- DATABASE_URL에는 비밀번호가 포함되어 있습니다
- 절대 공개 저장소에 커밋하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 있어야 합니다

## 문제 해결

### DATABASE_URL을 찾을 수 없는 경우

1. **Vercel Postgres를 아직 생성하지 않았다면:**
   - Storage → Create Database → Postgres 선택
   - 생성하면 자동으로 환경 변수에 추가됨

2. **다른 데이터베이스를 사용 중이라면:**
   - 해당 서비스의 문서에서 Connection String 찾는 방법 확인
   - Vercel Environment Variables에 수동으로 추가

3. **환경 변수가 보이지 않는 경우:**
   - Settings → Environment Variables에서 확인
   - Environment 필터 확인 (Production, Preview, Development)


