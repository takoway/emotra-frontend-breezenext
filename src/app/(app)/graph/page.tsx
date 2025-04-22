'use client'

import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from '@/app/(app)/Header'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { fetcherGet, EP } from '@/fetch/fetcher'
import { useAuth } from '@/hooks/auth'
import { getTodayDateInTokyo } from '@/utils/date'

const Graph = () => {
    const { user } = useAuth({ middleware: 'auth' })
    const [data, setData] = useState<{ date: string; mental: number }[]>([])
    const [chartWidth, setChartWidth] = useState<number>(800) // 初期幅を設定

    useEffect(() => {
        const handleResize = () => {
            setChartWidth(window.innerWidth > 800 ? 800 : window.innerWidth - 40) // ウィンドウ幅に応じて調整
        }

        handleResize() // 初回実行
        window.addEventListener('resize', handleResize) // リサイズイベントを監視

        return () => window.removeEventListener('resize', handleResize) // クリーンアップ
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return

            const toastId = toast.loading('データを取得中...', { position: 'top-center' })

            try {
                // 現在の日付を取得
                const today = new Date(getTodayDateInTokyo()) // 修正: Dateオブジェクトに変換
                const endDate = today.toISOString().split('T')[0]
                const startDate = new Date(today.setDate(today.getDate() - 4))
                    .toISOString()
                    .split('T')[0]

                const endpoint = `${EP.get_diaries(user.id)}?startDate=${startDate}&endDate=${endDate}`
                const response = await fetcherGet<{ message: string; data: { date: string; mental: number }[] }>(endpoint)

                if (response?.data) {
                    setData(response.data.map(entry => ({
                        date: entry.date,
                        mental: entry.mental,
                    })))
                }
            } catch (error) {
                toast.update(toastId, {
                    render: 'データの取得中にエラーが発生しました。',
                    type: 'error',
                    isLoading: false,
                    autoClose: 1500,
                })
                console.error('Error fetching data:', error)
            } finally {
                toast.dismiss(toastId)
            }
        }

        fetchData()
    }, [user?.id])

    return (
        <>
            <Header title="Graph" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="w-full h-96">
                                <LineChart
                                    width={chartWidth} // 動的に設定
                                    height={400}
                                    data={data}
                                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }} // 左の余白を削減
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[1, 10]} /> {/* 下限を1、上限を10に固定 */}
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="mental" stroke="#8884d8" />
                                </LineChart>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    )
}

export default Graph
