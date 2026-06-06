'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NavBar() {
  const [navOpen, setNavOpen] = useState(false)
  const [navLocked, setNavLocked] = useState(false)
  const router = useRouter()

  const handleNavToggle = () => {
    setNavLocked(prev => !prev)
    if (!navLocked) setNavOpen(true)
    else setNavOpen(false)
  }

  const navItems = [
    { label: 'COUNTDOWN', path: '/countdown' },
    { label: 'CALENDAR', path: '/' },
    { label: 'SEE YOU SOON...', path: '/seeyousoon' },
  ]

  return (
    <>
      {/* 상단 감지 영역 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '50px',
          zIndex: 200,
        }}
        onMouseEnter={() => !navLocked && setNavOpen(true)}
      />

      {/* 네비바 */}
      <div
        onMouseEnter={() => !navLocked && setNavOpen(true)}
        onMouseLeave={() => !navLocked && setNavOpen(false)}
        onClick={handleNavToggle}
        style={{
          cursor: 'pointer',
          zIndex: 100,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          overflow: 'hidden',
          maxHeight: navOpen || navLocked ? '95px' : '0px',
          transition: 'max-height 0.25s ease',
        }}
      >
        {/* 배경 이미지 */}
        <img src="/header_img.webp" alt="" style={{
          width: '100%',
          height: '95px',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }} />

        {/* 글씨 오버레이 */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: '4rem',
          paddingRight: '500px',
        }}>
          <div style={{ display: 'flex', gap: '4rem' }}>
            {navItems.map(item => (
              <span key={item.label}
                onClick={e => { e.stopPropagation(); router.push(item.path) }}
                style={{
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  letterSpacing: '0.02em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}>
                {item.label}
              </span>
            ))}
          </div>
          <a href="https://vaundy.jp/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              color: '#ff6b2b',
              fontWeight: 800,
              fontSize: '1.2rem',
              letterSpacing: '0.02em',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}>
            TO OFFICIAL WEBSITE
          </a>
        </div>
      </div>
    </>
  )
}