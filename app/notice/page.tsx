'use client'

import { useState } from 'react'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

const NOTICES = [
  // 나중에 여기에 공지 추가해요
  // { id: 1, title: '공지 제목', date: '2026.06.06' },
]

const ITEMS_PER_PAGE = 8

export default function NoticePage() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.max(1, Math.ceil(NOTICES.length / ITEMS_PER_PAGE))
  const currentNotices = NOTICES.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const BORDER = '2px solid #111'
  const THIN_BORDER = '1px solid #ddd'

  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#fff',
      color: '#111',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <NavBar />

      {/* 헤더 이미지 */}
      <div style={{
        height: '120px',
        flexShrink: 0,
        backgroundImage: 'url(/header_img.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />

      {/* 본체 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        borderTop: BORDER,
      }}>

        {/* 공지사항 | 공란 행 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2px 1fr',
          borderBottom: BORDER,
          flexShrink: 0,
        }}>
          <div style={{ padding: 'clamp(0.5rem, 1.5vh, 1rem) clamp(1rem, 2vw, 2rem)' }}>
            <span style={{
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              fontWeight: 900,
              letterSpacing: '0.05em',
            }}>
              공지사항
            </span>
          </div>
          <div style={{ backgroundColor: '#111' }} />
          <div style={{ padding: 'clamp(0.5rem, 1.5vh, 1rem) clamp(1rem, 2vw, 2rem)' }} />
        </div>

        {/* 공지 목록 */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {currentNotices.length > 0 ? currentNotices.map((notice, i) => (
            <div key={notice.id} style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              padding: 'clamp(0.6rem, 1.5vh, 1rem) clamp(1rem, 2vw, 2rem)',
              borderBottom: THIN_BORDER,
              cursor: 'pointer',
            }}>
              <span style={{ fontSize: 'clamp(0.85rem, 1.2vw, 1rem)', fontWeight: 500 }}>{notice.title}</span>
              <span style={{ fontSize: 'clamp(0.7rem, 1vw, 0.85rem)', color: '#888' }}>{notice.date}</span>
            </div>
          )) : (
            // 빈 줄 8개
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                padding: 'clamp(0.6rem, 1.5vh, 1rem) clamp(1rem, 2vw, 2rem)',
                borderBottom: THIN_BORDER,
                height: '60px',
              }} />
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        <div style={{
          borderTop: BORDER,
          padding: '0.6rem 2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '1rem',
          flexShrink: 0,
        }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentPage === 1 ? '#ddd' : '#111', fontSize: '1rem', fontWeight: 700 }}>
            ←
          </button>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em' }}>
            {String(currentPage).padStart(2, '0')} / {String(totalPages).padStart(2, '0')}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: currentPage === totalPages ? '#ddd' : '#111', fontSize: '1rem', fontWeight: 700 }}>
            →
          </button>
        </div>

      </div>

      <Footer />
    </div>
  )
}