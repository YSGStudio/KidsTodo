'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { format, subDays, addDays, startOfDay, endOfDay } from 'date-fns'
import { ko } from 'date-fns/locale'

interface DailyStats {
  date: string
  total: number
  completed: number
  completionRate: number
}

interface StudentInfo {
  id: string
  name: string
  studentCode: string
}

export default function StudentStatsPage() {
  const router = useRouter()
  const params = useParams()
  const studentId = params.studentId as string

  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const teacherId = localStorage.getItem('teacherId')
    if (!teacherId) {
      router.push('/teacher/login')
      return
    }

    fetchStudentInfo()
    fetchDailyStats()
  }, [router, studentId, selectedDate])

  const fetchStudentInfo = async () => {
    try {
      const teacherId = localStorage.getItem('teacherId')
      const res = await fetch(`/api/teacher/students/${studentId}?teacherId=${teacherId}`)
      const data = await res.json()

      if (res.ok) {
        setStudentInfo(data.student)
      }
    } catch (err) {
      console.error('Failed to fetch student info:', err)
    }
  }

  const fetchDailyStats = async () => {
    try {
      setLoading(true)
      // 선택한 날짜 기준으로 최소 3일 (전날, 당일, 다음날)
      const startDate = subDays(selectedDate, 1)
      const endDate = addDays(selectedDate, 1)

      const res = await fetch(
        `/api/teacher/students/${studentId}/stats?startDate=${format(startDate, 'yyyy-MM-dd')}&endDate=${format(endDate, 'yyyy-MM-dd')}`
      )
      const data = await res.json()

      if (res.ok) {
        setDailyStats(data.dailyStats || [])
      }
    } catch (err) {
      console.error('Failed to fetch daily stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate)
    setSelectedYear(newDate.getFullYear())
    setSelectedMonth(newDate.getMonth() + 1)
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }

  if (loading && !studentInfo) {
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
      <div className="max-w-6xl mx-auto">
        <div className="card mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-primary-700">
                📊 {studentInfo?.name} 학생 통계
              </h1>
              <p className="text-gray-600 mt-1">
                학생 코드: {studentInfo?.studentCode}
              </p>
            </div>
            <Link href="/teacher/dashboard" className="btn-secondary">
              ← 대시보드로
            </Link>
          </div>
        </div>

        {/* 날짜 선택 */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">날짜 선택</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 년도 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                년도
              </label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  const year = parseInt(e.target.value)
                  setSelectedYear(year)
                  const newDate = new Date(year, selectedMonth - 1, selectedDate.getDate())
                  handleDateChange(newDate)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}년
                    </option>
                  )
                )}
              </select>
            </div>

            {/* 월 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                월
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => {
                  const month = parseInt(e.target.value)
                  setSelectedMonth(month)
                  const daysInMonth = getDaysInMonth(selectedYear, month)
                  const day = Math.min(selectedDate.getDate(), daysInMonth)
                  const newDate = new Date(selectedYear, month - 1, day)
                  handleDateChange(newDate)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>
            </div>

            {/* 일 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                일
              </label>
              <select
                value={selectedDate.getDate()}
                onChange={(e) => {
                  const day = parseInt(e.target.value)
                  const newDate = new Date(selectedYear, selectedMonth - 1, day)
                  handleDateChange(newDate)
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              >
                {Array.from(
                  { length: getDaysInMonth(selectedYear, selectedMonth) },
                  (_, i) => i + 1
                ).map((day) => (
                  <option key={day} value={day}>
                    {day}일
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 3일간 완료도 */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            {format(subDays(selectedDate, 1), 'yyyy년 MM월 dd일', { locale: ko })} ~{' '}
            {format(addDays(selectedDate, 1), 'yyyy년 MM월 dd일', { locale: ko })} 완료도
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-500">로딩 중...</div>
          ) : dailyStats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              해당 기간의 데이터가 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {dailyStats
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((stat) => {
                  const dateObj = new Date(stat.date)
                  const dayName = dateObj.toLocaleDateString('ko-KR', { weekday: 'short' })
                  const isToday = format(dateObj, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
                  const isSelected = format(dateObj, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')

                  return (
                    <div
                      key={stat.date}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-primary-50 border-primary-300'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-800">
                            {dateObj.getMonth() + 1}월 {dateObj.getDate()}일 ({dayName})
                          </span>
                          {isToday && (
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded">
                              오늘
                            </span>
                          )}
                          {isSelected && (
                            <span className="px-2 py-1 bg-primary-200 text-primary-800 text-xs font-bold rounded">
                              선택됨
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-gray-600">
                            {stat.completed} / {stat.total} 완료
                          </span>
                          <span className="ml-2 text-lg font-bold text-primary-600">
                            {Math.round(stat.completionRate)}%
                          </span>
                        </div>
                      </div>
                      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full transition-all duration-500 ${
                            stat.completionRate === 100
                              ? 'bg-gradient-to-r from-green-400 to-green-600'
                              : stat.completionRate >= 80
                              ? 'bg-gradient-to-r from-primary-400 to-primary-600'
                              : stat.completionRate >= 50
                              ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                              : 'bg-gradient-to-r from-orange-400 to-orange-600'
                          }`}
                          style={{ width: `${stat.completionRate}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

