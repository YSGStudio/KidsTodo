import { NextRequest, NextResponse } from 'next/server'
import { loginStudent } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { studentCode, password } = await request.json()

    if (!studentCode || !password) {
      return NextResponse.json(
        { error: '학생 코드와 비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }

    const student = await loginStudent(studentCode, password)

    if (!student) {
      return NextResponse.json(
        { error: '학생 코드 또는 비밀번호가 올바르지 않습니다.' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      studentId: student.id,
      name: student.name,
      studentCode: student.studentCode,
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: '로그인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

