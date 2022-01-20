import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import workflow from 'reducers/reducer-workflow'
import rolesReducer from 'reducers/reducer-roles'
import binLocationReducer from 'reducers/reducer-bin-location'
import { linksuccess } from 'reducers/link.reducers'
import { bellFLight, bellRefund } from 'reducers/bell.reducers'
import { itemEnquirySuccess } from 'reducers/itemEnquiry.reducers'
import { binLocTrackingEnqirySuccess } from 'reducers/binLocationTrackingEnquiry.reducers'
import { paxDPPurchaseEnqirySuccess } from 'reducers/paxDPPurchaseEnquiry.reducers'
import { paxDFPurchaseEnqirySuccess } from 'reducers/paxDFPurchaseEnquiry.reducers'
import dashboardReducer from 'reducers/reducer-dashboard'
import bankReducer from 'reducers/reducer-bank'
import truckReducer from 'reducers/reducer-truck'
import mergePaxReducer from 'reducers/reducer-merge-pax'
import naccsReducer from 'reducers/reducer-naccs'
import { getRef, postRef, getRefAll, getMasterRef } from './maintainReferenceData.reducers'
import { getUser, postUser, getRole } from './maintainUser.reducers'
import { getPax, mergePax, getCarr } from './mergePax.reducers'
import { getTruckNumber, getSeaBinTruck } from './truckNumber.reducers'
import { assignSeaBin } from './assignSeaBin.reducers'
import { bagtrackWarehouse, bagtrackAirport } from './overrideBagtracking.reducers'
import { postCage, getCage, getAllCage, deleteCage, updateCage } from './cage.reducers'
import { getBags, releaseBags } from './releaseBags.reducers'
import { getPicklist, printPicklist, getDrop } from './picklist.reducers'
import { getstampDuty, getMonth, getLocationId } from './stampDuty.reducers'
import { getCartonNumber, getCartonTrackingEnquiry } from 'reducers/cartonTrackingEnquiry.reducers'
import { getBagTrackingEnquiry } from 'reducers/bagTrackingEnquiry.reducers'
import { getCageTrackingEnquiry } from 'reducers/cageTrackingEnquiry.reducers'
import {
  getBagTraxDailySummaryReport,
  bagTraxDailyFormValue,
} from 'reducers/bagTraxDailySummaryReport.reducers'
import {
  getBagTraxDeliveryReportByTrip,
  bagTraxDeliveryReportFormValue,
} from 'reducers/bagTraxDeliveryReportByTrip.reducers'
import {
  getBagByBagStatusReport,
  getBagStatus,
  bagByBagStatusReportFormValue,
} from 'reducers/bagByBagStatusReport.reducers'
import {
  getDPTobaccoDeliveryReport,
  getDPTobaccoExportReport,
} from 'reducers/dpTobaccoReport.reducers'
import {
  getBagsInPickupCounterReport,
  getLocation,
} from 'reducers/bagsInPickupCounterReport.reducers'
import {
  getBagStatusFlight,
  getCarrierCode,
  formValueBagStatusFlight,
} from 'reducers/bagStatusFlight.reducers'
import { getPurchaseEnquiryByPax } from 'reducers/purchaseEnquiryByPax.reducers'
import { reportsuccess } from 'reducers/report.reducers'
import {
  getAllCarrier,
  getCarrierStatus,
  postCarrier,
  maintainCarrier,
  postFilterCarrier,
  updateSellOff,
} from 'reducers/carrier.reducers'
import notifyReducer from './notifyReducer'
import alertModalReducer from './alertModal.reducers'

const reducers = history =>
  combineReducers({
    router: connectRouter(history),
    workflow,
    bagtrackWarehouse,
    reportsuccess,
    itemEnquirySuccess,
    binLocTrackingEnqirySuccess,
    paxDPPurchaseEnqirySuccess,
    paxDFPurchaseEnqirySuccess,
    formValueBagStatusFlight,
    bagByBagStatusReportFormValue,
    bagTraxDeliveryReportFormValue,
    updateSellOff,
    bellFLight,
    bellRefund,
    bagTraxDailyFormValue,
    linksuccess,
    getBagStatusFlight,
    getCarrierCode,
    getBagsInPickupCounterReport,
    getLocation,
    getDPTobaccoDeliveryReport,
    getstampDuty,
    getMonth,
    getBagByBagStatusReport,
    getBagStatus,
    getRefAll,
    getLocationId,
    getDrop,
    bagtrackAirport,
    getBagTraxDailySummaryReport,
    getCartonNumber,
    getBagTraxDeliveryReportByTrip,
    getBagTrackingEnquiry,
    getCartonTrackingEnquiry,
    getPicklist,
    getSeaBinTruck,
    printPicklist,
    mergePax,
    getCarr,
    getBags,
    releaseBags,
    getTruckNumber,
    assignSeaBin,
    rolesReducer,
    getPax,
    postCarrier,
    postFilterCarrier,
    maintainCarrier,
    getRole,
    getAllCarrier,
    getCarrierStatus,
    getRef,
    postRef,
    updateCage,
    getUser,
    postCage,
    postUser,
    getMasterRef,
    binLocationReducer,
    getCage,
    getAllCage,
    deleteCage,
    notification: notifyReducer,
    dashboardReducer,
    bankReducer,
    truckReducer,
    mergePaxReducer,
    getCageTrackingEnquiry,
    getPurchaseEnquiryByPax,
    naccsReducer,
    getDPTobaccoExportReport,
    alertModalReducer,
  })

export default reducers
