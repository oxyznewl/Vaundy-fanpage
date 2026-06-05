import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

export default function AboutPage() {
  const BORDER = '2px solid #111'
  const THIN_BORDER = '1px solid #111'
  const startDate = '2026.06.06'

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

      {/* 헤더 이미지 자리 */}
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

        {/* 소개 | 번역 옵션 행 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2px 1fr',
          borderBottom: BORDER,
          flexShrink: 0,
        }}>
          <div style={{ padding: 'clamp(0.4rem, 1.2vh, 0.8rem) clamp(1rem, 2vw, 2rem)' }}>
            <span style={{
              fontSize: 'clamp(1.2rem, 2.6vw, 2.2rem)',
              fontWeight: 900,
              letterSpacing: '0.05em',
              color: '#111',
            }}>
              소개
            </span>
          </div>
          <div style={{ backgroundColor: '#111' }} />
          <div style={{ padding: 'clamp(0.5rem, 1.5vh, 1rem) clamp(1rem, 2vw, 2rem)' }}>
            {/* 추후 번역 옵션 */}
          </div>
        </div>

        {/* 내용 영역 */}
        <div style={{
          flex: 1,
          padding: 'clamp(1.5rem, 3vh, 3rem) clamp(1.5rem, 3vw, 3rem)',
          overflowY: 'auto',
          fontSize: 'clamp(0.85rem, 1.2vw, 1rem)',
          lineHeight: 2,
          color: '#333',
        }}>
          {/* 추후 내용 채우기 */}
          <p> 표를 잡지 못한 상심의 마음과, 전부터 무언가를 만들어 보고 싶었던 마음을 담아 ‘온라인’으로 기획해보게 되었습니다. </p>
          <p> 이벤트성 페이지입니다. </p>
        </div>

        {/* 서버 운영 일자 행 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2px 1fr',
          borderTop: BORDER,
          borderBottom: THIN_BORDER,
          flexShrink: 0,
        }}>
          <div style={{ padding: 'clamp(0.4rem, 1.2vh, 0.8rem) clamp(1rem, 2vw, 2rem)' }}>
              <span style={{ fontSize: 'clamp(0.7em, 2.1vw, 1.7rem)', fontWeight: 900 }}>서버 운영 시작 일자</span>
          </div>
          <div style={{ backgroundColor: '#111' }} />
          <div style={{ padding: 'clamp(0.4rem, 1.2vh, 0.8rem) clamp(1rem, 2vw, 2rem)' }}>
              <span style={{ fontSize: 'clamp(0.7em, 2.1vw, 1.7rem)', fontWeight: 900 }}>{startDate}</span>
          </div>
        </div>

        {/* VAUNDY | VAWS 행 */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2px 1fr',
          flexShrink: 0,
        }}>
          <div style={{ padding: 'clamp(0.4rem, 1.2vh, 0.8rem) clamp(1rem, 2vw, 2rem)' }}>
              <span style={{ fontSize: 'clamp(0.7em, 2.1vw, 1.7rem)', fontWeight: 900 }}>VAUNDY</span>
          </div>
          <div style={{ backgroundColor: '#111' }} />
          <div style={{ padding: 'clamp(0.4rem, 1.2vh, 0.8rem) clamp(1rem, 2vw, 2rem)' }}>
              <span style={{ fontSize: 'clamp(0.7em, 2.1vw, 1.7rem)', fontWeight: 900 }}>VAWS</span>
          </div>
        </div>

      <Footer />

      </div>
    </div>
  )
}