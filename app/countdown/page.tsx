'use client'

import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'

const CONCERTS = [
  {
    name: 'VAUDNY ASIA ARENA TOUR 2026 "HORO',
    date: '2026-09-19T17:00:00',
    venue: 'INSPIRE ARENA',
  },
]

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - new Date().getTime()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownPage() {
  const [selected, setSelected] = useState(0)
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(CONCERTS[0].date))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calcTimeLeft(CONCERTS[selected].date))
    }, 1000)
    return () => clearInterval(timer)
  }, [selected])

  const concert = CONCERTS[selected]
  const targetDate = new Date(concert.date)
  const dateStr = targetDate.toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const timeStr = targetDate.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  const pad = (n: number) => String(n).padStart(2, '0')

  const BORDER = '2px solid #fff'
  const THIN_BORDER = '1px solid #fff'


  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#0a0a0a',
      color: '#fff',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      <NavBar />

      {/* 네비바 자리 이미지 */}
      <div style={{
      height: '120px',
      flexShrink: 0,
      backgroundImage: 'url(/header_img.webp)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      }} />

      {/* 슬레이트 본체 — flex로 전체 채우기 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>

        {/* SCENE / TAKE / ROLL 행 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2px 1fr 2px 1fr',
          borderBottom: BORDER,
          flexShrink: 0,
        }}>
          {[
            { label: 'SCENE', value: concert.name },
            { label: 'TAKE', value: dateStr },
            { label: 'ROLL', value: timeStr },
          ].map((item, i) => (
            <>
              <div key={item.label} style={{ padding: 'clamp(0.5rem, 1.5vh, 1rem) clamp(1rem, 2vw, 2rem)' }}>
                <div style={{ fontSize: 'clamp(0.55rem, 0.8vw, 0.7rem)', color: '#888', letterSpacing: '0.15em', marginBottom: '0.3rem' }}>{item.label}</div>
                <div style={{ fontSize: 'clamp(0.8rem, 1.5vw, 1.2rem)', color: '#fff', fontWeight: 700 }}>{item.value}</div>
              </div>
              {i < 2 && <div key={`sep-${i}`} style={{ backgroundColor: '#fff' }} />}
            </>
          ))}
        </div>

        {/* 카운트다운 메인 — flex: 1로 남은 공간 채우기 */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 2px 1fr 2px 1fr 2px 1fr',
          borderBottom: BORDER,
        }}>
          {[
            { value: timeLeft.days, label: 'DAYS' },
            { value: timeLeft.hours, label: 'HOURS' },
            { value: timeLeft.minutes, label: 'MINUTES' },
            { value: timeLeft.seconds, label: 'SECONDS' },
          ].map((item, i) => (
            <>
              <div key={item.label} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  fontSize: 'clamp(3rem, 10vw, 9rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  fontVariantNumeric: 'tabular-nums',
                  color: '#fff',
                }}>
                  {pad(item.value)}
                </div>
                <div style={{
                  fontSize: 'clamp(0.55rem, 0.8vw, 0.7rem)',
                  color: '#888',
                  letterSpacing: '0.2em',
                  marginTop: '0.8rem',
                }}>
                  {item.label}
                </div>
              </div>
              {i < 3 && <div key={`sep-${i}`} style={{ backgroundColor: '#fff' }} />}
            </>
          ))}
        </div>

        {/* DATE / VENUE 행 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2px 1fr',
          borderBottom: THIN_BORDER,
          flexShrink: 0,
        }}>
          {[
            { label: 'DATE', value: dateStr },
            { label: 'VENUE', value: concert.venue },
          ].map((item, i) => (
            <>
              <div key={item.label} style={{ padding: 'clamp(0.4rem, 1.2vh, 0.8rem) clamp(1rem, 2vw, 2rem)' }}>
                <div style={{ fontSize: 'clamp(0.55rem, 0.8vw, 0.7rem)', color: '#888', letterSpacing: '0.15em', marginBottom: '0.2rem' }}>{item.label}</div>
                <div style={{ fontSize: 'clamp(0.8rem, 1.3vw, 1rem)', color: '#fff', fontWeight: 600 }}>{item.value}</div>
              </div>
              {i < 1 && <div key={`sep-${i}`} style={{ backgroundColor: '#fff' }} />}
            </>
          ))}
        </div>

        {/* ARTIST 행 */}
        <div style={{ flexShrink: 0, padding: 'clamp(0.4rem, 1.2vh, 0.8rem) clamp(1rem, 2vw, 2rem)' }}>
          <div style={{ fontSize: 'clamp(0.55rem, 0.8vw, 0.7rem)', color: '#888', letterSpacing: '0.15em', marginBottom: '0.2rem' }}>ARTIST</div>
          <div style={{ fontSize: 'clamp(0.8rem, 1.3vw, 1rem)', color: '#fff', fontWeight: 600 }}>VAUNDY</div>
        </div>

      </div>
    </div>
  )
}