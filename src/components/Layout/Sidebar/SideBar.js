import React, { useState, useEffect } from 'react'
import './SideBarStyle.css'
import { useTranslation } from 'react-i18next'
import {
  AdministrationSidebarData,
  BagTrackingSidebarData,
  CustomsSidebarData,
  sideBarDataManipilated
} from './SideBarData'
import { AiOutlineHome } from 'react-icons/ai'
import { IoBagOutline, IoFolderOutline } from 'react-icons/io5'
import { FiCommand } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import SubMenu from './SubMenu'
import styled from 'styled-components'

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

function SideBar({ currentPath }) {

  const [path, setPath] = useState('')
  const { t } = useTranslation()
  const [filteredSideBarDataFromResponse, setfilteredSideBarDataFromResponse] = useState()
  const [loginUserData, setloginUserData] = useState()


  let interval

  useEffect(() => {
    if (path !== currentPath) {
      setPath(currentPath)
    }

  })

  useEffect(() => {
    if (!loginUserData) {
      interval = setInterval(() => {
        let loginUserData = JSON.parse(localStorage.getItem('loginUserPermissionsData'))
        setloginUserData(loginUserData)
        if (loginUserData && !filteredSideBarDataFromResponse) {
          let data = loginUserData && sideBarDataManipilated.filter(x => loginUserData?.rolePerData?.pagePer?.findIndex(y => y.permissionName === x.subMenu) != -1)
          setfilteredSideBarDataFromResponse(data)
        }
      }, 10)
    }
    return () => clearInterval(interval)
  }, [loginUserData, filteredSideBarDataFromResponse])


  return (
    <div className='wrapper'>
      <div className='sidebar'>
        <ul className='sidebarList'>
          <li className='row'>
            <div id='icon1'>
              <AiOutlineHome style={{ marginBottom: '3px' }} />
            </div>
            <StyledLink id='title1' to='/home'>
              {t('Home_label')}
            </StyledLink>
          </li>
          {filteredSideBarDataFromResponse?.find(x => x.mainMenu === "Customs Home") && <li className='row'>
            <StyledLink id='title1' to='/customshome'>
              <span
                style={{
                  paddingLeft: '8px',
                }}
              >
                {t('CustomsHome_label')}

              </span>
            </StyledLink>
          </li>}
          <hr
            style={{
              width: '90%',
              color: 'whitesmoke',
              borderTop: '1px solid #cccccc',
            }}
          />
          {filteredSideBarDataFromResponse?.find(x => x.mainMenu === "administration") &&
            <>
              <li className='row'>
                <div id='icon1'>
                  <FiCommand style={{ marginBottom: '3px' }} />
                </div>
                <div id='title1'>{t('ADMINISTRATION_label')}</div>
              </li>

              {AdministrationSidebarData.map((val, key) => (
                <SubMenu key={key} item={val} index={key} currentPath={path} />
              ))}

              <hr
                style={{
                  textAlign: 'start',
                  width: '90%',
                  borderTop: '1px solid #cccccc',
                }}
              />
            </>}
          {filteredSideBarDataFromResponse?.find(x => x.mainMenu === "customs") &&
            <>
              <li className='row'>
                <div id='icon1'>
                  <IoFolderOutline style={{ marginBottom: '3px' }} />
                </div>

                <div id='title1'>{t('CUSTOMS_label')}</div>
              </li>
              {CustomsSidebarData.map((val, key) => (
                <SubMenu key={key} item={val} index={key} currentPath={path} />
              ))}
              <hr
                style={{
                  width: '90%',
                  color: 'white',
                  borderTop: '1px solid #cccccc',
                }}
              />
            </>}
          {filteredSideBarDataFromResponse?.find(x => x.mainMenu === "bag tracking") &&
            <>
              <li className='row'>
                <div id='icon1'>
                  <IoBagOutline style={{ marginBottom: '3px' }} />
                </div>
                <div id='title1'>{t('BAG_TRACKING_label')}</div>
              </li>
              {BagTrackingSidebarData.map((val, key) => (
                <SubMenu key={key} item={val} index={key} currentPath={path} />
              ))}
            </>}
        </ul>
      </div>
    </div>
  )
}

export default React.memo(SideBar)
