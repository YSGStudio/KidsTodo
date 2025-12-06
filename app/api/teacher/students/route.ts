import { NextRequest, NextResponse } from 'next/server'
import { registerStudent } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 학생 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const teacherId = searchParams.get('teacherId')

    if (!teacherId) {
      return NextResponse.json(
        { error: '교사 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const students = await prisma.student.findMany({
      where: { teacherId },
      select: {
        id: true,
        name: true,
        studentCode: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ students })
  } catch (error) {
    console.error('Get students error:', error)
    return NextResponse.json(
      { error: '학생 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 학생 등록
export async function POST(request: NextRequest) {
  try {
    const { teacherId, name, studentCode, password } = await request.json()

    if (!teacherId || !name || !studentCode || !password) {
      return NextResponse.json(
        { error: '모든 필드를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: '비밀번호는 최소 6자 이상이어야 합니다.' },
        { status: 400 }
      )
    }

    // 학생 코드 중복 확인
    const existingStudent = await prisma.student.findUnique({
      where: { studentCode },
    })

    if (existingStudent) {
      return NextResponse.json(
        { error: '이미 사용 중인 학생 코드입니다.' },
        { status: 400 }
      )
    }

    const student = await registerStudent(teacherId, name, studentCode, password)

    return NextResponse.json({
      id: student.id,
      name: student.name,
      studentCode: student.studentCode,
    })
  } catch (error) {
    console.error('Register student error:', error)
    return NextResponse.json(
      { error: '학생 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

