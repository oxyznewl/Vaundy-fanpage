'use client'

import { useRouter } from 'next/navigation'

const DISCLAIMER_TEXT = "本サイトは非公式のファンサイトであり、アーティストや所属事務所とは関係ありません。　This is an unofficial fan site and is not affiliated with or endorsed by the artist, agency, or copyright holder.　본 사이트는 비공식 팬사이트이며、아티스트 및 소속사와 관련이 없습니다。"

export default function Footer() {
  const router = useRouter()

  return (
    <div style={{
      flexShrink: 0,
      borderTop: '2.4px solid #000',
      padding: '0 0 0 4rem'
    }}>
      {/* 슬라이딩 면책 문구 */}
      <div style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        borderBottom: '2.4px solid #000',
        padding: '0.4rem 0',
      }}>
        <span style={{
          display: 'inline-block',
          animation: 'marquee 40s linear infinite',
          fontSize: '0.90rem',
          color: '#ff0000',
        }}>
          {DISCLAIMER_TEXT}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {DISCLAIMER_TEXT}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>

      {/* 푸터 링크 */}
      <div style={{ display: 'flex', gap: '0', padding: '0' }}>
        {[
          { label: '소개', path: '/about' },
          { label: '공지사항', path: '/notice' },
          { label: '문의하기', path: '/contact' },
        ].map(item => (
          <span key={item.label}
            onClick={() => router.push(item.path)}
            style={{
              fontSize: '0.80rem',
              color: '#333',
              cursor: 'pointer',
              fontWeight: 500,
              padding: '0.5rem 1.3rem',
              borderRight: '2.4px solid #000',
            }}>
            {item.label}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}