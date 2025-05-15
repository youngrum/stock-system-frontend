'use client'

import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { loginWithCredentials } from '@/lib/auth'
import type { ApiErrorResponse } from '@/types/ApiResponse'

type LoginFormInputs = {
  username: string
  password: string
}

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>()
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      await loginWithCredentials(data.username, data.password)
      router.push('/me')
    } catch (error) {
      const err = error as { response?: { data: ApiErrorResponse } }
      console.log(err);
      const message = err?.response?.data?.message ?? 'ログインに失敗しました'
      setErrorMessage(message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">ログイン</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">ログインID</label>
            <input
              type="text"
              {...register('username', { required: 'ログインIDを入力してください' })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="your_username"
            />
            {errors.username && (
              <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium">パスワード</label>
            <input
              type="password"
              {...register('password', {
                required: 'パスワードを入力してください',
                // minLength: { value: 8, message: '8文字以上で入力してください' },
              })}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="password"
            />
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <button
            type="submit"
            className="w-full bg-[#101540] text-white py-2 rounded hover:bg-[#1d1f3c]"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  )
}
