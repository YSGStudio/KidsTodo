# Vercel 환경 변수 설정 순서

## ⚠️ 중요: 환경 변수를 먼저 설정해야 빌드가 성공합니다!

## 1단계: PostgreSQL 데이터베이스 생성 (DATABASE_URL 자동 설정)

### 방법 A: Vercel Postgres 사용 (가장 쉬움)

1. **Vercel 대시보드 접속**
   - https://vercel.com/dashboard
   - 프로젝트 선택

2. **Storage 탭으로 이동**
   - 좌측 메뉴에서 **"Storage"** 클릭
   - 또는 프로젝트 → **"Storage"** 탭

3. **PostgreSQL 데이터베이스 생성**
   - **"Create Database"** 버튼 클릭
   - **"Postgres"** 선택
   - 데이터베이스 이름 입력 (예: `kids-todo-db`)
   - **"Create"** 클릭
   - ⚠️ **자동으로 `DATABASE_URL` 환경 변수가 설정됩니다!**

### 방법 B: Supabase 사용 (무료)

1. https://supabase.com 접속 및 로그인
2. **"New Project"** 클릭
3. 프로젝트 정보 입력:
   - Name: `kids-todo`
   - Database Password: 설정
   - Region: 선택
4. **"Create new project"** 클릭
5. 프로젝트 생성 완료 후:
   - Settings → **Database**
   - **Connection string** → **URI** 복사
   - 형식: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

6. **Vercel에 환경 변수 추가**
   - Vercel → 프로젝트 → Settings → Environment Variables
   - Key: `DATABASE_URL`
   - Value: 복사한 연결 문자열
   - Environment: **Production, Preview, Development 모두 선택**
   - **"Save"** 클릭

## 2단계: NEXTAUTH_SECRET 생성 및 설정

1. **랜덤 문자열 생성**
   
   터미널에서 실행:
   ```bash
   openssl rand -base64 32
   ```
   
   또는 온라인 생성기 사용:
   - https://generate-secret.vercel.app/32

2. **Vercel에 환경 변수 추가**
   - Vercel → 프로젝트 → Settings → Environment Variables
   - Key: `NEXTAUTH_SECRET`
   - Value: 생성한 랜덤 문자열
   - Environment: **Production, Preview, Development 모두 선택**
   - **"Save"** 클릭

## 3단계: NEXTAUTH_URL 설정

1. **임시로 설정** (나중에 실제 URL로 변경)
   - Key: `NEXTAUTH_URL`
   - Value: `https://your-app-name.vercel.app` (실제 배포된 URL)
   - Environment: **Production만 선택**
   - **"Save"** 클릭

   ⚠️ 첫 배포 후 실제 URL을 확인하여 업데이트하세요.

## 4단계: 환경 변수 확인

설정한 환경 변수:
- ✅ `DATABASE_URL` (PostgreSQL 연결 문자열)
- ✅ `NEXTAUTH_SECRET` (랜덤 문자열)
- ✅ `NEXTAUTH_URL` (배포된 URL)

각 변수의 **Environment**가 올바르게 선택되었는지 확인:
- Production: ✅
- Preview: ✅ (DATABASE_URL, NEXTAUTH_SECRET만)
- Development: ✅ (DATABASE_URL, NEXTAUTH_SECRET만)

## 5단계: 재배포

1. **Deployments** 탭으로 이동
2. 최신 배포 → **"Redeploy"** 클릭
3. 또는 GitHub에 코드를 푸시하면 자동 재배포

## 6단계: 데이터베이스 마이그레이션

배포가 성공한 후, 데이터베이스 테이블을 생성해야 합니다.

### 방법 1: 로컬에서 실행

```bash
# 환경 변수 가져오기 (Vercel CLI 사용)
npx vercel env pull .env.local

# 마이그레이션 실행
npx prisma migrate deploy
```

### 방법 2: Vercel 함수에서 실행

1. Vercel 대시보드 → Functions
2. 새 함수 생성 또는 기존 함수 수정
3. 마이그레이션 코드 실행

## 문제 해결

### 여전히 DATABASE_URL 오류가 발생하는 경우

1. **환경 변수 확인**
   - Settings → Environment Variables
   - `DATABASE_URL`이 있는지 확인
   - Environment가 올바르게 선택되었는지 확인

2. **빌드 로그 확인**
   - Deployments → 최신 배포 → Build Logs
   - 오류 메시지 확인

3. **재배포**
   - 환경 변수 설정 후 반드시 재배포 필요

### 빌드는 성공했지만 데이터베이스 연결 오류

- `DATABASE_URL` 형식 확인
- SSL 연결이 필요한 경우 `?sslmode=require` 추가
- 데이터베이스가 실행 중인지 확인

