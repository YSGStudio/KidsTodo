'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Plan {
  id: string
  title: string
  order: number
}

export default function StudentSettings() {
  const router = useRouter()
  const [plans, setPlans] = useState<Plan[]>([])
  const [newPlanTitle, setNewPlanTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const studentId = localStorage.getItem('studentId')

    if (!studentId) {
      router.push('/student/login')
      return
    }

    fetchPlans()
  }, [router])

  const fetchPlans = async () => {
    try {
      const studentId = localStorage.getItem('studentId')
      if (!studentId) return

      const res = await fetch(`/api/student/plans?studentId=${studentId}`)
      const data = await res.json()

      if (res.ok) {
        setPlans(data.plans || [])
      }
    } catch (err) {
      console.error('Failed to fetch plans:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!newPlanTitle.trim()) {
      setError('계획 제목을 입력해주세요.')
      return
    }

    try {
      const studentId = localStorage.getItem('studentId')
      if (!studentId) return

      const res = await fetch('/api/student/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          title: newPlanTitle.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setNewPlanTitle('')
        fetchPlans()
      } else {
        setError(data.error || '계획 추가에 실패했습니다.')
      }
    } catch (err) {
      setError('계획 추가 중 오류가 발생했습니다.')
    }
  }

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('이 계획을 삭제하시겠습니까?')) {
      return
    }

    try {
      const studentId = localStorage.getItem('studentId')
      if (!studentId) return

      const res = await fetch('/api/student/plans', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          planId,
        }),
      })

      if (res.ok) {
        fetchPlans()
      }
    } catch (err) {
      console.error('Failed to delete plan:', err)
    }
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
      <div className="max-w-2xl mx-auto">
        <div className="card mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary-700">
              환경설정
            </h1>
            <Link href="/student/dashboard" className="btn-secondary">
              ← 대시보드로
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            기본 계획 등록
          </h2>
          <p className="text-gray-600 mb-6">
            매일 반복할 기본 계획을 등록해주세요. 등록한 계획은 매일 자동으로
            투두리스트에 추가됩니다.
          </p>

          <form onSubmit={handleAddPlan} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newPlanTitle}
                onChange={(e) => setNewPlanTitle(e.target.value)}
                placeholder="예: 아침 운동하기, 숙제하기, 책 읽기..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button type="submit" className="btn-primary">
                추가
              </button>
            </div>
            {error && (
              <div className="mt-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}
          </form>

          <div className="space-y-3">
            {plans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                등록된 기본 계획이 없습니다.
              </div>
            ) : (
              plans
                .sort((a, b) => a.order - b.order)
                .map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <span className="text-lg text-gray-800">{plan.title}</span>
                    <button
                      onClick={() => handleDeletePlan(plan.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

