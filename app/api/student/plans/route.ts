import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 기본 계획 목록 조회
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId')

    if (!studentId) {
      return NextResponse.json(
        { error: '학생 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const plans = await prisma.plan.findMany({
      where: { studentId },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ plans })
  } catch (error) {
    console.error('Get plans error:', error)
    return NextResponse.json(
      { error: '계획 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 기본 계획 추가
export async function POST(request: NextRequest) {
  try {
    const { studentId, title } = await request.json()

    if (!studentId || !title) {
      return NextResponse.json(
        { error: '학생 ID와 계획 제목을 입력해주세요.' },
        { status: 400 }
      )
    }

    // 현재 계획 개수 확인하여 order 설정
    const planCount = await prisma.plan.count({
      where: { studentId },
    })

    const plan = await prisma.plan.create({
      data: {
        studentId,
        title: title.trim(),
        order: planCount,
      },
    })

    return NextResponse.json({ plan })
  } catch (error) {
    console.error('Create plan error:', error)
    return NextResponse.json(
      { error: '계획 추가 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 기본 계획 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { studentId, planId } = await request.json()

    if (!studentId || !planId) {
      return NextResponse.json(
        { error: '학생 ID와 계획 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    await prisma.plan.delete({
      where: {
        id: planId,
        studentId, // 보안: 해당 학생의 계획만 삭제 가능
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete plan error:', error)
    return NextResponse.json(
      { error: '계획 삭제 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

