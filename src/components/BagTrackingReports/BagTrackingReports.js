import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import * as labels from 'constants/labels'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import { reportActions } from 'actions/report.actions'
import { alertActions } from 'actions/alert.actions'
import { Dropdown } from 'components/UI/Input'

import BinLocationTrackingEnquiry from 'components/BagTrackingReports/BinLocationTrackingEnquiry/BinLocationTrackingEnquiry'
import PaxDFPurchaseEnquiry from 'components/BagTrackingReports/PaxDFPurchaseEnquiry/PaxDFPurchaseEnquiry'
import PaxDPPurchaseEnquiry from 'components/BagTrackingReports/PaxDPPurchaseEnquiry/PaxDPPurchaseEnquiry'
import ItemEnquiry from 'components/BagTrackingReports/ItemEnquiry/ItemEnquiry'
import BagTrackingEnquiry from 'components/BagTrackingEnquiry/bagTrackingEnquiry'
import BagStatusByFlight from 'components/BagStatusFlight/BagStatusFlight'
import CartonTrackingEnquiry from 'components/CartonTrackingEnquiry/CartonTrackingEnquiry'
import CageTrackingEnquiry from 'components/CageTrackingEnquiry/CageTrackingEnquiry'
import BagTraxDailySummaryReport from 'components/BagTraxDailySummaryReport/BagTraxDailySummaryReport'
import PurchaseEnquiryByPax from 'components/PurchaseEnquiryByPax/PurchaseEnquiryByPax'
import BagTraxDeliveryReportByTrip from 'components/BagTraxDeliveryReportByTrip/BagTraxDeliveryReportByTrip'
import BagByBagStatusReport from 'components/BagByBagStatusReport/BagByBagStatusReport'

const BagTrackingReports = props => {
  const { showAlertSuccess, showAlertError } = props

  const [screenList, setScreenList] = useState([
    { id: 1, name: 'Bin Location Tracking Enquiry' },
    { id: 2, name: 'PAX DF Purchase Enquiry' },
    { id: 3, name: 'PAX DP Purchase Enquiry' },
    { id: 4, name: 'Item Enquiry' },
    { id: 5, name: 'BagTracking Enquiry' },
    { id: 6, name: 'Bag Status By Flight' },
    { id: 7, name: 'Carton Tracking Enquiry' },
    { id: 8, name: 'Cage Tracking Enquiry' },
    { id: 9, name: 'BagTrax Daily Summary Report' },
    { id: 10, name: 'Purchase Enquiry By Pax' },
    { id: 11, name: 'BagTrax Delivery Report By Trip' },
    { id: 12, name: 'Bag By Bag Status Report' },
  ])
  const [currentScreen, setCurrentScreen] = useState('')
  const { t } = useTranslation()
  useEffect(() => {
    if (currentScreen) {
      props.report(currentScreen)
    }
  }, [currentScreen])

  useEffect(() => {
    if (props.reportData && props.reportData !== null) {
      setCurrentScreen(props.reportData)
    }
  }, [props.reportData])
  const onChange = val => {
    setCurrentScreen(val)
  }
  return (
    <div className='ml-4 mt-4 mr-3 bg-white'>
      <h1 className='mb-4 mt-5'>{t('Bag_Tracking_Reports_label')}</h1>

      <div className='row mb-4'>
        <div className='col-6'>
          <Dropdown
            placeholder={t('Select_Report_Type_label')}
            closeMenuOnSelect={true}
            value={currentScreen}
            onChange={val => onChange(val)}
            options={screenList}
            optionLabel='name'
            optionValue='name'
          />
        </div>
      </div>

      <div className='row'>
        <div className='col'>
          {currentScreen && currentScreen.id === 1 && <BinLocationTrackingEnquiry />}
          {currentScreen && currentScreen.id === 2 && <PaxDFPurchaseEnquiry />}
          {currentScreen && currentScreen.id === 3 && <PaxDPPurchaseEnquiry />}
          {currentScreen && currentScreen.id === 4 && <ItemEnquiry NoTitle={true} />}
          {currentScreen && currentScreen.id === 5 && <BagTrackingEnquiry NoTitle={true} />}
          {currentScreen && currentScreen.id === 6 && <BagStatusByFlight NoTitle={true} />}
          {currentScreen && currentScreen.id === 7 && <CartonTrackingEnquiry NoTitle={true} />}
          {currentScreen && currentScreen.id === 8 && <CageTrackingEnquiry NoTitle={true} />}
          {currentScreen && currentScreen.id === 9 && <BagTraxDailySummaryReport NoTitle={true} />}
          {currentScreen && currentScreen.id === 10 && <PurchaseEnquiryByPax NoTitle={true} />}
          {currentScreen && currentScreen.id === 11 && (
            <BagTraxDeliveryReportByTrip NoTitle={true} />
          )}
          {currentScreen && currentScreen.id === 12 && <BagByBagStatusReport NoTitle={true} />}
        </div>
      </div>
    </div>
  )
}

function mapState(state) {
  return {
    reportData: state.reportsuccess,
  }
}
const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  report: data => dispatch(reportActions.reportsuccess(data)),
})

export default connect(mapState, mapDispatchToProps)(BagTrackingReports)
