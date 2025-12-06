#!/bin/bash

# 배포 준비 스크립트

echo "🚀 배포 준비를 시작합니다..."

# 1. Git 저장소 확인
if [ ! -d ".git" ]; then
    echo "📦 Git 저장소를 초기화합니다..."
    git init
    echo "✅ Git 저장소 초기화 완료"
else
    echo "✅ Git 저장소가 이미 존재합니다"
fi

# 2. .env.example 파일 생성
if [ ! -f ".env.example" ]; then
    echo "📝 .env.example 파일을 생성합니다..."
    cat > .env.example << EOF
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
EOF
    echo "✅ .env.example 파일 생성 완료"
fi

# 3. PostgreSQL 스키마 확인
if [ ! -f "prisma/schema.prisma" ] || grep -q "provider = \"sqlite\"" prisma/schema.prisma; then
    echo "⚠️  PostgreSQL 스키마로 변경이 필요합니다."
    echo "   prisma/schema.postgresql.prisma 파일을 참고하여 수정하세요."
fi

echo ""
echo "✅ 배포 준비 완료!"
echo ""
echo "다음 단계:"
echo "1. GitHub에 저장소 생성 및 코드 푸시"
echo "2. Vercel에서 프로젝트 생성"
echo "3. PostgreSQL 데이터베이스 설정"
echo "4. 환경 변수 설정"
echo ""
echo "자세한 내용은 DEPLOY.md를 참고하세요."

