import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
// import setCarrierStatus from 'actions/link.actions'
import { linkActions } from 'actions/link.actions'
import { connect } from 'react-redux'
import '../dashboard.css'

const FlightsPanel = (props) => {
  const { t } = useTranslation()
  let carrierStatus = useSelector(state => state?.dashboardReducer?.dashboardData)?.carrierStatus

  const history = useHistory()
  const redirectToMergeCarrier = async () =>
    history.push('/Administration/Carrier/Maintain-Carrier')

  const redirectLink = displayStatus => {
    // setDepartureDate(depDate)
    // const carrierData = {
    //   statusDesc: displayStatus,
    // }
    props.link({ statusDesc: displayStatus })
    // linkActions.linksuccess({ statusDesc: carrierData.displayStatus })
    redirectToMergeCarrier()
  }
  return (
    <>
      {carrierStatus &&

        <div className='row'>
          {carrierStatus.map((eachCarrierStatus, i) => (
            <div className='col' key={i}>

              <div className='h6 '>{eachCarrierStatus.displayStatus}</div>
              {/* style={{ 'textDecoration': 'underline' }} */}
              <div className='h3 ml-3 mt-3'>
                <div className={eachCarrierStatus.status == 'DP' ? 'text-success' : eachCarrierStatus.status == 'CN' ? 'text-danger' : eachCarrierStatus.status == 'DL' ? 'text-warning' : 'text-info'}>
                  <strong><span className='textcss' onClick={() => redirectLink(eachCarrierStatus.status == 'DP' ? 'Departed' : eachCarrierStatus.status == 'CN' ? 'Canceled' : eachCarrierStatus.status == 'DL' ? 'Delayed' : 'Scheduled')}>{eachCarrierStatus.count}
                  </span></strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      }
      {!carrierStatus && <h6 className='mt-2 text-center'>{t('No data Found')}</h6>}
    </>
  )
}

function mapState(state) {
  return {}
}

const actionCreators = {
  link: linkActions.linksuccess,
}
export default connect(mapState, actionCreators)(FlightsPanel)
