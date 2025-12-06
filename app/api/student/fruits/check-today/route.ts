import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, endOfDay } from 'date-fns'

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

    return NextResponse.json({ receivedToday: !!todayFruit })
  } catch (error) {
    console.error('Check today fruit error:', error)
    return NextResponse.json(
      { error: '확인 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

