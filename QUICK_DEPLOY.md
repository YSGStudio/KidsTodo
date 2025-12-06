# 빠른 배포 가이드

## 현재 상태
✅ Git 저장소 초기화 완료
✅ 코드 커밋 완료
✅ Prisma 스키마를 PostgreSQL로 변경 완료

## 다음 단계

### 방법 1: GitHub + Vercel 웹 인터페이스 (가장 쉬움)

1. **GitHub에 저장소 생성**
   - https://github.com/new 접속
   - 저장소 이름 입력 (예: `todo-app`)
   - "Create repository" 클릭

2. **코드 푸시**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git branch -M main
   git push -u origin main
   ```

3. **Vercel에서 배포**
   - https://vercel.com 접속 및 로그인
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 선택
   - 프로젝트 설정:
     - Framework Preset: Next.js (자동 감지)
     - Root Directory: `./`
   - "Deploy" 클릭

4. **데이터베이스 설정**
   - Vercel 대시보드 → 프로젝트 → Storage 탭
   - "Create Database" → "Postgres" 선택
   - 데이터베이스 생성 (자동으로 `DATABASE_URL` 설정됨)

5. **환경 변수 설정**
   - Settings → Environment Variables
   - `NEXTAUTH_SECRET` 추가:
     ```bash
     openssl rand -base64 32
     ```
   - `NEXTAUTH_URL` 추가: 배포된 URL (예: `https://your-app.vercel.app`)

6. **재배포**
   - Deployments → 최신 배포 → "Redeploy" 클릭

### 방법 2: Vercel CLI (현재 진행 중)

1. **로그인 완료**
   - 브라우저에서 https://vercel.com/oauth/device?user_code=WRGT-BDCS 접속
   - 인증 완료

2. **배포 실행**
   ```bash
   npx vercel --prod
   ```

3. **데이터베이스 및 환경 변수 설정** (위와 동일)

## 중요 사항

⚠️ **데이터베이스 마이그레이션**
배포 후 데이터베이스 테이블을 생성해야 합니다:

```bash
# 로컬에서 실행 (DATABASE_URL 환경 변수 필요)
DATABASE_URL="your-postgres-url" npx prisma migrate deploy
```

또는 Vercel의 함수에서 실행:
- Vercel 대시보드 → Functions → 새 함수 생성
- 또는 배포 후 자동으로 실행되도록 설정

## 문제 해결

- **빌드 오류**: Vercel 대시보드의 로그 확인
- **데이터베이스 연결 오류**: `DATABASE_URL` 형식 확인
- **Prisma 오류**: `postinstall` 스크립트가 `package.json`에 있는지 확인

