'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const LYRICS_PASSWORD = 'v202609'

type Concert = {
  id: number
  date: string
  title: string
  category: string
  venue: string
  location: string
  status: string
  memo: string
}

type Song = {
  id: number
  release_date: string
  title: string
  category: string        // 추가
  album_cover_url: string       // 추가
  play_url: string   // 추가
  comment: string         // 추가
  youtube_url: string
  lyrics: string
  lyrics_url: string
}

type Collab = {
  id: number
  date: string
  title: string
  artist: string
  type: string
}

type CalendarEvent = {
  date: string
  type: 'concert' | 'song' | 'collab'
  data: Concert | Song | Collab
  isAnniversary?: boolean
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

// September가 가장 긴 월
const MAX_MONTH_WIDTH = 'September'.length

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)
  const [clickedDate, setClickedDate] = useState<string | null>(null)
  const [unlockedDates, setUnlockedDates] = useState<Set<string>>(new Set())
  const [pwInput, setPwInput] = useState('')
  const [pwError, setPwError] = useState(false)
  const [editingYear, setEditingYear] = useState(false)
  const [editingMonth, setEditingMonth] = useState(false)
  const [yearInput, setYearInput] = useState('')
  const [monthInput, setMonthInput] = useState('')

  const today = new Date()
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    const fetchEvents = async () => {
      const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
      const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${new Date(year, month + 1, 0).getDate()}`

      const [{ data: concerts }, { data: songs }, { data: collabs }] = await Promise.all([
        supabase.from('concerts').select('*').gte('date', startDate).lte('date', endDate),
        supabase.from('songs').select('*').gte('release_date', startDate).lte('release_date', endDate),
        supabase.from('collaborations').select('*').gte('date', startDate).lte('date', endDate),
      ])

      const { data: allSongs } = await supabase.from('songs').select('*').lt('release_date', `${year}-01-01`)
      const { data: allCollabs } = await supabase.from('collaborations').select('*').lt('date', `${year}-01-01`)

      const anniversarySongs: CalendarEvent[] = (allSongs || [])
        .filter(s => s.release_date && new Date(s.release_date).getMonth() === month)
        .map(s => {
          const d = new Date(s.release_date)
          return {
            date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
            type: 'song' as const, data: s, isAnniversary: true
          }
        })

      const anniversaryCollabs: CalendarEvent[] = (allCollabs || [])
        .filter(c => c.date && new Date(c.date).getMonth() === month)
        .map(c => {
          const d = new Date(c.date)
          return {
            date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
            type: 'collab' as const, data: c, isAnniversary: true
          }
        })

      setEvents([
        ...(concerts || []).map(c => ({ date: c.date, type: 'concert' as const, data: c, isAnniversary: false })),
        ...(songs || []).map(s => ({ date: s.release_date, type: 'song' as const, data: s, isAnniversary: false })),
        ...(collabs || []).map(c => ({ date: c.date, type: 'collab' as const, data: c, isAnniversary: false })),
        ...anniversarySongs,
        ...anniversaryCollabs,
      ])
    }
    fetchEvents()
  }, [year, month])

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDay = new Date(year, month, 1).getDay()

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return events.filter(e => e.date === dateStr)
  }

  const getEventColor = (e: CalendarEvent, dayDate: Date) => {
    if (e.isAnniversary) return '#bbb'
    const isPast = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())
    if (isPast) return '#aaa'
    if (e.type === 'concert') return '#4a90d9'
    if (e.type === 'song' || e.type === 'collab') return '#ff6b2b'
    return '#222'
  }

  const isTodayFn = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  const handlePwSubmit = () => {
    if (pwInput === LYRICS_PASSWORD && activeDate) {
      setUnlockedDates(prev => new Set(prev).add(activeDate))
      setPwError(false)
    } else setPwError(true)
  }

  const handleDayClick = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setClickedDate(prev => prev === dateStr ? null : dateStr)
  }

  const activeDate = clickedDate || hoveredDate
  const activeEvents = activeDate ? events.filter(e => e.date === activeDate) : []
  const currentMonthName = MONTH_NAMES[month].toUpperCase()
  const lineWidth = `clamp(4rem, ${(currentMonthName.length / MAX_MONTH_WIDTH) * 6}vw, 10rem)`

  // 달력 행 수 계산
  const totalCells = firstDay + daysInMonth
  const numRows = Math.ceil(totalCells / 7)
  // 고정 행 높이: 전체 높이에서 헤더 빼고 나누기
  const ROW_HEIGHT = 90 // px

  return (
    <div style={{
      display: 'flex',
      gap: '1.6rem',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      height: '100%',
      overflow: 'hidden',
      paddingLeft: 'clamp(0.5rem, 1.5vw, 1.5rem',
    }}>

      {/* 캘린더 영역 */}
      <div style={{ flex: '1 1 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>

        {/* 헤더 */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>

            {/* 왼쪽 화살표 - 고정 너비 */}
            <button onClick={() => { setCurrentDate(new Date(year, month - 1)); setClickedDate(null) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, color: '#111', width: '32px', textAlign: 'center', flexShrink: 0 }}>←</button>

            {/* 월 - September 기준 고정 너비 */}
            <div style={{ width: `${MAX_MONTH_WIDTH * 1.35}rem`, textAlign: 'center', flexShrink: 0 }}>
              {editingMonth ? (
                <input autoFocus value={monthInput}
                  onChange={e => setMonthInput(e.target.value)}
                  onBlur={() => { const m = parseInt(monthInput); if (m >= 1 && m <= 12) setCurrentDate(new Date(year, m - 1)); setEditingMonth(false) }}
                  onKeyDown={e => { if (e.key === 'Enter') { const m = parseInt(monthInput); if (m >= 1 && m <= 12) setCurrentDate(new Date(year, m - 1)); setEditingMonth(false) } }}
                  style={{ width: '80px', fontSize: '1.8rem', fontWeight: 900, border: 'none', borderBottom: '2px solid #ff6b2b', outline: 'none', textAlign: 'center', background: 'transparent' }}
                />
              ) : (
                <span onClick={() => { setEditingMonth(true); setMonthInput(String(month + 1)) }}
                  style={{ fontSize: '1.8rem', fontWeight: 900, cursor: 'pointer', color: '#111', letterSpacing: '-0.02em' }}>
                  {currentMonthName}
                </span>
              )}
            </div>

            {/* 줄 - 월 이름 길이에 비례 */}
            <div style={{
              width: lineWidth,
              height: '3px',
              backgroundColor: '#111',
              flexShrink: 0,
              transition: 'width 0.2s',
            }} />

            {/* 년도 - 고정 너비 */}
            <div style={{ width: '5rem', textAlign: 'center', flexShrink: 0 }}>
              {editingYear ? (
                <input autoFocus value={yearInput}
                  onChange={e => setYearInput(e.target.value)}
                  onBlur={() => { const y = parseInt(yearInput); if (y > 2000 && y < 2100) setCurrentDate(new Date(y, month)); setEditingYear(false) }}
                  onKeyDown={e => { if (e.key === 'Enter') { const y = parseInt(yearInput); if (y > 2000 && y < 2100) setCurrentDate(new Date(y, month)); setEditingYear(false) } }}
                  style={{ width: '5rem', fontSize: '1.8rem', fontWeight: 900, border: 'none', borderBottom: '2px solid #ff6b2b', outline: 'none', textAlign: 'center', background: 'transparent' }}
                />
              ) : (
                <span onClick={() => { setEditingYear(true); setYearInput(String(year)) }}
                  style={{ fontSize: '1.8rem', fontWeight: 900, cursor: 'pointer', color: '#111', letterSpacing: '-0.02em' }}>
                  {year}
                </span>
              )}
            </div>

            {/* 오른쪽 화살표 - 고정 너비 */}
            <button onClick={() => { setCurrentDate(new Date(year, month + 1)); setClickedDate(null) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 700, color: '#111', width: '32px', textAlign: 'center', flexShrink: 0 }}>→</button>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '2px solid #111' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} style={{ fontSize: '0.65rem', color: '#111', padding: '0.3rem 0.5rem', fontWeight: 600, letterSpacing: '0.05em' }}>
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 - 고정 높이 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: `repeat(${numRows}, ${ROW_HEIGHT}px)` }}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} style={{ borderTop: '2px solid #111' }} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dayEvents = getEventsForDay(day)
            const todayFlag = isTodayFn(day)
            const dayDate = new Date(year, month, day)
            const isPast = dayDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const isClicked = clickedDate === dateStr
            const isActive = activeDate === dateStr

            return (
              <div key={day}
                onClick={() => handleDayClick(day)}
                onMouseEnter={() => !clickedDate && setHoveredDate(dateStr)}
                onMouseLeave={() => !clickedDate && setHoveredDate(null)}
                style={{
                  borderTop: '2px solid #111',
                  padding: '0.4rem 0.5rem 0.3rem',
                  cursor: 'pointer',
                  backgroundColor: isClicked ? '#fff5f0' : isActive ? '#fff8f5' : 'transparent',
                  transition: 'background-color 0.15s',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  height: `${ROW_HEIGHT}px`,
                }}
              >
                {/* 날짜 숫자 */}
                <div style={{ marginBottom: '0.25rem' }}>
                  <span style={{
                    fontSize: '1.3rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '28px',
                    height: '28px',
                    borderRadius: todayFlag ? '50%' : '0',
                    backgroundColor: todayFlag ? '#ff6b2b' : 'transparent',
                    color: todayFlag ? '#fff' : isPast ? '#bbb' : '#111',
                  }}>
                    {day}
                  </span>
                </div>

                {/* 날짜 아래 굵은 구분선 */}
                <div style={{ borderTop: '2px solid #111', marginBottom: '0.25rem', width: '100%' }} />

                {/* 이벤트 최대 2개 + +N */}
                {dayEvents.slice(0, 2).map((e, idx) => (
                  <div key={idx} style={{
                    fontSize: '0.60rem',
                    color: getEventColor(e, dayDate),
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: '1.5',
                  }}>
                    {(e.type === 'song' || e.type === 'collab') && '♬ '}
                    {'title' in e.data ? e.data.title : ''}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div style={{ fontSize: '0.50rem', color: '#bbb', lineHeight: '1.5' }}>+{dayEvents.length - 2}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 구분선 - 요일헤더 아래부터 */}
      <div style={{
        width: '2px',
        backgroundColor: '#111',
        flexShrink: 0,
        marginTop: `calc(-7rem + 2rem + 1.2rem)`, // 헤더 + paddingTop + 요일헤더 높이
        marginBottom: '1.5rem',
        marginLeft: '2.4rem'
      }} />

      {/* 우측 패널 */}
      <div style={{
        width: '20vw',
        flexShrink: 0,
        overflowY: 'auto',
        paddingLeft: '1.4rem',
        paddingTop: `calc(0.1rem + 0rem + 2.2rem)`,
        boxSizing: 'border-box',
      }}>
        {activeDate ? (
          <>
            {activeEvents.length > 0 ? activeEvents.map((e, idx) => {
              const lyricsUnlocked = unlockedDates.has(activeDate)

              return (
                <div key={idx} style={{ marginBottom: '2rem'}}>

                  {/* 날짜 + 제목 */}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, color: '#111' }}>
                      {activeDate.split('-')[2]}
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111' }}>
                      {'title' in e.data ? e.data.title : ''}
                    </span>
                  </div>

                  <div style={{ borderTop: '2px solid #111', marginBottom: '0.85rem' }} />

                  {/* songs / collab 패널 */}
                  {(e.type === 'song' || e.type === 'collab') && (
                    <>
                      {/* 앨범 커버 + 필드 */}
                      <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '10px' }}>

                        {/* 앨범 커버 */}
                        <div style={{
                          width: '94px', height: '94px', flexShrink: 0,
                          background: '#ff4500', overflow: 'hidden', position: 'relative'
                        }}>
                          {'album_cover_url' in e.data && e.data.album_cover_url && lyricsUnlocked ? (
                            <img src={e.data.album_cover_url} alt="cover"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <>
                              {'album_cover_url' in e.data && e.data.album_cover_url && (
                                <img src={e.data.album_cover_url} alt="cover"
                                  style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(10px)', transform: 'scale(1.15)' }} />
                              )}
                              <div style={{
                                position: 'absolute', inset: 0,
                                background: 'rgba(255,255,255,0.45)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}>
                                <span style={{ fontSize: '1.2rem', color: '#aaa' }}>🎧</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* 필드들 */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '2px' }}>
                          {e.type === 'song' && 'category' in e.data && e.data.category && (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                              <span style={{ fontSize: '9px', fontWeight: 700, color: '#555', minWidth: '52px' }}>카테고리</span>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#111' }}>{e.data.category}</span>
                            </div>
                          )}
                          {'release_date' in e.data && e.data.release_date && (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                              <span style={{ fontSize: '9px', fontWeight: 700, color: '#555', minWidth: '52px' }}>발매일</span>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#111' }}>{e.data.release_date}</span>
                            </div>
                          )}
                          {'play_url' in e.data && e.data.play_url && (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                              <span style={{ fontSize: '9px', fontWeight: 700, color: '#555', minWidth: '52px', flexShrink: 0 }}>들으러 가기</span>
                              <a href={e.data.play_url} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: '11px', fontWeight: 700, color: '#111', textDecoration: 'none' }}>
                                to go →
                              </a>
                            </div>
                          )}
                          {'youtube_url' in e.data && e.data.youtube_url && (
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                              <span style={{ fontSize: '9px', fontWeight: 700, color: '#555', minWidth: '52px' }}>뮤비</span>
                              <a href={e.data.youtube_url} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: '11px', fontWeight: 700, color: '#111', textDecoration: 'none' }}>
                                MV 보기 →
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 코멘트 */}
                      {'comment' in e.data && e.data.comment && (
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', textAlign: 'center', margin: '10px 0 14px', lineHeight: 1.5 }}>
                          "{e.data.comment}"
                        </div>
                      )}

                      {/* 가사 보기 */}
                      {'lyrics' in e.data && e.data.lyrics && (
                        <div>
                          {lyricsUnlocked ? (
                            <div style={{ fontSize: '0.8rem', lineHeight: 2, color: '#222', whiteSpace: 'pre-line', maxHeight: '35vh', overflowY: 'auto' }}>
                              {e.data.lyrics}
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: '#555', minWidth: '52px' }}>가사 보기</span>
                              <input
                                type="password"
                                value={pwInput}
                                onChange={ev => setPwInput(ev.target.value)}
                                onKeyDown={ev => ev.key === 'Enter' && handlePwSubmit()}
                                placeholder="비밀번호"
                                style={{
                                  flex: 1, fontSize: '11px',
                                  border: pwError ? '1px solid red' : '0.5px solid #ccc',
                                  padding: '5px 8px', outline: 'none',
                                  background: 'transparent'
                                }}
                              />
                              <button onClick={handlePwSubmit}
                                style={{
                                  fontSize: '11px', fontWeight: 700,
                                  color: '#fff', background: '#111',
                                  border: 'none', padding: '5px 12px', cursor: 'pointer'
                                }}>
                                확인
                              </button>
                            </div>
                          )}
                          {pwError && <div style={{ fontSize: '0.65rem', color: 'red', marginTop: '0.3rem' }}>틀렸어요</div>}
                        </div>
                      )}
                    </>
                  )}

                  {/* concert 패널 */}
                  {e.type === 'concert' && 'venue' in e.data && (
                    <div style={{ fontSize: '0.85rem', lineHeight: 1.8 }}>
                      {e.data.venue && (
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#555', minWidth: '28px' }}>위치</span>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{e.data.venue}</span>
                        </div>
                      )}
                      {'location' in e.data && e.data.location && (
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#555', minWidth: '28px' }}>지역</span>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{e.data.location}</span>
                        </div>
                      )}
                      {'memo' in e.data && e.data.memo && (
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '5px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#555', minWidth: '28px' }}>메모</span>
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{e.data.memo}</span>
                        </div>
                      )}
                      {'status' in e.data && e.data.status && (
                        <div style={{ marginTop: '12px', marginBottom: '6px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#555' }}>세트리스트</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            }) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, color: '#111' }}>
                    {activeDate.split('-')[2]}
                  </span>
                </div>
                <div style={{ borderTop: '2px solid #111', marginBottom: '0.75rem' }} />
                <div style={{ fontSize: '0.8rem', color: '#ccc' }}>일정 없음</div>
              </div>
            )}
          </>
        ) : (
          <div style={{ fontSize: '0.8rem', color: '#ccc' }}>날짜를 hover하거나 클릭해보세요</div>
        )}
      </div>
    </div>
  )
}