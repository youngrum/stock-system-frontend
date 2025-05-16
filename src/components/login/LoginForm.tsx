'use client'

import { useForm } from 'react-hook-form'
import Image from "next/image";
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

      <div className='flex bg-white w-full justify-center'>
        <div className="bg-white p-20 max-w-md">
          <h2 className="text-2xl font-semibold mb-6">ログイン</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">ログインID*</label>
              <input
                type="text"
                {...register('username', { required: 'ログインIDを入力してください' })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                style={{ border: '1px solid #9F9F9F' }}
                placeholder="user name"
                />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">パスワード*</label>
              <input
                type="password"
                {...register('password', {
                  required: 'パスワードを入力してください',
                  // minLength: { value: 8, message: '8文字以上で入力してください' },
                })}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-100"
                style={{ border: '1px solid #9F9F9F' }}
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
            <p className="text-sm">ID・パスワードを忘れたりログインができない場合、管理者にお問い合わせください。</p>
          </form>
        </div>
        {/* 右：画像エリア */}
        <div className="hidden md:flex w-1/2 items-center justify-center max-w-md">
          <Image
            src="/img_login.png" 
            alt="Login Visual"
            className="w-3/4 h-auto object-contain shadow"
            width={410}
            height={285}
          />
        </div>  
      </div>
  )
}
