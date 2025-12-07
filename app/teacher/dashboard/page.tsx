'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Student {
  id: string
  name: string
  studentCode: string
}

export default function TeacherDashboard() {
  const router = useRouter()
  const [teacherName, setTeacherName] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: '',
    studentCode: '',
    password: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const teacherId = localStorage.getItem('teacherId')
    const name = localStorage.getItem('teacherName')

    if (!teacherId) {
      router.push('/teacher/login')
      return
    }

    if (name) {
      setTeacherName(name)
    }

    fetchStudents()
  }, [router])

  const fetchStudents = async () => {
    try {
      const teacherId = localStorage.getItem('teacherId')
      const res = await fetch(`/api/teacher/students?teacherId=${teacherId}`)
      const data = await res.json()

      if (res.ok) {
        setStudents(data.students || [])
      }
    } catch (err) {
      console.error('Failed to fetch students:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const teacherId = localStorage.getItem('teacherId')
      const res = await fetch('/api/teacher/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          ...newStudent,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setNewStudent({ name: '', studentCode: '', password: '' })
        setShowAddForm(false)
        fetchStudents()
      } else {
        setError(data.error || '학생 등록에 실패했습니다.')
      }
    } catch (err) {
      setError('학생 등록 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteStudent = async (studentId: string, studentName: string) => {
    if (!confirm(`${studentName} 학생을 정말 삭제하시겠습니까?\n\n삭제하면 해당 학생의 모든 데이터(계획, 투두리스트, 열매, 레포트)도 함께 삭제됩니다.`)) {
      return
    }

    try {
      const teacherId = localStorage.getItem('teacherId')
      const res = await fetch('/api/teacher/students', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          studentId,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        fetchStudents()
      } else {
        alert(data.error || '학생 삭제에 실패했습니다.')
      }
    } catch (err) {
      alert('학생 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('teacherId')
    localStorage.removeItem('teacherName')
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
                교사 대시보드
              </h1>
              <p className="text-gray-600 mt-1">
                안녕하세요, {teacherName} 선생님!
              </p>
            </div>
            <button onClick={handleLogout} className="btn-secondary">
              로그아웃
            </button>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">학생 목록</h2>
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary"
            >
              {showAddForm ? '취소' : '+ 학생 추가'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddStudent} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학생 이름
                </label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  학생 코드 (로그인용)
                </label>
                <input
                  type="text"
                  value={newStudent.studentCode}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, studentCode: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={newStudent.password}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, password: e.target.value })
                  }
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <button type="submit" className="btn-primary w-full">
                학생 등록
              </button>
            </form>
          )}

          {students.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              등록된 학생이 없습니다. 학생을 추가해주세요.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 relative hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => router.push(`/teacher/students/${student.id}/stats`)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteStudent(student.id, student.name)
                    }}
                    className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-full hover:bg-red-50 z-10"
                    title="학생 삭제"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                  <div className="pr-8">
                    <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary-600 transition-colors">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      코드: {student.studentCode}
                    </p>
                    <p className="text-xs text-primary-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      클릭하여 통계 보기 →
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

