import React from 'react'
import * as AiIcons from 'react-icons/ai'
import { useTranslation } from 'react-i18next'
function BreadCrumb({ path }) {
  const { t } = useTranslation()
  const formatString = str => {
    let a = str.replace(/-/g, '_')
    return a + '_label'
  }

  return (
    <div
      style={{
        background: '#161616',

        color: 'white',
        height: '40px',
        padding: '10px',
        fontSize: '0.8rem',
        // boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.09)'
      }}
    >
      <span style={{ paddingLeft: '16px' }}>
        <AiIcons.AiOutlineHome fontSize={'1rem'} style={{ marginBottom: '3px' }} />
      </span>

      {path.split('/').map((e, i, arr) =>
        e !== '' ? (
          <span
            key={i}
            style={{
              // padding: "2px",

              // marginTop: "2px",
              fontSize: 'small',
            }}
          >
            <span>&nbsp;&nbsp;{'>'} &nbsp;&nbsp;</span>
            {arr.length - 1 === i ? (
              <span style={{ backgroundColor: 'firebrick', borderRadius: '5px', padding: '4px' }}>
                {t(formatString(e).toString())}
              </span>
            ) : (
              <span> {t(formatString(e).toString())}</span>
            )}
          </span>
        ) : (
          ''
        ),
      )}
    </div>
  )
}

export default BreadCrumb
