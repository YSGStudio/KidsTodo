import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

// 교사 로그인
export async function loginTeacher(email: string, password: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { email },
  })

  if (!teacher) {
    return null
  }

  const isValid = await bcrypt.compare(password, teacher.password)
  if (!isValid) {
    return null
  }

  return { id: teacher.id, email: teacher.email, name: teacher.name }
}

// 교사 회원가입
export async function registerTeacher(name: string, email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const teacher = await prisma.teacher.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  })

  return { id: teacher.id, email: teacher.email, name: teacher.name }
}

// 학생 로그인
export async function loginStudent(studentCode: string, password: string) {
  const student = await prisma.student.findUnique({
    where: { studentCode },
  })

  if (!student) {
    return null
  }

  const isValid = await bcrypt.compare(password, student.password)
  if (!isValid) {
    return null
  }

  return { id: student.id, name: student.name, studentCode: student.studentCode }
}

// 학생 등록 (교사가 등록)
export async function registerStudent(
  teacherId: string,
  name: string,
  studentCode: string,
  password: string
) {
  const hashedPassword = await bcrypt.hash(password, 10)
  
  const student = await prisma.student.create({
    data: {
      teacherId,
      name,
      studentCode,
      password: hashedPassword,
    },
  })

  return student
}

