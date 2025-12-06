'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface MonthlyReport {
  id: string
  year: number
  month: number
  totalTodos: number
  completedTodos: number
  completionRate: number
  wellDone: string[]
  needsImprovement: string[]
  dailyStats?: Record<string, { total: number; completed: number }>
}

export default function ReportsPage() {
  const router = useRouter()
  const [report, setReport] = useState<MonthlyReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)

  useEffect(() => {
    const studentId = localStorage.getItem('studentId')

    if (!studentId) {
      router.push('/student/login')
      return
    }

    fetchReport()
  }, [router, selectedYear, selectedMonth])

  const fetchReport = async () => {
    try {
      const studentId = localStorage.getItem('studentId')
      if (!studentId) return

      setLoading(true)
      const res = await fetch(
        `/api/student/reports?studentId=${studentId}&year=${selectedYear}&month=${selectedMonth}`
      )
      const data = await res.json()

      if (res.ok) {
        setReport(data.report)
      }
    } catch (err) {
      console.error('Failed to fetch report:', err)
    } finally {
      setLoading(false)
    }
  }

  const getMonthName = (month: number) => {
    const months = [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ]
    return months[month - 1]
  }

  // 날짜별 통계를 날짜 순으로 정렬
  const getSortedDailyStats = () => {
    if (!report?.dailyStats) return []
    
    return Object.entries(report.dailyStats)
      .map(([date, stats]) => ({
        date,
        ...stats,
        completionRate: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
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
              📊 월별 레포트
            </h1>
            <Link href="/student/dashboard" className="btn-secondary">
              ← 대시보드로
            </Link>
          </div>
        </div>

        {/* 날짜 선택 */}
        <div className="card mb-6">
          <div className="flex gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">연도:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                )
              )}
            </select>

            <label className="text-sm font-medium text-gray-700 ml-4">월:</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                <option key={month} value={month}>
                  {month}월
                </option>
              ))}
            </select>
          </div>
        </div>

        {report ? (
          <div className="space-y-6">
            {/* 전체 통계 */}
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedYear}년 {getMonthName(selectedMonth)} 통계
              </h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {report.totalTodos}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">총 계획</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    {report.completedTodos}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">완료한 계획</div>
                </div>
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="text-3xl font-bold text-primary-600">
                    {Math.round(report.completionRate)}%
                  </div>
                  <div className="text-sm text-gray-600 mt-1">완료율</div>
                </div>
              </div>

              {/* 완료율 게이지 */}
              <div className="mt-6">
                <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                    style={{ width: `${report.completionRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 날짜별 통계 */}
            {report.dailyStats && Object.keys(report.dailyStats).length > 0 && (
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  📅 날짜별 달성 현황
                </h2>
                <div className="space-y-3">
                  {getSortedDailyStats().map(({ date, total, completed, completionRate }) => {
                    const dateObj = new Date(date)
                    const dayName = dateObj.toLocaleDateString('ko-KR', { weekday: 'short' })
                    const day = dateObj.getDate()
                    
                    return (
                      <div
                        key={date}
                        className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-800">
                              {dateObj.getMonth() + 1}월 {day}일 ({dayName})
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm text-gray-600">
                              {completed} / {total} 완료
                            </span>
                            <span className="ml-2 text-sm font-bold text-primary-600">
                              {Math.round(completionRate)}%
                            </span>
                          </div>
                        </div>
                        <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* 잘 실천한 것 */}
            {report.wellDone.length > 0 && (
              <div className="card bg-green-50 border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-3">
                  🌟 잘 실천한 것들
                </h3>
                <ul className="space-y-2">
                  {report.wellDone.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-800"
                    >
                      <span className="text-green-600 mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 개선이 필요한 것 */}
            {report.needsImprovement.length > 0 && (
              <div className="card bg-orange-50 border-2 border-orange-200">
                <h3 className="text-xl font-bold text-orange-800 mb-3">
                  💪 더 노력하면 좋을 것들
                </h3>
                <ul className="space-y-2">
                  {report.needsImprovement.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-800"
                    >
                      <span className="text-orange-600 mr-2">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 둘 다 없을 때 */}
            {report.wellDone.length === 0 &&
              report.needsImprovement.length === 0 && (
                <div className="card text-center py-8 text-gray-500">
                  이번 달에는 데이터가 부족합니다.
                </div>
              )}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-xl text-gray-600">레포트를 불러올 수 없습니다.</p>
          </div>
        )}
      </div>
    </main>
  )
}

