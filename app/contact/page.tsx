import NavBar from '../components/NavBar'
import Footer from '../components/Footer'

export default function ContactPage() {
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: '#fff',
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <NavBar />
      <div style={{
        height: '120px',
        flexShrink: 0,
        backgroundImage: 'url(/header_img.webp)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '1rem' }}>
        준비 중입니다
      </div>
      <Footer />
    </div>
  )
}