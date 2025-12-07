import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// 특정 학생 정보 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const teacherId = searchParams.get('teacherId')
    const studentId = params.studentId

    if (!teacherId || !studentId) {
      return NextResponse.json(
        { error: '교사 ID와 학생 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 해당 교사의 학생인지 확인
    const student = await prisma.student.findFirst({
      where: {
        id: studentId,
        teacherId,
      },
      select: {
        id: true,
        name: true,
        studentCode: true,
        createdAt: true,
      },
    })

    if (!student) {
      return NextResponse.json(
        { error: '학생을 찾을 수 없거나 권한이 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({ student })
  } catch (error) {
    console.error('Get student error:', error)
    return NextResponse.json(
      { error: '학생 정보를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

