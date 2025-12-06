// 데이터베이스 확인 스크립트
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('📊 데이터베이스 상태 확인 중...\n')
    
    // 교사 수 확인
    const teacherCount = await prisma.teacher.count()
    console.log(`👨‍🏫 교사 수: ${teacherCount}`)
    
    // 학생 수 확인
    const studentCount = await prisma.student.count()
    console.log(`👨‍🎓 학생 수: ${studentCount}`)
    
    // 계획 수 확인
    const planCount = await prisma.plan.count()
    console.log(`📝 기본 계획 수: ${planCount}`)
    
    // 투두 수 확인
    const todoCount = await prisma.todo.count()
    console.log(`✅ 투두리스트 수: ${todoCount}`)
    
    // 열매 수 확인
    const fruitCount = await prisma.fruit.count()
    console.log(`🍎 열매 수: ${fruitCount}`)
    
    // 레포트 수 확인
    const reportCount = await prisma.monthlyReport.count()
    console.log(`📊 레포트 수: ${reportCount}`)
    
    // 상세 정보
    if (teacherCount > 0) {
      console.log('\n📋 교사 목록:')
      const teachers = await prisma.teacher.findMany({
        select: { id: true, name: true, email: true, createdAt: true }
      })
      teachers.forEach(t => {
        console.log(`  - ${t.name} (${t.email}) - 생성일: ${t.createdAt.toLocaleString('ko-KR')}`)
      })
    }
    
    if (studentCount > 0) {
      console.log('\n📋 학생 목록:')
      const students = await prisma.student.findMany({
        select: { id: true, name: true, studentCode: true, createdAt: true }
      })
      students.forEach(s => {
        console.log(`  - ${s.name} (코드: ${s.studentCode}) - 생성일: ${s.createdAt.toLocaleString('ko-KR')}`)
      })
    }
    
    console.log('\n✅ 데이터베이스 연결 및 조회 성공!')
    console.log('💾 데이터는 SQLite 데이터베이스에 저장되고 있습니다.')
    
  } catch (error) {
    console.error('❌ 오류 발생:', error.message)
    if (error.message.includes('DATABASE_URL')) {
      console.error('⚠️  DATABASE_URL 환경 변수가 설정되지 않았습니다.')
      console.error('   .env 파일에 DATABASE_URL="file:./dev.db"를 추가해주세요.')
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()

