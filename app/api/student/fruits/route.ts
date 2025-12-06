import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// 학생의 열매 목록 조회
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

    const fruits = await prisma.fruit.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ fruits })
  } catch (error) {
    console.error('Get fruits error:', error)
    return NextResponse.json(
      { error: '열매 목록을 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 열매 사용 (개수 감소)
export async function PATCH(request: NextRequest) {
  try {
    const { studentId, fruitId, count } = await request.json()

    if (!studentId || !fruitId || typeof count !== 'number') {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const fruit = await prisma.fruit.findUnique({
      where: { id: fruitId },
    })

    if (!fruit || fruit.studentId !== studentId) {
      return NextResponse.json(
        { error: '열매를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    if (fruit.count < count) {
      return NextResponse.json(
        { error: '보유한 열매 개수가 부족합니다.' },
        { status: 400 }
      )
    }

    const newCount = fruit.count - count

    if (newCount <= 0) {
      // 개수가 0 이하면 삭제
      await prisma.fruit.delete({
        where: { id: fruitId },
      })
      return NextResponse.json({ success: true, deleted: true })
    } else {
      // 개수 감소
      const updatedFruit = await prisma.fruit.update({
        where: { id: fruitId },
        data: { count: newCount },
      })
      return NextResponse.json({ fruit: updatedFruit })
    }
  } catch (error) {
    console.error('Use fruit error:', error)
    return NextResponse.json(
      { error: '열매 사용 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

