'use client'

import Calendar from './components/Calendar'
import NavBar from './components/NavBar'
import Footer from './components/Footer'

export default function Home() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh', //배율? 화면 높이이
      fontFamily: "'Helvetica Neue', Arial, sans-serif",
      overflow: 'hidden',
      backgroundColor: '#fff',
    }}>

      <NavBar />

      {/* 메인 콘텐츠 */}
      <div style={{
        flex: 1,
        overflow: 'hidden',
        padding: `120px 2rem 0 2rem`,
        transition: 'padding-top 0.25s ease',
      }}>
        <Calendar />
      </div>

        <Footer />

    </div>
  )
}