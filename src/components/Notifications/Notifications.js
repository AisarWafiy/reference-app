import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Moment from 'moment'
import _ from 'lodash'
import axios from 'axios'
import { bellActions } from 'actions/bell.actions'
import { useTranslation } from 'react-i18next'
import {
  setNotificationType,
  setActionType,
  setFlightAlerts,
  setRefundAlerts,
  setBellCount,
} from 'actions/action-dashboard'
import { alertActions } from 'actions/alert.actions'
import DatePicker from 'react-datepicker'
import * as labels from 'constants/labels'

import { AgGridReact } from '@ag-grid-community/react'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import NotificationPanel from './NotificationPanel/NotificationPanel'
import Loader from 'react-loader-spinner'

import { Dropdown } from 'components/UI/Input'

const notificationTypeOptions = [
  { id: 1, name: 'Flight Change Alerts' },
  { id: 2, name: 'Refund Alerts' },
]

const actionTypeOptions = [
  { id: 1, name: 'Y' },
  { id: 2, name: 'N' },
]

const Notifications = props => {
  const { t } = useTranslation()
  const {
    showAlertSuccess,
    showAlertError,
    showAlertWarn,
    setNotificationType,
    setActionType,
    notificationType,
    actionType,
    setFlightAlerts,
    setRefundAlerts,
    setBellCount,
    flightChangeAlertCount,
    refundChangeAlertCount,
  } = props

  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!notificationType?.name || !actionType?.name) {
      setNotificationType(notificationTypeOptions[0])
      setActionType(actionTypeOptions[1])
      formik.setFieldValue('actionType', actionTypeOptions[1], true)
    } else {
      formik.setFieldValue('actionType', actionType, true)
    }
  }, [])

  const [rowData, setRowData] = useState([])

  const flightColumnDefs = [
    {
      headerName: t('Edit_Action_label'),
      field: 'action',
      lockPosition: true,
      cellRenderer: params =>
        params.node.data.actionTaken === actionTypeOptions[0].name
          ? `<span>Not Applicable</span>`
          : actionCellRenderer(params),
      editable: false,
      colId: 'action',
      width: 125,
      sortable: false,
      suppressMenu: true,
    },
    {
      headerName: t('Pax_Number_label'),
      field: 'paxNumber',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 120,
    },

    {
      headerName: t('Bag_Number_label'),
      field: 'bagNumber',
      sortable: true,
      lockPosition: true,
      filter: true,
      width: 130,
    },

    {
      headerName: t('BAG_STATUS_POSITION_label'),
      field: 'bagStatusPos',

      sortable: true,
      filter: true,
      lockPosition: true,
      width: 290,
    },
    {
      headerName: t('Flight_Number/From_Date_label'),
      field: 'flightNoFromDate',
      sortable: true,
      filter: true,
      width: 190,
      lockPosition: true,
    },
    {
      headerName: t('Flight_Number/To_Date_label'),
      field: 'flightNoToDate',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 190,
    },
    {
      headerName: t('ACTION_TAKEN_label'),
      field: 'actionTaken',
      sortable: true,

      filter: true,
      width: 120,
    },
    {
      headerName: t('ACTION_BY_label'),
      field: 'actionBy',
      sortable: true,
      filter: true,

      width: 120,
    },
  ]
  const refundColumnDefs = [
    {
      headerName: t('Edit_Action_label'),
      field: 'action',
      lockPosition: true,
      cellRenderer: params =>
        params.node.data.actionTaken === actionTypeOptions[0].name
          ? `<span>Not Applicable</span>`
          : actionCellRenderer(params),
      editable: false,
      colId: 'action',
      width: 125,
      sortable: false,
      suppressMenu: true,
    },
    {
      headerName: t('Pax_Number_label'),
      field: 'paxNumber',
      sortable: true,
      lockPosition: true,
      filter: true,
      width: 120,
    },

    {
      headerName: t('Bag_Number_label'),
      field: 'bagNumber',
      lockPosition: true,
      sortable: true,
      filter: true,
      width: 130,
    },

    {
      headerName: t('BAG_STATUS_POSITION_label'),
      field: 'bagStatusPos',

      sortable: true,
      filter: true,
      width: 400,
      lockPosition: true,
    },
    {
      headerName: t('REFUND_DATETIME_label'),
      field: 'refundDateTime',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 220,
    },
    {
      headerName: t('ACTION_TAKEN_label'),
      field: 'actionTaken',
      sortable: true,

      filter: true,
      width: 140,
      // cellRenderer: params => {
      //   if (params.node.data.actionTaken === 'Y') {
      //     return 'Refunded'
      //   } else {
      //     return 'Not Refunded'
      //   }
      // },
    },
    {
      headerName: t('ACTION_BY_label'),
      field: 'actionBy',
      sortable: true,
      filter: true,
      width: 160,
    },
  ]
  const defaultColDef = {
    width: 125,
    sortable: true,
    wrapText: true,
    resizable: true,
    cellStyle: rowStyle,
  }
  const frameworkComponents = {}

  const actionCellRenderer = params => {
    let divElement = document.createElement('div')
    divElement.onclick = () => onCellClicked(params)

    divElement.innerHTML = `
  <button data-action="edit" class="edit-option"> Take Action </button>
  `

    return divElement
  }
  const dateEdit = value => {
    let a = value.split(' ')
    return a[0]
  }
  const notifications = () => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/countFlightChangeAlerts')
      .then(response => {
        const getData = response.data.result
        setFlightAlerts(getData)
        props.setBellFlight(getData)
      })
      .catch(err => {
        if (err.response.data.error === 'E-0220') {
          props.setBellFlight(0)
        } else {
          props.setBellFlight(0)
        }
      })

    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/countRefundAlerts')
      .then(response => {
        const getData = response.data.result
        setRefundAlerts(getData)
        props.setBellRefund(getData)
      })
      .catch(err => {
        if (err.response.data.error === 'E-0219') {
          props.setBellRefund(0)
        } else {
          props.setBellRefund(0)
        }
      })
  }
  const onCellClicked = params => {
    let postData
    console.log(params.node.data)
    // flight alerts
    if (_.isEqual(notificationType, notificationTypeOptions[0])) {
      postData = {
        flightChangeBagId: params.node.data.flightChangeBagId,
        carrierChangeSeqId: params.node.data.carrierChangeSeqId,
        paxNo: params.node.data.paxNumber,
        bagNo: params.node.data.bagNumber,
        flightChangeAction: 'Y',
      }
      setLoading(true)
      axios
        .post(process.env.REACT_APP_SERVER_URI + '/api/flightChangeAlerts', postData)
        .then(response => {
          showAlertSuccess(response.data.message, 'editing Flight Change Alerts')
          const getData = response

          axios
            .post(process.env.REACT_APP_SERVER_URI + '/api/flightChangeAlerts', {
              flightChangeAction: actionType.name,
              from: formik.values.startDate && Moment(formik.values.startDate).format('YYYY-MM-DD'),
              to: formik.values.endDate && Moment(formik.values.endDate).format('YYYY-MM-DD'),
            })
            .then(response => {
              const getData = response.data.result
              notifications()
              if (getData.length < 1) {
                setRowData([])
                setFlightAlerts(0)
              } else {
                const newRowData = []
                getData.forEach((getDataItem, index) => {
                  newRowData.push({
                    flightNoFromDate:
                      getDataItem.fromDepAirlineRefValue +
                      ' ' +
                      getDataItem.fromDepCarrierNumber +
                      ' ' +
                      dateEdit(getDataItem.fromDepartureTm),
                    flightNoToDate:
                      getDataItem.toDepAirlineRefValue +
                      ' ' +
                      getDataItem.toDepCarrierNumber +
                      ' ' +
                      dateEdit(getDataItem.toDepartureTm),
                    actionTaken: getDataItem.flightChangeAction,
                    actionBy: getDataItem.actionBy && getDataItem.actionBy,
                    paxNumber: getDataItem.paxNo,
                    bagNumber: getDataItem.bagNo,
                    flightChangeBagId: getDataItem.flightChangeBagId,
                    carrierChangeSeqId: getDataItem.carrierChangeSeqId,
                    bagStatusPos:
                      (getDataItem.bagStatus !== null ? 'Status: ' + getDataItem.bagStatus : '') +
                      ' ' +
                      (getDataItem.cartonNumber !== null
                        ? ', Carton No: ' + getDataItem.cartonNumber
                        : '') +
                      (getDataItem.whBinLocId !== null
                        ? ', WH Bin No: ' + getDataItem.whBinLocId
                        : '') +
                      (getDataItem.cageNo !== null ? ', Cage No: ' + getDataItem.cageNo : '') +
                      (getDataItem.truckNo !== null ? ', Truck No: ' + getDataItem.truckNo : '') +
                      (getDataItem.apBinLocId !== null
                        ? ', AP Bin No: ' + getDataItem.apBinLocId
                        : ''),
                  })
                })
                setRowData(newRowData)
                setFlightAlerts(newRowData.length)
              }
            })
            .catch(err => {
              setRowData([])
              if (err.response.data.error === 'E-0220') {
                setFlightAlerts(0)
              } else if (err.response.data.error && !err.response.data.record)
                showAlertError(err.response.data.error, 'fetching Refund Alerts')
              else if (err.response.data.error && err.response.data.record)
                showAlertError(err.response.data.record, 'fetching Refund Alerts')
              else if (err.response.data.warning)
                showAlertWarn(err.response.data.warning, 'fetching Refund Alerts')
              else showAlertError('Internal Server Error')
            })
          setLoading(false)
        })
        .catch(err => {
          setLoading(false)
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'editing Flight Change Alerts')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'editing Flight Change Alerts')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'editing Flight Change Alerts')
          else showAlertError('Internal Server Error')
        })
    }

    // refund alerts
    if (_.isEqual(notificationType, notificationTypeOptions[1])) {
      postData = {
        bagNo: params.node.data.bagNumber,
        actionTaken: 'Y',
      }
      setLoading(true)

      axios
        .post(process.env.REACT_APP_SERVER_URI + '/api/refundAlerts', postData)
        .then(response => {
          showAlertSuccess(response.data.message, 'editing Refund Alerts')
          const getData = response

          axios
            .post(process.env.REACT_APP_SERVER_URI + '/api/refundAlerts', {
              actionTaken: actionType.name,
              from: formik.values.startDate && Moment(formik.values.startDate).format('YYYY-MM-DD'),
              to: formik.values.endDate && Moment(formik.values.endDate).format('YYYY-MM-DD'),
            })
            .then(response => {
              const getData = response.data.result
              notifications()
              if (getData.length < 1) {
                setRowData([])
                setRefundAlerts(0)
              } else {
                const newRowData = []
                getData.forEach((getDataItem, index) => {
                  newRowData.push({
                    // paxSeqId: getDataItem.paxSeqId,
                    actionTaken: getDataItem.actionTaken,
                    actionBy: getDataItem.actionBy && getDataItem.actionBy,
                    paxNumber: getDataItem.paxNo,
                    bagNumber: getDataItem.bagNo,
                    bagStatusPos:
                      (getDataItem.bagStatus !== null ? 'Status: ' + getDataItem.bagStatus : '') +
                      ' ' +
                      (getDataItem.cartonNumber !== null
                        ? ', Carton No: ' + getDataItem.cartonNumber
                        : '') +
                      (getDataItem.whBinLocId !== null
                        ? ', WH Bin No: ' + getDataItem.whBinLocId
                        : '') +
                      (getDataItem.cageNo !== null ? ', Cage No: ' + getDataItem.cageNo : '') +
                      (getDataItem.truckNo !== null ? ', Truck No: ' + getDataItem.truckNo : '') +
                      (getDataItem.apBinLocId !== null
                        ? ', AP Bin No: ' + getDataItem.apBinLocId
                        : ''),
                    refundDateTime: getDataItem.refundTm,
                  })
                })
                setRowData(newRowData)
                setRefundAlerts(newRowData.length)
              }
              setLoading(false)
            })
            .catch(err => {
              setRowData([])
              setLoading(false)

              if (err.response.data.error === 'E-0219') {
                setRefundAlerts(0)
              } else if (err.response.data.error && !err.response.data.record)
                showAlertError(err.response.data.error, 'fetching Refund Alerts')
              else if (err.response.data.error && err.response.data.record)
                showAlertError(err.response.data.record, 'fetching Refund Alerts')
              else if (err.response.data.warning)
                showAlertWarn(err.response.data.warning, 'fetching Refund Alerts')
              else showAlertError('Internal Server Error')
            })
        })
        .catch(err => {
          setLoading(false)
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'editing Refund Alerts')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'editing Refund Alerts')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'editing Refund Alerts')
          else showAlertError('Internal Server Error')
        })
    }
  }

  const onGridReady = params => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const formik = useFormik({
    initialValues: { actionType: actionType },
    validationSchema: Yup.object({
      startDate: Yup.date()
        .when(`actionType`, {
          is: actionType => _.isEqual(actionType, actionTypeOptions[0]),
          then: Yup.date().required('Please enter a date range'),
        })
        .nullable(),
      endDate: Yup.date()
        .when(`actionType`, {
          is: actionType => _.isEqual(actionType, actionTypeOptions[0]),
          then: Yup.date()
            .required('Please enter a date range')
            .typeError('Please enter a date range'),
        })
        .typeError('Please enter a date range')
        .nullable(),
      actionType: Yup.object().required(),
    }),
    onSubmit: values => {
      setRowData([])
      let postData

      // flight alerts
      if (_.isEqual(notificationType, notificationTypeOptions[0])) {
        postData = {
          flightChangeAction: actionType.name,
          from: values.startDate && Moment(values.startDate).format('YYYY-MM-DD'),
          to: values.endDate && Moment(values.endDate).format('YYYY-MM-DD'),
        }
        setLoading(true)

        axios
          .post(process.env.REACT_APP_SERVER_URI + '/api/flightChangeAlerts', postData)
          .then(response => {
            showAlertSuccess(response.data.message, 'fetching Flight Change Alerts')
            const getData = response.data.result

            const newRowData = []
            getData.forEach((getDataItem, index) => {
              newRowData.push({
                flightChangeBagId: getDataItem.flightChangeBagId,
                flightNoFromDate:
                  getDataItem.fromDepAirlineRefValue +
                  ' ' +
                  getDataItem.fromDepCarrierNumber +
                  ' ' +
                  dateEdit(getDataItem.fromDepartureTm),
                flightNoToDate:
                  getDataItem.toDepAirlineRefValue +
                  ' ' +
                  getDataItem.toDepCarrierNumber +
                  ' ' +
                  dateEdit(getDataItem.toDepartureTm),
                actionTaken: getDataItem.flightChangeAction,
                actionBy: getDataItem.actionBy && getDataItem.actionBy,
                paxNumber: getDataItem.paxNo,
                bagNumber: getDataItem.bagNo,

                carrierChangeSeqId: getDataItem.carrierChangeSeqId,
                bagStatusPos:
                  (getDataItem.bagStatus !== null ? 'Status: ' + getDataItem.bagStatus : '') +
                  ' ' +
                  (getDataItem.cartonNumber !== null
                    ? ', Carton No: ' + getDataItem.cartonNumber
                    : '') +
                  (getDataItem.whBinLocId !== null
                    ? ', WH Bin No: ' + getDataItem.whBinLocId
                    : '') +
                  (getDataItem.cageNo !== null ? ', Cage No: ' + getDataItem.cageNo : '') +
                  (getDataItem.truckNo !== null ? ', Truck No: ' + getDataItem.truckNo : '') +
                  (getDataItem.apBinLocId !== null ? ', AP Bin No: ' + getDataItem.apBinLocId : ''),
                // refundDateTime: getDataItem.submittedTm,
              })
            })
            setFlightAlerts(newRowData.length)
            setRowData(newRowData)
            setLoading(false)
          })
          .catch(err => {
            setLoading(false)
            if (err.response.data.error && !err.response.data.record)
              showAlertError(err.response.data.error, 'fetching Flight Change Alerts')
            else if (err.response.data.error && err.response.data.record)
              showAlertError(err.response.data.record, 'fetching Flight Change Alerts')
            else if (err.response.data.warning)
              showAlertWarn(err.response.data.warning, 'fetching Flight Change Alerts')
            else showAlertError('Internal Server Error')

            if (err.response.data.error === 'E-0220') {
              setFlightAlerts(0)
            }
          })
      }

      // refund alerts
      if (_.isEqual(notificationType, notificationTypeOptions[1])) {
        postData = {
          actionTaken: actionType.name,
          from: values.startDate && Moment(values.startDate).format('YYYY-MM-DD'),
          to: values.endDate && Moment(values.endDate).format('YYYY-MM-DD'),
        }
        setLoading(true)

        axios
          .post(process.env.REACT_APP_SERVER_URI + '/api/refundAlerts', postData)
          .then(response => {
            showAlertSuccess(response.data.message, 'fetching Refund Alerts')
            const getData = response.data.result
            const newRowData = []
            getData.forEach((getDataItem, index) => {
              newRowData.push({
                // paxSeqId: getDataItem.paxSeqId,
                actionTaken: getDataItem.actionTaken,
                actionBy: getDataItem.actionBy && getDataItem.actionBy,
                paxNumber: getDataItem.paxNo,
                bagNumber: getDataItem.bagNo,
                bagStatusPos:
                  (getDataItem.bagStatus !== null ? 'Status: ' + getDataItem.bagStatus : '') +
                  ' ' +
                  (getDataItem.cartonNumber !== null
                    ? ', Carton No: ' + getDataItem.cartonNumber
                    : '') +
                  (getDataItem.whBinLocId !== null
                    ? ', WH Bin No: ' + getDataItem.whBinLocId
                    : '') +
                  (getDataItem.cageNo !== null ? ', Cage No: ' + getDataItem.cageNo : '') +
                  (getDataItem.truckNo !== null ? ', Truck No: ' + getDataItem.truckNo : '') +
                  (getDataItem.apBinLocId !== null ? ', AP Bin No: ' + getDataItem.apBinLocId : ''),
                refundDateTime: getDataItem.refundTm,
              })
            })
            setRefundAlerts(newRowData.length)
            setRowData(newRowData)
            setLoading(false)
          })
          .catch(err => {
            setLoading(false)
            if (err.response.data.error && !err.response.data.record)
              showAlertError(err.response.data.error, 'fetching Refund Alerts')
            else if (err.response.data.error && err.response.data.record)
              showAlertError(err.response.data.record, 'fetching Refund Alerts')
            else if (err.response.data.warning)
              showAlertWarn(err.response.data.warning, 'fetching Refund Alerts')
            else showAlertError('Internal Server Error')

            if (err.response.data.error === 'E-0219') {
              setRefundAlerts(0)
            }
          })
      }
    },
  })

  const handleDate = dates => {
    const [start, end] = dates
    formik.setFieldValue('startDate', start, true)
    formik.setFieldValue('endDate', end, true)

    formik.setSubmitting(false)
  }

  const handleActionChange = value => {
    setActionType(value)
    formik.setFieldValue('actionType', value, true)
  }

  const handleNotificationChange = value => {
    if (!_.isEqual(notificationType, value)) {
      setRowData([])
    }
    setNotificationType(value)
  }

  const handleCancel = () => {
    formik.resetForm()
    formik.setFieldValue('startDate', null, false)
    formik.setFieldValue('endDate', null, false)
    formik.setFieldValue('actionType', null, false)
    setActionType(null)
    setNotificationType(null)

    setRowData([])
  }

  const formatDate = (dateOne, dateTwo) => {
    if (dateOne && dateTwo) {
      const strOne =
        dateOne.getFullYear() +
        '-' +
        (dateOne.getMonth() + 1 < 10 ? '0' + (dateOne.getMonth() + 1) : dateOne.getMonth() + 1) +
        '-' +
        (dateOne.getDate() < 10 ? '0' + dateOne.getDate() : dateOne.getDate())

      const strTwo =
        dateTwo.getFullYear() +
        '-' +
        (dateTwo.getMonth() + 1 < 10 ? '0' + (dateTwo.getMonth() + 1) : dateTwo.getMonth() + 1) +
        '-' +
        (dateTwo.getDate() < 10 ? '0' + dateTwo.getDate() : dateTwo.getDate())

      return strOne + ' - ' + strTwo
    }
    return null
  }
  const onBtExport = () => {
    var excelParams = {
      fileName: 'notifications.xlsx',
      columnKeys: [
        'paxNumber',
        'bagNumber',
        'bagStatusPos',
        'flightNoFromDate',
        'flightNoToDate',
        'refundDateTime',
        'actionTaken',
        'actionBy',
      ],
      allColumns: false,
    }
    gridApi.exportDataAsExcel(excelParams)
  }
  useEffect(() => {
    axios
      .post(process.env.REACT_APP_SERVER_URI + '/api/flightChangeAlerts', {
        flightChangeAction: 'N',
      })
      .then(response => {
        const getData = response.data.result
        setLoading(false)
        setFlightAlerts(getData ? getData.length : 0)
        if (getData.length < 1) {
          setRowData([])
        } else {
          const newRowData = []
          getData.forEach((getDataItem, index) => {
            newRowData.push({
              flightChangeBagId: getDataItem.flightChangeBagId,
              flightNoFromDate:
                getDataItem.fromDepAirlineRefValue +
                ' ' +
                getDataItem.fromDepCarrierNumber +
                ' ' +
                dateEdit(getDataItem.fromDepartureTm),
              flightNoToDate:
                getDataItem.toDepAirlineRefValue +
                ' ' +
                getDataItem.toDepCarrierNumber +
                ' ' +
                dateEdit(getDataItem.toDepartureTm),
              actionTaken: getDataItem.flightChangeAction,
              actionBy: getDataItem.actionBy && getDataItem.actionBy,
              paxNumber: getDataItem.paxNo,
              bagNumber: getDataItem.bagNo,
              carrierChangeSeqId: getDataItem.carrierChangeSeqId,
              bagStatusPos:
                (getDataItem.bagStatus !== null ? 'Status: ' + getDataItem.bagStatus : '') +
                ' ' +
                (getDataItem.cartonNumber !== null
                  ? ', Carton No: ' + getDataItem.cartonNumber
                  : '') +
                (getDataItem.whBinLocId !== null ? ', WH Bin No: ' + getDataItem.whBinLocId : '') +
                (getDataItem.cageNo !== null ? ', Cage No: ' + getDataItem.cageNo : '') +
                (getDataItem.truckNo !== null ? ', Truck No: ' + getDataItem.truckNo : '') +
                (getDataItem.apBinLocId !== null ? ', AP Bin No: ' + getDataItem.apBinLocId : ''),
            })
          })
          setRowData(newRowData)
        }
      })
      .catch(err => {
        setLoading(false)
        if (err.response.data.error === 'E-0220') {
          setFlightAlerts(0)
        } else if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'fetching Flight Change Alerts count')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'fetching Flight Change Alerts count')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'fetching Flight Change Alerts count')
        else showAlertError('Internal Server Error')
      })

    axios
      .post(process.env.REACT_APP_SERVER_URI + '/api/refundAlerts', {
        actionTaken: 'N',
      })
      .then(response => {
        const getData = response.data.result
        setRefundAlerts(getData ? getData.length : 0)
      })
      .catch(err => {
        if (err.response.data.error === 'E-0219') {
          setRefundAlerts(0)
        } else if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'fetching Refund Alerts count')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'fetching Refund Alerts count')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'fetching Refund Alerts count')
        else showAlertError('Internal Server Error')
      })
  }, [])

  return (
    <div className='ml-2 bg-white mr-2'>
      <h1 className='mb-4 mt-5'>{t('Notifications_label')}</h1>
      <div className='mb-5 mt-0'>
        <NotificationPanel />
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className='row'>
          <div className='col-3'>
            <label className='form-label'>
              {t('LABEL_NOTIFICATION_TYPE_label')} <span className='text-danger'> *</span>
            </label>
            <Dropdown
              closeMenuOnSelect={true}
              value={notificationType}
              onChange={handleNotificationChange}
              onBlur={formik.handleBlur}
              options={notificationTypeOptions}
              optionLabel='name'
              optionValue='id'
              // isDisabled={formik.isSubmitting}
            />
          </div>

          <div className='col-2'>
            <label className='form-label'>
              {t('LABEL_ACTION_TYPE_label')} <span className='text-danger'> *</span>
            </label>
            <Dropdown
              closeMenuOnSelect={true}
              value={actionType}
              onChange={handleActionChange}
              onBlur={formik.handleBlur}
              options={actionTypeOptions}
              optionLabel='name'
              optionValue='id'
              // isDisabled={formik.isSubmitting}
            />
          </div>

          <div className='col-4'>
            <label className='form-label'>
              {t('LABEL_DEPARTURE_DATE_RANGE_label')}
              {_.isEqual(actionType, actionTypeOptions[0]) && (
                <span className='text-danger'> *</span>
              )}
            </label>
            <div className='customDatePickerWidth'>
              <DatePicker
                id='startDate'
                name='startDate'
                onBlur={formik.handleBlur}
                className='form-control'
                autoComplete='off'
                placeholderText={labels.TEXT_DATE_FORMAT}
                selected={formik.values.startDate}
                onChange={handleDate}
                value={formatDate(formik.values.startDate, formik.values.endDate)}
                dateFormat='yyyy-MM-dd'
                selectsRange
                startDate={formik.values.startDate}
                endDate={formik.values.endDate}
                shouldCloseOnSelect={false}
                // minDate={new Date()}
                // onSelect={handleDate} //when day is clicked
                disabledKeyboardNavigation
                // disabled={disabled}
              />
            </div>
          </div>

          <div className='col mt-2'>
            <br />
            <div>
              <button
                type='submit'
                className='btn btn-primary mr-3'
                // disabled={!(formik.isValid && formik.dirty)}
                disabled={!formik.isValid || !notificationType || !actionType}
              >
                {t('Go_label')}
              </button>
            </div>
          </div>
        </div>
        <div className=' row pull-right mt-2'>
          <br />{' '}
          <button
            onClick={() => onBtExport()}
            className=' btn btn-outline-secondary mr-3'
            disabled={!(rowData.length > 0)}
          >
            {t('Export_To_Excel_label')}
          </button>
        </div>
        <div className='row mb-3 mt-2'>
          <div className='col' />
          <div className='col-7'>
            {(formik.touched.startDate || formik.values.startDate) && formik.errors.endDate ? (
              <span className='h5 text-danger'>{formik.errors.endDate}</span>
            ) : null}
          </div>
        </div>
      </form>

      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div className='ag-theme-alpine mt-5' style={{ height: 400, width: '100%' }}>
          <AgGridReact
            // columnDefs={columnDefs}
            columnDefs={
              _.isEqual(notificationType, notificationTypeOptions[0])
                ? flightColumnDefs
                : refundColumnDefs
            }
            rowData={rowData}
            animateRows={true}
            rowHeight={40}
            headerHeight={40}
            paginationPageSize={10}
            defaultColDef={defaultColDef}
            frameworkComponents={frameworkComponents}
            pagination={true}
            context={props.context}
            modules={AllModules}
            onGridReady={onGridReady}
            editType='fullRow'
            suppressClickEdit={true}
            undoRedoCellEditing={true}
          />
        </div>
      )}

      <div className='row mt-4'>
        <div className='col text-right'>
          <button
            type='button'
            className='btn btn-outline-secondary ml-3'
            onClick={handleCancel}
            // disabled={!(formik.isValid && formik.dirty)}
            // disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
          >
            {t('Cancel_label')}
          </button>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  notificationType: state.dashboardReducer.notificationType,
  actionType: state.dashboardReducer.actionType,

  flightChangeAlertCount: state.dashboardReducer.flightChangeAlertCount,
  refundChangeAlertCount: state.dashboardReducer.refundChangeAlertCount,
})

const mapDispatchToProps = dispatch => ({
  setNotificationType: data => dispatch(setNotificationType(data)),
  setActionType: data => dispatch(setActionType(data)),
  setFlightAlerts: data => dispatch(setFlightAlerts(data)),
  setRefundAlerts: data => dispatch(setRefundAlerts(data)),
  setBellCount: () => dispatch(setBellCount()),
  setBellFlight: data => dispatch(bellActions.bellFLight(data)),
  setBellRefund: data => dispatch(bellActions.bellRefund(data)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
