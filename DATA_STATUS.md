# 데이터 상태 설명

## 현재 상황

### 1. 로컬 데이터 (SQLite) - **아직 존재함**

- 위치: `prisma/dev.db` (64KB)
- 상태: 데이터가 저장되어 있음
- 문제: Prisma 스키마가 PostgreSQL로 변경되어 현재 접근 불가

### 2. Vercel 배포 환경 (PostgreSQL) - **초기화됨**

- 새로운 PostgreSQL 데이터베이스
- 완전히 빈 상태 (데이터 없음)
- 처음부터 시작해야 함

## 데이터 복구 방법

### 옵션 1: 로컬 데이터 확인 (SQLite)

임시로 SQLite 스키마로 변경하여 데이터 확인:

```bash
# 1. schema.prisma를 SQLite로 임시 변경
# datasource db { provider = "sqlite" }

# 2. Prisma 클라이언트 재생성
npx prisma generate

# 3. 데이터 확인
node scripts/check-db.js
```

### 옵션 2: 로컬 데이터를 Vercel로 마이그레이션

1. 로컬에서 데이터 추출
2. Vercel PostgreSQL에 데이터 삽입

### 옵션 3: 처음부터 시작 (권장)

- Vercel 배포 환경은 새로운 시작
- 교사 계정 다시 생성
- 학생 다시 등록

## 권장 사항

배포 환경은 새로운 데이터베이스이므로:
1. **처음부터 시작하는 것을 권장**
2. 로컬 데이터는 개발/테스트용으로 유지
3. 프로덕션(Vercel)은 새로운 데이터로 시작

