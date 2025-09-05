'use client'

import { useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store'
import { login, fetchMe } from '@/store/authSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

// Import hooks and resolver
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, LoginFormSchema } from '@/schemas/loginSchema'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParams = useSearchParams()

  const { status, error, user } = useAppSelector((s) => s.auth)
  const redirect = searchParams.get('redirect') || '/'

  // 1. นำ useForm hook มาใช้
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
    // กำหนดค่าเริ่มต้นเพื่อให้ react hook form ทำงานได้อย่างถูกต้อง
    defaultValues: {
      email: 'admin@example.com',
      password: 'password123',
    },
  })

  useEffect(() => {
    dispatch(fetchMe())
  }, [dispatch])

  useEffect(() => {
    if (status === 'authenticated' && user) {
      router.replace(redirect)
    }
  }, [status, user, router, redirect])

  // 2. ฟังก์ชัน onSubmit จะรับข้อมูลที่ถูก validate แล้วโดยอัตโนมัติ
  const onSubmit = async (data: LoginFormSchema) => {
    await dispatch(login(data))
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to sign in
          </CardDescription>
        </CardHeader>

        {/* 3. เรียก handleSubmit() แทนการใช้ onSubmit ปกติ */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                // 4. ใช้ {...register('email')} เพื่อเชื่อมต่อ input
                {...register('email')}
                disabled={status === 'loading'}
              />
              {/* 5. แสดง error จาก formState */}
              {errors.email && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                // 6. ใช้ {...register('password')}
                {...register('password')}
                disabled={status === 'loading'}
              />
              {errors.password && (
                <p className="text-sm text-red-600" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 mt-6">
            <Button
              type="submit"
              className="w-full"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? 'Signing in...' : 'Sign In'}
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Don’t have an account?{' '}
              <a href="/register" className="underline hover:text-primary">
                Register
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
