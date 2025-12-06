import { NextRequest, NextResponse } from 'next/server'
import { registerTeacher } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
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

    // 이메일 중복 확인
    const existingTeacher = await prisma.teacher.findUnique({
      where: { email },
    })

    if (existingTeacher) {
      return NextResponse.json(
        { error: '이미 등록된 이메일입니다.' },
        { status: 400 }
      )
    }

    const teacher = await registerTeacher(name, email, password)

    return NextResponse.json({
      teacherId: teacher.id,
      name: teacher.name,
      email: teacher.email,
    })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { error: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

