# Vercel 빌드 오류 해결

## 문제 분석

로그를 보면:
1. ❌ `prisma db push`가 여전히 실행되고 있음
2. ❌ `DATABASE_URL` 환경 변수가 없음
3. ⚠️ 이전 커밋(`d3a9dfe`)을 빌드하고 있음

## 해결 방법

### 1단계: Vercel 프로젝트 설정에서 빌드 명령어 확인 및 수정

1. **Vercel 대시보드** → 프로젝트 → **Settings** → **General**

2. **Build & Development Settings** 섹션 확인:
   - **Build Command**: `prisma generate && next build`로 변경
   - **Install Command**: `npm install` (기본값)
   - **Output Directory**: `.next` (기본값)

3. **Override** 체크박스가 있다면 체크하여 커스텀 명령어 사용

4. **Save** 클릭

### 2단계: DATABASE_URL 환경 변수 설정 (필수!)

**반드시 먼저 설정해야 합니다!**

#### 방법 A: Vercel Postgres 사용 (권장)

1. Vercel 대시보드 → 프로젝트 → **Storage** 탭
2. **"Create Database"** 클릭
3. **"Postgres"** 선택
4. 데이터베이스 이름 입력
5. **"Create"** 클릭
   - ✅ **자동으로 `DATABASE_URL` 환경 변수가 설정됩니다!**

#### 방법 B: 수동으로 환경 변수 추가

1. Vercel → 프로젝트 → **Settings** → **Environment Variables**
2. **"Add New"** 클릭
3. 설정:
   - **Key**: `DATABASE_URL`
   - **Value**: PostgreSQL 연결 문자열
     - 예: `postgresql://user:password@host:5432/dbname?sslmode=require`
   - **Environment**: Production, Preview, Development 모두 선택
4. **"Save"** 클릭

### 3단계: 다른 환경 변수 설정

1. **NEXTAUTH_SECRET**
   ```bash
   openssl rand -base64 32
   ```
   - Key: `NEXTAUTH_SECRET`
   - Value: 생성한 문자열
   - Environment: Production, Preview, Development 모두 선택

2. **NEXTAUTH_URL**
   - Key: `NEXTAUTH_URL`
   - Value: `https://your-app.vercel.app` (배포 후 실제 URL)
   - Environment: Production만 선택

### 4단계: 최신 코드 확인 및 재배포

1. **GitHub에 최신 코드가 있는지 확인**
   ```bash
   git log --oneline -1
   ```
   최신 커밋이 `411cf3b Fix Vercel build command...`인지 확인

2. **Vercel에서 최신 커밋으로 재배포**
   - Deployments → **"Redeploy"** 클릭
   - 또는 GitHub에 푸시하면 자동 재배포

### 5단계: 빌드 로그 확인

재배포 후:
1. Deployments → 최신 배포 클릭
2. **Build Logs** 확인
3. 다음이 보여야 함:
   - ✅ `prisma generate` 실행
   - ✅ `next build` 실행
   - ❌ `prisma db push` 실행 안 됨

## 중요 체크리스트

배포 전 확인:
- [ ] Vercel 프로젝트 설정에서 Build Command가 `prisma generate && next build`인지 확인
- [ ] `DATABASE_URL` 환경 변수가 설정되었는지 확인
- [ ] `NEXTAUTH_SECRET` 환경 변수가 설정되었는지 확인
- [ ] `NEXTAUTH_URL` 환경 변수가 설정되었는지 확인
- [ ] 모든 환경 변수의 Environment가 올바르게 선택되었는지 확인

## 문제가 계속되면

1. **Vercel 프로젝트 삭제 후 재생성**
   - Settings → Delete Project
   - GitHub 저장소에서 다시 Import

2. **또는 Vercel CLI로 배포**
   ```bash
   npx vercel --prod
   ```

