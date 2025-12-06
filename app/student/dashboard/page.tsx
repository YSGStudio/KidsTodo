'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'

interface Todo {
  id: string
  title: string
  completed: boolean
  planId?: string
}

interface Plan {
  id: string
  title: string
  order: number
}

export default function StudentDashboard() {
  const router = useRouter()
  const [studentName, setStudentName] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)
  const [completionRate, setCompletionRate] = useState(0)
  const [today] = useState(new Date())

  useEffect(() => {
    const studentId = localStorage.getItem('studentId')
    const name = localStorage.getItem('studentName')

    if (!studentId) {
      router.push('/student/login')
      return
    }

    if (name) {
      setStudentName(name)
    }

    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      const studentId = localStorage.getItem('studentId')
      if (!studentId) return

      // 오늘 날짜의 투두리스트 가져오기
      const todayStr = format(today, 'yyyy-MM-dd')
      const todosRes = await fetch(
        `/api/student/todos?studentId=${studentId}&date=${todayStr}`
      )
      const todosData = await todosRes.json()

      // 기본 계획 가져오기
      const plansRes = await fetch(
        `/api/student/plans?studentId=${studentId}`
      )
      const plansData = await plansRes.json()

      if (todosRes.ok) {
        setTodos(todosData.todos || [])
        const completed = todosData.todos.filter((t: Todo) => t.completed).length
        const total = todosData.todos.length
        setCompletionRate(total > 0 ? (completed / total) * 100 : 0)
      }

      if (plansRes.ok) {
        setPlans(plansData.plans || [])
      }
    } catch (err) {
      console.error('Failed to fetch data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTodo = async (todoId: string, completed: boolean) => {
    try {
      const studentId = localStorage.getItem('studentId')
      const res = await fetch('/api/student/todos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          todoId,
          completed: !completed,
        }),
      })

      if (res.ok) {
        fetchData()
        // 모든 투두 완료 시 열매 지급 확인
        checkAllCompleted()
      }
    } catch (err) {
      console.error('Failed to toggle todo:', err)
    }
  }

  const checkAllCompleted = async () => {
    try {
      const studentId = localStorage.getItem('studentId')
      const todayStr = format(today, 'yyyy-MM-dd')
      const res = await fetch(
        `/api/student/todos?studentId=${studentId}&date=${todayStr}`
      )
      const data = await res.json()

      if (res.ok && data.todos.length > 0) {
        const allCompleted = data.todos.every((t: Todo) => t.completed)
        if (allCompleted) {
          // 오늘 이미 열매를 받았는지 확인
          const fruitRes = await fetch(
            `/api/student/fruits/check-today?studentId=${studentId}`
          )
          const fruitData = await fruitRes.json()

          if (fruitRes.ok && !fruitData.receivedToday) {
            // 랜덤 열매 지급
            const rewardRes = await fetch('/api/student/fruits/reward', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ studentId }),
            })

            if (rewardRes.ok) {
              alert('🎉 모든 계획을 완료했습니다! 성장열매를 받았어요!')
              fetchData()
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to check completion:', err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('studentId')
    localStorage.removeItem('studentName')
    router.push('/')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl">로딩 중...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="card mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-700">
                🌱 {studentName}님의 투두리스트
              </h1>
              <p className="text-gray-600 mt-1">
                {format(today, 'yyyy년 MM월 dd일 EEEE', { locale: ko })}
              </p>
            </div>
            <button onClick={handleLogout} className="btn-secondary">
              로그아웃
            </button>
          </div>
        </div>

        {/* 체크 게이지 */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">오늘의 완료율</h2>
          <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500 flex items-center justify-center"
              style={{ width: `${completionRate}%` }}
            >
              {completionRate > 0 && (
                <span className="text-white font-bold text-sm">
                  {Math.round(completionRate)}%
                </span>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {todos.filter((t) => t.completed).length} / {todos.length} 완료
          </p>
        </div>

        {/* 투두리스트 */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">오늘의 계획</h2>
            <Link href="/student/settings" className="text-primary-600 hover:underline text-sm">
              환경설정
            </Link>
          </div>

          {todos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>오늘 등록된 계획이 없습니다.</p>
              <Link
                href="/student/settings"
                className="text-primary-600 hover:underline mt-2 inline-block"
              >
                환경설정에서 기본 계획을 등록해주세요
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <label
                  key={todo.id}
                  className="flex items-center p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleTodo(todo.id, todo.completed)}
                    className="w-6 h-6 text-primary-600 rounded focus:ring-primary-500"
                  />
                  <span
                    className={`ml-3 text-lg ${
                      todo.completed
                        ? 'line-through text-gray-400'
                        : 'text-gray-800'
                    }`}
                  >
                    {todo.title}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 열매 보유 현황 */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">성장열매</h2>
            <Link href="/student/fruits" className="text-primary-600 hover:underline text-sm">
              열매 보관함
            </Link>
          </div>
          <p className="text-gray-600 mb-4">
            모든 계획을 완료하면 랜덤 열매를 받을 수 있어요! 🌟
          </p>
          <Link
            href="/student/reports"
            className="text-primary-600 hover:underline text-sm"
          >
            월별 레포트 보기 →
          </Link>
        </div>
      </div>
    </main>
  )
}

