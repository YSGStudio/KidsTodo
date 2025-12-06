import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-primary-700 mb-2">
          🌱 성장열매 투두리스트
        </h1>
        <p className="text-gray-600 mb-8">
          매일 계획을 실천하고 열매를 모아보세요!
        </p>
        
        <div className="space-y-4">
          <Link href="/teacher/login" className="btn-primary block w-full">
            교사 로그인
          </Link>
          <Link href="/student/login" className="btn-secondary block w-full">
            학생 로그인
          </Link>
        </div>
      </div>
    </main>
  )
}

