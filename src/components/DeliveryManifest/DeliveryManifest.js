import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import * as labels from 'constants/labels'
import { Dropdown } from 'components/UI/Input'
import { Modal, Button, Row, Col } from 'react-bootstrap'
import 'react-datepicker/dist/react-datepicker.css'
import { useReactToPrint } from 'react-to-print'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Loader from 'react-loader-spinner'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { alertActions } from 'actions/alert.actions'
import { AgGridReact } from '@ag-grid-community/react'

import { AllCommunityModules } from '@ag-grid-community/all-modules'

const DeliveryManifest = props => {
  const { showAlertSuccess, showAlertError, showAlertWarn } = props
  const [loading, setLoading] = useState(false)

  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [rowData, setRowData] = useState([])
  const { t } = useTranslation()
  const [truckList, setTruckList] = useState([])
  const [truckNoText, setTruckNoText] = useState('')
  const [truckData, setTruckData] = useState()
  const [show, setShow] = useState(false)
  const [cartonsPerPickup, setCartonsPerPickup] = useState()
  const componentRef = useRef()
  const columnDefs = [
    {
      headerName: t('Pickup_Location_label'),
      field: 'pickupRefValue',
      sortable: true,
      filter: true,

      lockPosition: true,

      width: 160,
      editable: false,
    },
    {
      headerName: t('Cage_label'),
      field: 'cageNumber',
      sortable: true,

      filter: true,
      lockPosition: true,

      width: 160,

      editable: false,
    },
    {
      headerName: t('Departure_Date_label'),
      field: 'moduleDate',
      sortable: true,

      filter: true,
      lockPosition: true,

      width: 160,
      editable: false,
    },
    {
      headerName: t('Shift_label'),
      field: 'shiftRefValue',
      sortable: true,
      sort: 'asc',
      filter: true,

      lockPosition: true,

      width: 140,
      editable: false,
    },
    {
      headerName: t('Total_No._of_Cartons_label'),
      field: 'cartonCount',
      sortable: true,

      filter: true,

      lockPosition: true,

      width: 180,
      editable: false,
    },
  ]
  const defaultColDef = {
    sortable: true,
    wrapText: true,
    resizable: true,
    cellStyle: rowStyle,
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { international: false },
    validationSchema: Yup.object({
      truckNumber: Yup.object().shape({
        key: Yup.string(),
        value: Yup.string().required('Please choose a truck number'),
      }),
      international: Yup.bool(),
    }),
    onSubmit: values => {
      setTruckNoText(values.truckNumber.value)
      const truckNo = values.truckNumber.value
      const refFlag = values.international ? 'Y' : 'N'
      const postData = `?truckNumber=` + truckNo + `&refFlag=` + refFlag
      setLoading(true)
      axios
        .get(
          process.env.REACT_APP_SERVER_URI + '/api/deliveryManifest/getDeliveryManifest' + postData,
        )
        .then(response => {
          const getData = response.data.result
          if (getData !== null) {
            setCartonsPerPickup(getData.pickupLocationCartons)
            setTruckData(getData)
            setRowData(getData.locationCageDetails)
          } else {
            setCartonsPerPickup(null)
            setTruckData(null)
            setRowData([])
          }
          setLoading(false)
        })
        .catch(err => {
          setCartonsPerPickup(null)
          setTruckData(null)
          setRowData([])
          setLoading(false)
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'Delivery Manifest')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'Delivery Manifest')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'Delivery Manifest')
          else showAlertError('Internal Server Error')
        })
    },
  })

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/truck/getAllLoadingOrInTransitTruck')
      .then(response => {
        const dropdownList = []

        response.data.result.forEach(function (element) {
          dropdownList.push({ key: element, value: element })
        })
        setTruckList(dropdownList)
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'Delivery Manifest')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'Delivery Manifest')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'Delivery Manifest')
        else showAlertError('Internal Server Error')
      })
  }, [])

  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const handlePrint = () => {
    const postData = `?truckNumber=` + truckNoText

    axios
      .post(
        process.env.REACT_APP_SERVER_URI + '/api/deliveryManifest/printDeliveryManifest' + postData,
      )
      .then(response => {
        showAlertSuccess(response.data.message, 'Delivery Manifest')
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'Delivery Manifest')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'Delivery Manifest')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'Delivery Manifest')
        else showAlertError('Internal Server Error')
      })
  }
  const handleClose = () => setShow(false)
  const handlePrintGrid = useReactToPrint({
    content: () => componentRef.current,
  })

  const onBtPrint = () => {
    setShow(false)
    const api = gridApi
    setPrinterFriendly(api)

    setTimeout(function () {
      handlePrintGrid()
      handlePrint()
      setTimeout(function () {
        setNormal(api)
      }, 2000)
    }, 2000)
  }
  function setPrinterFriendly(api) {
    const eGridDiv = document.querySelector('#myGrid')
    eGridDiv.style.height = ''
    api.setDomLayout('print')
  }

  function setNormal(api) {
    const eGridDiv = document.querySelector('#myGrid')
    eGridDiv.style.width = '820px'
    eGridDiv.style.height = '500px'
    api.setDomLayout(null)
  }
  // useEffect(() => {
  //   if (truckData === null) {
  //     props.showAlertError('No Records Found', labels.deliveryManifest)
  //   }
  // }, [truckData])

  return (
    <div className='container bg-white' ref={componentRef}>
      <div>
        <h1 className='mb-4 mt-5'>{t('Delivery_Manifest_label')}</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className='mt-3'>
          <div className='row'>
            <div className='col'>
              <label className='form-label'>
                {t('Truck_Number_label')}
                <span className='text-danger'> *</span>
              </label>
            </div>
          </div>
          <div className='row'>
            <div className='col-4'>
              <Dropdown
                id='truckNumber'
                name='truckNumber'
                closeMenuOnSelect={true}
                value={formik.values.truckNumber}
                onChange={selectedOption => formik.setFieldValue('truckNumber', selectedOption)}
                isClearable
                onBlur={formik.handleBlur}
                options={truckList}
                optionLabel='key'
                optionValue='value'
                placeholder={t('TEXT_SELECT_label')}
              />
            </div>
            <div className='col-3'>
              <div className='form-group mt-2'>
                <div className='custom-control custom-checkbox'>
                  <input
                    type='checkbox'
                    className='custom-control-input'
                    id='international'
                    name='international'
                    checked={formik.values.international}
                    onChange={event => formik.setFieldValue('international', event.target.checked)}
                  />
                  <label className='custom-control-label' htmlFor='international'>
                    {t('International_label')}
                  </label>
                </div>
              </div>
            </div>
            <div className='col-3'>
              <button
                type='submit'
                className='btn btn-primary mr-3'
                disabled={!(formik.isValid && formik.dirty)}
              >
                {t('Go_label')}
              </button>
              <button
                type='button'
                className='btn btn-primary'
                disabled={!truckData}
                onClick={() => setShow(true)}
              >
                {t('Print_label')}
              </button>
            </div>
          </div>
        </div>
      </form>
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div>
          <Row>
            <Col>
              <h3 className='mb-3 mt-3 '>{truckNoText && 'Truck Number ' + truckNoText}</h3>{' '}
            </Col>
          </Row>
          <Row>
            <Col xs={9} className='box1' style={{ backgroundColor: '#E4F3FF', borderRadius: '0' }}>
              <Row>
                <Col>
                  <div className='form-group'>
                    <label htmlFor='originAirport'>{t('Trip_Date_label')}</label>{' '}
                    <div className='h4'>
                      {truckData && truckData !== null
                        ? truckData.tripDate
                          ? truckData.tripDate
                          : '-'
                        : '-'}
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className='form-group'>
                    <label htmlFor='destinationAirport'>{t('Time_label')}</label>{' '}
                    <div className='h4'>
                      {truckData && truckData !== null
                        ? truckData.tripTime
                          ? truckData.tripTime.slice(0, 5)
                          : '-'
                        : '-'}
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className='form-group'>
                    <label htmlFor='pickupLocation'>{t('Total_No._of_Cages_label')}</label>
                    <div className='h4'>
                      {truckData && truckData !== null
                        ? truckData.cageCount
                          ? truckData.cageCount
                          : '-'
                        : '-'}
                    </div>
                  </div>
                </Col>{' '}
                <Col>
                  <div className='form-group'>
                    <label htmlFor='originAirport'>{t('Cartons_label')}</label>{' '}
                    <div className='h4'>
                      {truckData && truckData !== null
                        ? truckData.cartonCount
                          ? truckData.cartonCount
                          : '-'
                        : '-'}
                    </div>
                  </div>
                </Col>
                <Col>
                  <div className='form-group'>
                    <label htmlFor='originAirport'>{t('Bags_label')}</label>{' '}
                    <div className='h4'>
                      {truckData && truckData !== null
                        ? truckData.bagCount
                          ? truckData.bagCount
                          : '-'
                        : '-'}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className=' mb-4'>
            <Col xs={9} className=' box1' style={{ borderRadius: '0' }}>
              <Row>
                <Col>
                  <label>{t('Total_No._of_Cartons_per_Pickup_Location_label')} </label>
                </Col>
              </Row>
              <Row>
                {truckData !== null &&
                cartonsPerPickup &&
                Object.entries(cartonsPerPickup).length !== 0 ? (
                  <Row>
                    {Object.entries(cartonsPerPickup).map(key => {
                      return (
                        <Col className='ml-3'>
                          <span className='h4'>{`${key[0]}:${key[1]}`}</span>
                        </Col>
                      )
                    })}{' '}
                  </Row>
                ) : (
                  <Col className='col-sm-2'>-</Col>
                )}
              </Row>
            </Col>
          </Row>

          <div
            id='myGrid'
            className='ag-theme-alpine mt-3'
            style={{
              width: '820px',
              height: '500px',
            }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              animateRows={true}
              rowHeight={30}
              pagination={true}
              paginationPageSize={35}
              headerHeight={40}
              defaultColDef={defaultColDef}
              context={props.context}
              modules={AllCommunityModules}
              onGridReady={onGridReady}
              rowSelection={'multiple'}
              editType='fullRow'
              suppressClickEdit={true}
              undoRedoCellEditing={true}
            />
          </div>
        </div>
      )}
      <Modal show={show} onHide={handleClose} centered={true}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>Truck status will change to Intransit.Do you want to continue?</Modal.Body>
        <Modal.Footer>
          <button type='button' className=' btn btn-outline-secondary' onClick={handleClose}>
            Close
          </button>

          <Button variant='primary' onClick={onBtPrint}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

// const mapStateToProps = state => ({
// terminalNo: state.deliveryManifestReducer.terminalNo,
// })

const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
})

export default connect(null, mapDispatchToProps)(DeliveryManifest)
