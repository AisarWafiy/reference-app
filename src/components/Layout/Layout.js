import React, { useState, useEffect } from 'react'
import SideBar from './Sidebar/SideBar'
import Header from './Header/Header'
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai'
import IdleTimer from 'react-idle-timer'
import { useOktaAuth } from '@okta/okta-react'

let idleTimer = null

export default function Layout(props) {
  const [path, setpath] = useState('')
  const [sideBar, setSideBar] = useState(true)
  const [timeout, setTimeout] = useState(1000 * 60 * 60 * 8)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [isActive, setActive] = useState(false)
  const { oktaAuth, authState } = useOktaAuth()
  let interval1
  useEffect(() => {
    if (path !== window.location.pathname) setpath(`${window.location.pathname}`)
  })

  const onAction = e => {
    setIsTimedOut(false)
  }
  const showSideBar = () => {
    setSideBar(!sideBar)
  }

  useEffect(() => {
    interval1 = setInterval(() => {
      if (sideBar === true && isActive === false) {
        setSideBar(!sideBar)
      } else {
        setSideBar(sideBar)
      }
    }, 10000)
    return () => clearInterval(interval1)
  }, [sideBar, isActive])
  const onActive = e => {
    setIsTimedOut(false)
  }

  const onIdle = e => {
    const istimedOut = isTimedOut
    if (istimedOut) {
      oktaAuth.signOut()
    } else {
      idleTimer.reset()
      setIsTimedOut(true)
    }
  }

  return (
    <div className='content' style={{ height: '100%' }}>
      <IdleTimer
        ref={ref => {
          idleTimer = ref
        }}
        element={document}
        onActive={onActive}
        onIdle={onIdle}
        onAction={onAction}
        debounce={250}
        timeout={timeout}
      />

      {sideBar && (
        <div
          className='one'
          onMouseOver={() => setActive(true)}
          onMouseOut={() => setActive(false)}
        >
          <SideBar currentPath={path} />
        </div>
      )}

      <div style={{ paddingTop: '50px' }} className='four'>
        {!sideBar ? (
          <AiOutlineRightCircle color='white' size={20} onClick={() => setSideBar(true)} />
        ) : (
          <AiOutlineLeftCircle size={20} color='white' onClick={() => setSideBar(false)} />
        )}{' '}
      </div>

      <div
        className={sideBar ? 'two' : 'three'}
        // onMouseOver={() => setSideBar(false)}
        style={{ height: '100%', overflowY: 'scroll' }}
      >
        <div style={{ width: '100%', boxSizing: 'border-box' }}>
          <Header path={path} />
        </div>
        <div
          style={{
            padding: '0.6rem',
            width: '100%',
            boxSizing: 'border-box',
          }}
        >
          {props.children}
        </div>
      </div>
    </div>
  )
}
