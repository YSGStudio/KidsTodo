# Vercel 환경 변수 최종 설정

## ✅ 데이터베이스 마이그레이션 완료!

데이터베이스 테이블이 성공적으로 생성되었습니다.

## 다음 단계: Vercel 환경 변수 설정

### 1단계: DATABASE_URL 설정

1. **Vercel 대시보드** → 프로젝트 → **Settings** → **Environment Variables**

2. **"Add New"** 클릭

3. 다음 정보 입력:
   - **Key**: `DATABASE_URL`
   - **Value**: 
     ```
     postgres://1a7e05a253136bfbcfa571eb34f40acc0e14d2790aa96f5f14a66b4e009b3c45:sk_frB_nd8tVMjbNHrDiYbET@db.prisma.io:5432/postgres?sslmode=require
     ```
   - **Environment**: 
     - ✅ Production
     - ✅ Preview
     - ✅ Development
     - (모두 선택)

4. **"Save"** 클릭

### 2단계: NEXTAUTH_SECRET 설정

1. **랜덤 문자열 생성**
   ```bash
   openssl rand -base64 32
   ```
   또는 온라인 생성기 사용

2. **Vercel에 추가**
   - Key: `NEXTAUTH_SECRET`
   - Value: 생성한 랜덤 문자열
   - Environment: Production, Preview, Development 모두 선택

### 3단계: NEXTAUTH_URL 설정

1. **Vercel에 추가**
   - Key: `NEXTAUTH_URL`
   - Value: 배포된 URL (예: `https://your-app.vercel.app`)
   - Environment: Production만 선택

### 4단계: 재배포

1. **Deployments** 탭으로 이동
2. 최신 배포 → **"Redeploy"** 클릭
3. 또는 GitHub에 코드를 푸시하면 자동 재배포

## 확인 사항

환경 변수 설정 후:
- [ ] DATABASE_URL 설정됨
- [ ] NEXTAUTH_SECRET 설정됨
- [ ] NEXTAUTH_URL 설정됨
- [ ] 재배포 완료

## 테스트

재배포 후:
1. 배포된 URL 접속
2. 교사 회원가입 테스트
3. 교사 로그인 테스트
4. 학생 등록 테스트

이제 로그인/회원가입이 정상 작동해야 합니다! 🎉

