import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, format } from 'date-fns'

// 월별 레포트 조회 및 생성
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId')
    const year = searchParams.get('year')
    const month = searchParams.get('month')

    if (!studentId) {
      return NextResponse.json(
        { error: '학생 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const currentDate = new Date()
    const reportYear = year ? parseInt(year) : currentDate.getFullYear()
    const reportMonth = month ? parseInt(month) : currentDate.getMonth() + 1

    // 해당 월의 레포트 조회
    let report = await prisma.monthlyReport.findUnique({
      where: {
        studentId_year_month: {
          studentId,
          year: reportYear,
          month: reportMonth,
        },
      },
    })

    // 레포트가 없으면 생성
    if (!report) {
      const monthStart = new Date(reportYear, reportMonth - 1, 1)
      const monthEnd = endOfMonth(monthStart)

      // 해당 월의 모든 투두리스트 조회
      const todos = await prisma.todo.findMany({
        where: {
          studentId,
          date: {
            gte: monthStart,
            lte: monthEnd,
          },
        },
      })

      const totalTodos = todos.length
      const completedTodos = todos.filter((t) => t.completed).length
      const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0

      // 잘 실천한 것과 개선이 필요한 것 분석
      const planStats = new Map<string, { total: number; completed: number }>()

      todos.forEach((todo) => {
        if (todo.planId) {
          const stats = planStats.get(todo.planId) || { total: 0, completed: 0 }
          stats.total++
          if (todo.completed) stats.completed++
          planStats.set(todo.planId, stats)
        }
      })

      const wellDone: string[] = []
      const needsImprovement: string[] = []

      // 각 계획의 완료율 계산
      for (const [planId, stats] of planStats.entries()) {
        const rate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0
        const plan = await prisma.plan.findUnique({
          where: { id: planId },
        })

        if (plan) {
          if (rate >= 80) {
            wellDone.push(plan.title)
          } else if (rate < 50) {
            needsImprovement.push(plan.title)
          }
        }
      }

      // 레포트 생성
      report = await prisma.monthlyReport.create({
        data: {
          studentId,
          year: reportYear,
          month: reportMonth,
          totalTodos,
          completedTodos,
          completionRate,
          wellDone: JSON.stringify(wellDone),
          needsImprovement: JSON.stringify(needsImprovement),
        },
      })
    }

    // 날짜별 통계 계산 (레포트가 이미 있는 경우에도)
    const monthStart = new Date(reportYear, reportMonth - 1, 1)
    const monthEnd = endOfMonth(monthStart)
    
    const todos = await prisma.todo.findMany({
      where: {
        studentId,
        date: {
          gte: monthStart,
          lte: monthEnd,
        },
      },
    })

    // 날짜별 통계 계산
    const dailyStats: Record<string, { total: number; completed: number }> = {}
    
    todos.forEach((todo) => {
      const dateKey = format(new Date(todo.date), 'yyyy-MM-dd')
      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = { total: 0, completed: 0 }
      }
      dailyStats[dateKey].total++
      if (todo.completed) {
        dailyStats[dateKey].completed++
      }
    })

    // JSON 문자열을 배열로 변환하여 반환
    const reportResponse = {
      ...report,
      wellDone: JSON.parse(report.wellDone || '[]'),
      needsImprovement: JSON.parse(report.needsImprovement || '[]'),
      dailyStats, // 날짜별 통계 추가
    }

    return NextResponse.json({ report: reportResponse })
  } catch (error) {
    console.error('Get report error:', error)
    return NextResponse.json(
      { error: '레포트를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

