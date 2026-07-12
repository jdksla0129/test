import { useEffect, useState } from 'react'
import { BridgeProvider } from '@b1nd/aid-kit/bridge-kit/web'
import './App.css'

// 대구소프트웨어마이스터고 좌표
const LAT = 35.629
const LON = 128.454

interface DustData {
  pm10: number
  pm25: number
  time: string
}

// 한국 환경부 기준 (PM2.5): 좋음 0-15, 보통 16-35, 나쁨 36-75, 매우나쁨 76+
function gradeOf(pm25: number) {
  if (pm25 <= 15) return { emoji: '😊', label: '좋음', cls: 'good' }
  if (pm25 <= 35) return { emoji: '🙂', label: '보통', cls: 'moderate' }
  if (pm25 <= 75) return { emoji: '😷', label: '나쁨', cls: 'bad' }
  return { emoji: '🚨', label: '매우 나쁨', cls: 'worst' }
}

function DustCard() {
  const [data, setData] = useState<DustData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${LAT}&longitude=${LON}&current=pm10,pm2_5&timezone=Asia%2FSeoul`
    fetch(url)
      .then((res) => res.json())
      .then((json) =>
        setData({
          pm10: json.current.pm10,
          pm25: json.current.pm2_5,
          time: json.current.time,
        }),
      )
      .catch((e) => setError(String(e)))
  }, [])

  if (error) {
    return (
      <div className="card">
        <div className="grade">❌</div>
        <div className="label">불러오기 실패</div>
        <div className="status">{error}</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="card">
        <div className="grade">⏳</div>
        <div className="label">불러오는 중...</div>
      </div>
    )
  }

  const g = gradeOf(data.pm25)
  return (
    <div className="card">
      <h1>미세먼지 알리미</h1>
      <div className="location">대구 · 대구소프트웨어마이스터고 인근</div>
      <div className="grade">{g.emoji}</div>
      <div className={`label ${g.cls}`}>{g.label}</div>
      <div className="values">
        <div className="value-box">
          <div className="name">미세먼지 (PM10)</div>
          <div className="num">{Math.round(data.pm10)}</div>
          <div className="unit">㎍/㎥</div>
        </div>
        <div className="value-box">
          <div className="name">초미세먼지 (PM2.5)</div>
          <div className="num">{Math.round(data.pm25)}</div>
          <div className="unit">㎍/㎥</div>
        </div>
      </div>
      <div className="status">기준 시각: {data.time.replace('T', ' ')}</div>
    </div>
  )
}

function App() {
  return (
    <BridgeProvider>
      <DustCard />
    </BridgeProvider>
  )
}

export default App
