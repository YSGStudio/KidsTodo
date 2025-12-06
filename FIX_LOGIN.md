# 로그인/회원가입 문제 해결

## 문제 원인

**데이터베이스 마이그레이션이 실행되지 않아서 테이블이 없습니다.**

Vercel에 배포했지만 데이터베이스 테이블을 생성하는 마이그레이션을 실행하지 않았기 때문에, Prisma가 테이블을 찾을 수 없어 오류가 발생합니다.

## 해결 방법

### 방법 1: Prisma Migrate 사용 (권장)

#### 1단계: 로컬에서 마이그레이션 파일 생성

```bash
cd /Users/yangseung-geun/TodoTest

# DATABASE_URL을 Vercel PostgreSQL로 설정
export DATABASE_URL="your-vercel-postgres-url"

# 마이그레이션 생성
npx prisma migrate dev --name init
```

#### 2단계: Vercel에 마이그레이션 적용

```bash
# 마이그레이션 적용 (프로덕션)
npx prisma migrate deploy
```

### 방법 2: Prisma DB Push 사용 (빠른 해결)

```bash
# DATABASE_URL 설정
export DATABASE_URL="your-vercel-postgres-url"

# 스키마를 데이터베이스에 직접 푸시
npx prisma db push
```

⚠️ **주의**: `db push`는 마이그레이션 히스토리를 관리하지 않습니다. 개발 환경에서는 괜찮지만 프로덕션에서는 `migrate deploy`를 권장합니다.

### 방법 3: Vercel에서 직접 실행

1. **Vercel 대시보드** → 프로젝트 → **Functions**
2. 새 함수 생성 또는 기존 함수 수정
3. 다음 코드 실행:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  try {
    // 마이그레이션 실행
    await prisma.$executeRawUnsafe(`
      -- 여기에 migration.sql 내용 붙여넣기
    `)
    res.status(200).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  } finally {
    await prisma.$disconnect()
  }
}
```

### 방법 4: Vercel CLI 사용

```bash
# Vercel CLI 설치 (없는 경우)
npm i -g vercel

# 로그인
vercel login

# 환경 변수 가져오기
vercel env pull .env.local

# DATABASE_URL 확인
cat .env.local | grep DATABASE_URL

# 마이그레이션 실행
DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d '=' -f2) npx prisma migrate deploy
```

## 빠른 해결 (가장 간단)

1. **Vercel에서 DATABASE_URL 복사**
   - Vercel → 프로젝트 → Settings → Environment Variables
   - `DATABASE_URL` 값 복사

2. **로컬에서 실행**
   ```bash
   cd /Users/yangseung-geun/TodoTest
   DATABASE_URL="복사한-URL" npx prisma db push
   ```

3. **재배포 또는 테스트**
   - Vercel에서 자동 재배포되거나
   - 브라우저에서 다시 시도

## 확인 방법

마이그레이션이 성공했는지 확인:

```bash
DATABASE_URL="your-url" npx prisma studio
```

또는 Vercel 대시보드에서:
- Storage → Postgres → Tables 탭
- 다음 테이블들이 있는지 확인:
  - Teacher
  - Student
  - Plan
  - Todo
  - Fruit
  - MonthlyReport

## 문제가 계속되면

1. **브라우저 개발자 도구 확인**
   - F12 → Console 탭
   - Network 탭에서 API 요청 확인
   - 오류 메시지 확인

2. **Vercel 로그 확인**
   - Functions → 로그 확인
   - 오류 메시지 확인

3. **환경 변수 확인**
   - `DATABASE_URL`이 올바르게 설정되었는지
   - 연결 문자열 형식이 올바른지

