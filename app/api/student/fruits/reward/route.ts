import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

// 랜덤 열매 타입들
const FRUIT_TYPES = ['apple', 'banana', 'grape', 'orange', 'strawberry', 'watermelon']

export async function POST(request: NextRequest) {
  try {
    const { studentId } = await request.json()

    if (!studentId) {
      return NextResponse.json(
        { error: '학생 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    // 오늘 이미 열매를 받았는지 확인
    const today = new Date()
    const startDate = startOfDay(today)
    const endDate = endOfDay(today)

    const todayFruit = await prisma.fruit.findFirst({
      where: {
        studentId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    if (todayFruit) {
      return NextResponse.json(
        { error: '오늘은 이미 열매를 받았습니다.' },
        { status: 400 }
      )
    }

    // 랜덤 열매 타입 선택
    const randomFruitType = FRUIT_TYPES[Math.floor(Math.random() * FRUIT_TYPES.length)]

    // 기존에 같은 타입의 열매가 있는지 확인
    const existingFruit = await prisma.fruit.findFirst({
      where: {
        studentId,
        type: randomFruitType,
      },
    })

    if (existingFruit) {
      // 기존 열매의 개수 증가
      const updatedFruit = await prisma.fruit.update({
        where: { id: existingFruit.id },
        data: {
          count: existingFruit.count + 1,
        },
      })
      return NextResponse.json({ fruit: updatedFruit, isNew: false })
    } else {
      // 새로운 열매 생성
      const newFruit = await prisma.fruit.create({
        data: {
          studentId,
          type: randomFruitType,
          count: 1,
        },
      })
      return NextResponse.json({ fruit: newFruit, isNew: true })
    }
  } catch (error) {
    console.error('Reward fruit error:', error)
    return NextResponse.json(
      { error: '열매 지급 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

