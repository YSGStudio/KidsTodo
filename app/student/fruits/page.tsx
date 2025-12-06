'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Fruit {
  id: string
  type: string
  count: number
  createdAt: string
}

const FRUIT_EMOJIS: Record<string, string> = {
  apple: '🍎',
  banana: '🍌',
  grape: '🍇',
  orange: '🍊',
  strawberry: '🍓',
  watermelon: '🍉',
}

const FRUIT_NAMES: Record<string, string> = {
  apple: '사과',
  banana: '바나나',
  grape: '포도',
  orange: '오렌지',
  strawberry: '딸기',
  watermelon: '수박',
}

export default function FruitsPage() {
  const router = useRouter()
  const [fruits, setFruits] = useState<Fruit[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const studentId = localStorage.getItem('studentId')

    if (!studentId) {
      router.push('/student/login')
      return
    }

    fetchFruits()
  }, [router])

  const fetchFruits = async () => {
    try {
      const studentId = localStorage.getItem('studentId')
      if (!studentId) return

      const res = await fetch(`/api/student/fruits?studentId=${studentId}`)
      const data = await res.json()

      if (res.ok) {
        setFruits(data.fruits || [])
      }
    } catch (err) {
      console.error('Failed to fetch fruits:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUseFruit = async (fruitId: string, currentCount: number) => {
    const useCount = prompt(`사용할 개수를 입력하세요. (현재: ${currentCount}개)`)
    
    if (!useCount) return

    const count = parseInt(useCount)
    if (isNaN(count) || count <= 0 || count > currentCount) {
      alert('올바른 개수를 입력해주세요.')
      return
    }

    try {
      const studentId = localStorage.getItem('studentId')
      if (!studentId) return

      const res = await fetch('/api/student/fruits', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          fruitId,
          count,
        }),
      })

      if (res.ok) {
        alert(`${count}개의 열매를 사용했습니다!`)
        fetchFruits()
      } else {
        const data = await res.json()
        alert(data.error || '열매 사용에 실패했습니다.')
      }
    } catch (err) {
      alert('열매 사용 중 오류가 발생했습니다.')
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
      <div className="max-w-4xl mx-auto">
        <div className="card mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary-700">
              🌟 성장열매 보관함
            </h1>
            <Link href="/student/dashboard" className="btn-secondary">
              ← 대시보드로
            </Link>
          </div>
        </div>

        {fruits.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-xl text-gray-600 mb-2">
              아직 모은 열매가 없어요
            </p>
            <p className="text-gray-500">
              매일 계획을 완료하면 열매를 받을 수 있어요!
            </p>
            <Link
              href="/student/dashboard"
              className="btn-primary mt-6 inline-block"
            >
              투두리스트로 가기
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fruits.map((fruit) => (
              <div
                key={fruit.id}
                className="card bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-orange-200"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {FRUIT_EMOJIS[fruit.type] || '🍎'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {FRUIT_NAMES[fruit.type] || fruit.type}
                  </h3>
                  <p className="text-xl text-primary-600 font-bold mb-4">
                    {fruit.count}개
                  </p>
                  <button
                    onClick={() => handleUseFruit(fruit.id, fruit.count)}
                    className="btn-primary w-full"
                  >
                    사용하기
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

