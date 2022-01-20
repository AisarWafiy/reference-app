import React from 'react'
import { Route } from 'react-router-dom'
import { SecureRoute } from '@okta/okta-react'
import Layout from 'components/Layout/Layout'
import Dashboard from 'components/Dashboard/Dashboard'
import DPTobaccoDeliveryReport from 'components/DPTobaccoDeliveryReport/DPTobaccoDeliveryReport'
import MaintainRole from 'components/MaintainRole/MaintainRole'
import MaintainReferenceData from '../components/MaintainReferenceData/MaintainReferenceData'
import CreateRole from 'components/CreateRole/CreateRole'
import CreateBinLocation from 'components/CreateBinLocation/CreateBinLocation'
import MaintainBinLocation from 'components/MaintainBinLocation/MaintainBinLocation'
import MaintainUser from 'components/MaintainUser/MaintainUser'
import CreateCarrier from 'components/CreateCarrier/CreateCarrier'
import MaintainCarrier from 'components/MaintainFlight/MaintainFlight'
import CreateCage from 'components/CreateCage/CreateCage'
import MaintainCage from 'components/MaintainCage/MaintainCage'
import UserNoScreens from 'components/Pages/UserNoScreens/UserNoScreens'
import MaintainBankAccount from 'components/MaintainBankAccount/MaintainBankAccount'
import MaintainMergePax from 'components/MaintainMergePax/MaintainMergePax'
import CreateTruck from 'components/CreateTruck/CreateTruck'
import MaintainTruck from 'components/MaintainTruck/MaintainTruck'
import AssignSeaBin from 'components/AssignSeaBin/AssignSeaBin'
import Notifications from 'components/Notifications/Notifications'
import ReleaseBags from 'components/ReleaseBags/ReleaseBags'
import AirportOverrideBagtracking from 'components/AirportOverrideBagtracking/AirportOverrideBagtracking'
import WarehouseOverrideBagtracking from 'components/WarehouseOverrideBagtracking/WarehouseOverrideBagtracking'
import DeliveryManifest from 'components/DeliveryManifest/DeliveryManifest'

import PickListGeneration from 'components/PickListGeneration/PickListGeneration'
import NACCSFileGeneration from 'components/NACCSFileGeneration/NACCSFileGeneration'
import NACCSPreview from 'components/NACCSPreview/NACCSPreview'
import NACCSDataEnquiry from 'components/NACCSDataEnquiry/NACCSDataEnquiry'
import NACCSFileStatusEnquiry from 'components/NACCSFileStatusEnquiry/NACCSFileStatusEnquiry'
import NACCSFileSummaryEnquiry from 'components/NACCSFileSummaryEnquiry/NACCSFileSummaryEnquiry'
import NACCSDailyGenListReport from 'components/NACCSDailyGenListReport/NACCSDailyGenListReport'
import StampDutyReport from 'components/StampDutyReport/StampDutyReport'
import BagTrackingEnquiry from 'components/BagTrackingEnquiry/bagTrackingEnquiry'
import BagStatusByFlight from 'components/BagStatusFlight/BagStatusFlight'
import CartonTrackingEnquiry from 'components/CartonTrackingEnquiry/CartonTrackingEnquiry'
import CageTrackingEnquiry from 'components/CageTrackingEnquiry/CageTrackingEnquiry'
import BagTrackingReports from 'components/BagTrackingReports/BagTrackingReports'
import BagTraxDailySummaryReport from 'components/BagTraxDailySummaryReport/BagTraxDailySummaryReport'
import PurchaseEnquiryBypax from 'components/PurchaseEnquiryByPax/PurchaseEnquiryByPax'
import BagTraxDeliveryReportByTrip from 'components/BagTraxDeliveryReportByTrip/BagTraxDeliveryReportByTrip'
import BagByBagStatusReport from 'components/BagByBagStatusReport/BagByBagStatusReport'
import BagsInPickUpCounterReport from 'components/BagsInPickupCounterReport/BagsInPickupCounterReport'
import ItemEnquiry from 'components/BagTrackingReports/ItemEnquiry/ItemEnquiry'
import Home from 'components/Pages/Homepage/Homepage'
import PAXFlightChangeNotification from 'components/PAXFlightChangeNotification/PAXFlightChangeNotification'
import CustomerRefundNotification from 'components/CustomerRefundNotification/CustomerRefundNotification'
import DPTobaccoExportReport from 'components/DPTobaccoExportReport/DPTobaccoExportReport'

const RenderComp = props => {
  const components = {
    Dashboard: Dashboard,
    MaintainRole: MaintainRole,
    CreateRole: CreateRole,
    MaintainReferenceData: MaintainReferenceData,
    CreateBinLocation: CreateBinLocation,
    MaintainBinLocation: MaintainBinLocation,
    MaintainUser: MaintainUser,
    CreateCarrier: CreateCarrier,
    MaintainCarrier: MaintainCarrier,
    CreateCage: CreateCage,
    MaintainCage: MaintainCage,
    UserNoScreens: UserNoScreens,
    DPTobaccoExportReport: DPTobaccoExportReport,
    MaintainBankAccount: MaintainBankAccount,
    MaintainMergePax: MaintainMergePax,
    CreateTruck: CreateTruck,
    MaintainTruck: MaintainTruck,
    AssignSeaBin: AssignSeaBin,
    Notifications: Notifications,
    ReleaseBags: ReleaseBags,
    AirportOverrideBagtracking: AirportOverrideBagtracking,
    WarehouseOverrideBagtracking: WarehouseOverrideBagtracking,
    DeliveryManifest: DeliveryManifest,
    DPTobaccoDeliveryReport: DPTobaccoDeliveryReport,
    PickListGeneration: PickListGeneration,
    NACCSFileGeneration: NACCSFileGeneration,
    NACCSPreview: NACCSPreview,
    NACCSFileStatusEnquiry: NACCSFileStatusEnquiry,
    NACCSFileSummaryEnquiry: NACCSFileSummaryEnquiry,
    NACCSDailyGenListReport: NACCSDailyGenListReport,
    NACCSDataEnquiry: NACCSDataEnquiry,
    StampDutyReport: StampDutyReport,
    BagTrackingEnquiry: BagTrackingEnquiry,
    BagStatusByFlight: BagStatusByFlight,
    CageTrackingEnquiry: CageTrackingEnquiry,
    CartonTrackingEnquiry: CartonTrackingEnquiry,
    BagTrackingReports: BagTrackingReports,
    BagTraxDailySummaryReport: BagTraxDailySummaryReport,
    PurchaseEnquiryBypax: PurchaseEnquiryBypax,
    BagTraxDeliveryReportByTrip: BagTraxDeliveryReportByTrip,
    BagByBagStatusReport: BagByBagStatusReport,
    BagsInPickUpCounterReport: BagsInPickUpCounterReport,
    ItemEnquiry: ItemEnquiry,
    Home: Home,
    PAXFlightChangeNotification: PAXFlightChangeNotification,
    CustomerRefundNotification: CustomerRefundNotification,
  }

  const TagName = components[props.tag]

  if (process.env.REACT_APP_LOGIN === 'OFF') {
    return (
      <Route
        path={props.path}
        exact={true}
        render={() => (
          <Layout>
            <TagName />
          </Layout>
        )}
      />
    )
  }

  return (
    <SecureRoute
      path={props.path}
      exact={true}
      render={() => (
        <Layout>
          <TagName />
        </Layout>
      )}
    />
  )
}

export default RenderComp
