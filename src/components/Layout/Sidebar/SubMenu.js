import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Translation } from 'react-i18next'
import { sideBarDataManipilated } from './SideBarData'

const StyledLink = styled(Link)`
  text-decoration: none;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }

  &:active {
    color: white;
  }
`

export default function SubMenu({ item, index, clicked, currentPath }) {
  const [subNav, setSubNav] = useState(false)
  const [path, setPath] = useState('')

  const showSubmenu = () => {
    setSubNav(!subNav)
  }

  useEffect(() => {
    if (path !== currentPath) setPath(currentPath)
  })

  let loginUserData = JSON.parse(localStorage.getItem('loginUserPermissionsData'))
  let sideBarDataManipilateddata = loginUserData ? sideBarDataManipilated.filter(x => loginUserData?.rolePerData?.pagePer?.findIndex(y => y.permissionName === x.subMenu) != -1) : []


  return (
    <>
      {sideBarDataManipilateddata?.find(x => x.menu === item.title) &&
        <>
          <li
            key={index}
            className='row'
            onClick={item.subNav && showSubmenu}
            style={{ cursor: 'pointer' }}
          >
            <div id='title'>  <Translation>{t => <div>{t(item.title)}</div>}</Translation></div>
            <div id='icon'>
              {item.subNav && subNav ? item.iconOpened : item.subNav ? item.iconClosed : null}
            </div>
          </li>
        </>}
      <div>
        {subNav &&
          item.subNav.map((val, key) =>
          (
            loginUserData && loginUserData.rolePerData.pagePer.map(x => {

              if (x.permissionName == val.title)
                return <StyledLink to={val.path} style={{ textDecoration: 'none' }} key={key}>
                  <li className='row'>
                    <div id='title'>
                      <div
                        className={`${val.path === path ? 'active' : 'inactive'}`}
                        style={{
                          width: '95%',
                          paddingLeft: '8px',
                        }}
                      >
                        <span
                          style={{
                            paddingLeft: '8px',
                          }}
                        >
                          <Translation>{t => <p>{t(val.title)}</p>}</Translation>
                        </span>
                      </div>
                    </div>
                  </li>
                </StyledLink>
            })
          )

          )}
      </div>
    </>
  )
}
