import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { format, startOfDay, endOfDay } from 'date-fns'

// 일일 투두리스트 조회 및 생성
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get('studentId')
    const dateStr = searchParams.get('date')

    if (!studentId) {
      return NextResponse.json(
        { error: '학생 ID가 필요합니다.' },
        { status: 400 }
      )
    }

    const date = dateStr ? new Date(dateStr) : new Date()
    const startDate = startOfDay(date)
    const endDate = endOfDay(date)

    // 해당 날짜의 투두리스트 조회
    let todos = await prisma.todo.findMany({
      where: {
        studentId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    // 투두리스트가 없으면 기본 계획으로 생성
    if (todos.length === 0) {
      const plans = await prisma.plan.findMany({
        where: { studentId },
        orderBy: { order: 'asc' },
      })

      if (plans.length > 0) {
        todos = await Promise.all(
          plans.map((plan) =>
            prisma.todo.create({
              data: {
                studentId,
                planId: plan.id,
                title: plan.title,
                date: startDate,
              },
            })
          )
        )
      }
    }

    return NextResponse.json({ todos })
  } catch (error) {
    console.error('Get todos error:', error)
    return NextResponse.json(
      { error: '투두리스트를 불러오는 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

// 투두 완료 상태 변경
export async function PATCH(request: NextRequest) {
  try {
    const { studentId, todoId, completed } = await request.json()

    if (!studentId || !todoId || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      )
    }

    const todo = await prisma.todo.update({
      where: {
        id: todoId,
        studentId, // 보안: 해당 학생의 투두만 수정 가능
      },
      data: {
        completed,
      },
    })

    return NextResponse.json({ todo })
  } catch (error) {
    console.error('Update todo error:', error)
    return NextResponse.json(
      { error: '투두 업데이트 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}

