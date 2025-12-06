# 🌱 성장열매 투두리스트

초등학생들을 위한 교육용 투두리스트 애플리케이션입니다.

## 주요 기능

### 1. 교사 기능
- 교사 회원가입 및 로그인
- 학생 등록 및 관리

### 2. 학생 기능
- 학생 로그인 (학생 코드 사용)
- 환경설정에서 기본 계획 등록
- 매일 자동으로 생성되는 일일 투두리스트
- 체크박스를 통한 계획 완료 체크
- 실시간 완료율 게이지 표시

### 3. 성장열매 시스템
- 모든 계획을 완료하면 랜덤 열매 획득
- 열매 보관함에서 열매 확인 및 사용
- 열매 타입: 사과, 바나나, 포도, 오렌지, 딸기, 수박

### 4. 월별 레포트
- 월별 완료율 통계
- 잘 실천한 계획 목록
- 개선이 필요한 계획 목록

## 기술 스택

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (Prisma ORM)
- **Authentication**: bcryptjs (비밀번호 해싱)

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. 데이터베이스 초기화

```bash
npx prisma generate
npx prisma db push
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 사용 방법

### 교사
1. 홈페이지에서 "교사 로그인" 클릭
2. 회원가입 또는 로그인
3. 대시보드에서 학생 추가
4. 학생에게 학생 코드와 비밀번호 전달

### 학생
1. 홈페이지에서 "학생 로그인" 클릭
2. 교사로부터 받은 학생 코드와 비밀번호로 로그인
3. 환경설정에서 기본 계획 등록
4. 매일 투두리스트에서 계획 체크
5. 모든 계획 완료 시 성장열매 획득
6. 월별 레포트에서 자신의 실천 현황 확인

## 프로젝트 구조

```
TodoTest/
├── app/
│   ├── api/              # API 라우트
│   │   ├── teacher/      # 교사 관련 API
│   │   └── student/      # 학생 관련 API
│   ├── teacher/          # 교사 페이지
│   ├── student/          # 학생 페이지
│   └── page.tsx          # 홈페이지
├── lib/                  # 유틸리티 함수
│   ├── auth.ts           # 인증 관련 함수
│   └── prisma.ts         # Prisma 클라이언트
├── prisma/
│   └── schema.prisma     # 데이터베이스 스키마
└── package.json
```

## 데이터베이스 스키마

- **Teacher**: 교사 정보
- **Student**: 학생 정보
- **Plan**: 학생의 기본 계획
- **Todo**: 일일 투두리스트
- **Fruit**: 학생이 보유한 열매
- **MonthlyReport**: 월별 레포트

## 배포

### Vercel 배포 (권장)

1. **GitHub에 코드 푸시**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Vercel에서 프로젝트 생성**
   - [Vercel](https://vercel.com)에 로그인
   - "New Project" 클릭
   - GitHub 저장소 선택
   - 자동으로 배포 시작

3. **데이터베이스 설정**
   - Vercel 대시보드 → Storage → Create Database → Postgres
   - 또는 [Supabase](https://supabase.com) 같은 무료 PostgreSQL 사용

4. **환경 변수 설정**
   Vercel 대시보드 → Settings → Environment Variables에 추가:
   - `DATABASE_URL`: PostgreSQL 연결 문자열
   - `NEXTAUTH_SECRET`: `openssl rand -base64 32`로 생성
   - `NEXTAUTH_URL`: 배포된 URL

5. **Prisma 스키마 변경**
   배포 전에 `prisma/schema.prisma`의 `datasource`를 PostgreSQL로 변경:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

6. **마이그레이션 실행**
   ```bash
   npx prisma migrate dev --name init
   ```

자세한 배포 가이드는 [DEPLOY.md](./DEPLOY.md)를 참고하세요.

## 라이선스

MIT

