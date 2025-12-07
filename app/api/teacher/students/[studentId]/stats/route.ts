import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format, startOfDay, endOfDay } from 'date-fns'

export const dynamic = 'force-dynamic'

// 학생의 일별 통계 조회
export async function GET(
  request: NextRequest,
  { params }: { params: { studentId: string } }
) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDateStr = searchParams.get('startDate')
    const endDateStr = searchParams.get('endDate')
    const studentId = params.studentId

    if (!startDateStr || !endDateStr) {
      return NextResponse.json(
        { error: '시작 날짜와 종료 날짜가 필요합니다.' },
        { status: 400 }
      )
    }

    const startDate = startOfDay(new Date(startDateStr))
    const endDate = endOfDay(new Date(endDateStr))

    // 해당 기간의 모든 투두리스트 조회
    const todos = await prisma.todo.findMany({
      where: {
        studentId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    })

    // 날짜별 통계 계산
    const dailyStatsMap = new Map<string, { total: number; completed: number }>()

    todos.forEach((todo) => {
      const dateKey = format(new Date(todo.date), 'yyyy-MM-dd')
      const stats = dailyStatsMap.get(dateKey) || { total: 0, completed: 0 }
      stats.total++
      if (todo.completed) {
        stats.completed++
      }
      dailyStatsMap.set(dateKey, stats)
    })

    // 모든 날짜에 대해 통계 생성 (데이터가 없는 날도 포함)
    const dailyStats: Array<{
      date: string
      total: number
      completed: number
      completionRate: number
    }> = []

    const currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      const dateKey = format(currentDate, 'yyyy-MM-dd')
      const stats = dailyStatsMap.get(dateKey) || { total: 0, completed: 0 }
      const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0

      dailyStats.push({
        date: dateKey,
        total: stats.total,
        completed: stats.completed,
        completionRate,
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return NextResponse.json({ dailyStats })
  } catch (error) {
    console.error('Get student stats error:', error)
    return NextResponse.json(
      { error: '통계를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

