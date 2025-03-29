'use client'

import { useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from '@/app/(app)/Header'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { fetcherPost, EP } from '@/fetch/fetcher'
import { useAuth } from '@/hooks/auth'
import { getTodayDateInTokyo } from '@/utils/date'

const Diary = () => {
    const { user } = useAuth({ middleware: 'auth' })
    const [date, setDate] = useState(getTodayDateInTokyo())
    const [mental, setMental] = useState(5)
    const [diary, setDiary] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user?.id) {
            console.error('User ID is not available')
            toast.error('ユーザー情報が取得できませんでした。')
            return
        }

        try {
            const endpoint = EP.upsert_diary(user.id, date)
            const response = await fetcherPost(endpoint, { mental, diary })
            toast.success('日記が正常に保存されました！', { autoClose: 1500 })
            console.log('Success:', response)
        } catch (error) {
            toast.error('日記の保存中にエラーが発生しました。')
            console.error('Error:', error)
        }
    }

    return (
        <>
            <Header title="Diary" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={handleSubmit}>
                                {/* 日付入力 */}
                                <div>
                                    <Input
                                        type="date"
                                        id="date"
                                        name="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-48"
                                    />
                                </div>

                                {/* メンタル入力 */}
                                <div className="mt-6 flex items-center gap-4">
                                    <label htmlFor="mental" className="block text-sm font-medium text-gray-700">
                                        メンタル
                                    </label>
                                    <Input
                                        type="number"
                                        id="mental"
                                        name="mental"
                                        min="1"
                                        max="10"
                                        required
                                        value={mental}
                                        onChange={(e) => setMental(Number(e.target.value))}
                                        className="w-48 ml-4"
                                    />
                                </div>

                                {/* 日記入力 */}
                                <div className="mt-6">
                                    <label htmlFor="diary" className="block text-sm font-medium text-gray-700">
                                        日記
                                    </label>
                                    <textarea
                                        id="diary"
                                        name="diary"
                                        rows={3}
                                        value={diary}
                                        onChange={(e) => setDiary(e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                    />
                                </div>

                                <Button type="submit" className="mt-4 bg-blue-600 hover:bg-blue-700">
                                    送信
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* トースト */}
            <ToastContainer position="bottom-center" />
        </>
    )
}

export default Diary