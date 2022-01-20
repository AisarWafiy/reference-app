import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import * as labels from 'constants/labels'
import * as regex from 'constants/regex'
import DatePicker from 'react-datepicker'
import { Dropdown } from 'components/UI/Input'
import { Modal } from 'react-bootstrap'
import Loader from 'react-loader-spinner'
import 'react-datepicker/dist/react-datepicker.css'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'

import Moment from 'moment'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'assets/styles/customDatePickerWidth.css'

import { alertActions } from 'actions/alert.actions'
import { AgGridReact } from '@ag-grid-community/react'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import { redirectRenderer } from 'components/AgGridCustomComponents/Renderers'
import { setPreviewFlightNo, setPreviewDepartureDate } from 'actions/action-naccs'
import { setCarrierCode, setDepartureDate } from 'actions/action-merge-pax'

const NACCSPreview = props => {
  const {
    showAlertSuccess,
    showAlertError,
    showAlertWarn,
    previewFlightNo,
    previewDepartureDate,
    setPreviewFlightNo,
    setPreviewDepartureDate,
    setCarrierCode,
    setDepartureDate,
  } = props

  const [gridApi, setGridApi] = useState(null)
  const [loading, setLoading] = useState(false)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [carrierCodeList, setCarrierCodeList] = useState([])
  const [rowData, setRowData] = useState([])
  const { t } = useTranslation()

  const [showPaxModal, setShowPaxModal] = useState(false)
  const [showTransModal, setShowTransModal] = useState(false)
  const [showMasterModal, setShowMasterModal] = useState(false)

  const [transInfo, setTransInfo] = useState({})
  const [masterInfo, setMasterInfo] = useState({})

  const handleClose = () => {
    setShowTransModal(false)
    setShowMasterModal(false)
  }

  const masterColumnDefs = [
    {
      headerName: t('Sales_Selling_Location_label'),
      field: 'salesSellingLocation',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 160,
      editable: false,
    },
    {
      headerName: t('Sales_Terminal_Number_label'),
      field: 'salesTerminalNumber',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 170,
      editable: false,
    },
    {
      headerName: t('Sales_Trans_Number_label'),
      field: 'salesTransNumber',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 170,
      editable: false,
    },
    {
      headerName: t('Sku_No_label'),
      field: 'skuNo',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 140,
      editable: false,
    },
    {
      headerName: t('Error_Data_Type_label'),
      field: 'errorDataType',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 160,
      editable: false,
    },
  ]

  const masterDefaultColDef = {
    width: 125,
    sortable: true,
    wrapText: true,
    resizable: true,
    cellStyle: rowStyle,
  }

  const transactionColumnDefs = [
    {
      headerName: t('Sales_Selling_Location_label'),
      field: 'salesSellingLocation',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 160,
      editable: false,
    },
    {
      headerName: t('Sales_Terminal_Number_label'),
      field: 'salesTerminalNumber',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 170,
      editable: false,
    },
    {
      headerName: t('Sales_Trans_Number_label'),
      field: 'salesTransNumber',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 170,
      editable: false,
    },
    {
      headerName: t('Error_Data_Type_label'),
      field: 'errorDataType',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 160,
      editable: false,
    },
  ]
  let transModal = (
    <Modal show={showTransModal} onHide={handleClose} centered={true}>
      <Modal.Header closeButton>{t('Missing_Transaction_label')}</Modal.Header>

      <Modal.Body>
        <div
          id='myGrid'
          className='ag-theme-alpine'
          style={{
            width: '100%',
            height: 400,
          }}
        >
          <AgGridReact
            columnDefs={transactionColumnDefs}
            rowData={transInfo}
            animateRows={true}
            rowHeight={30}
            headerHeight={40}
            defaultColDef={masterDefaultColDef}
            pagination={true}
            paginationPageSize={10}
            context={props.context}
            modules={AllModules}
            editType='fullRow'
            suppressClickEdit={true}
            undoRedoCellEditing={true}
            groupMultiAutoColumn={true}
          />
        </div>
        {t('Contact_IT_Team_to_resolve_the_missing_transaction_label')}
      </Modal.Body>
      <Modal.Footer>
        <button type='button' className=' btn btn-outline-secondary' onClick={handleClose}>
          {t('Cancel_label')}
        </button>
      </Modal.Footer>
    </Modal>
  )

  let masterModal = (
    <Modal show={showMasterModal} onHide={handleClose} centered={true}>
      <Modal.Header closeButton>{t('Missing_Master_Information_label')}</Modal.Header>

      <Modal.Body>
        <div
          id='myGrid'
          className='ag-theme-alpine'
          style={{
            width: '100%',
            height: 400,
          }}
        >
          <AgGridReact
            columnDefs={masterColumnDefs}
            rowData={masterInfo}
            animateRows={true}
            rowHeight={40}
            headerHeight={55}
            defaultColDef={masterDefaultColDef}
            pagination={true}
            paginationPageSize={10}
            context={props.context}
            modules={AllModules}
            editType='fullRow'
            suppressClickEdit={true}
            undoRedoCellEditing={true}
            groupMultiAutoColumn={true}
          />
        </div>
        {t('Contact_IT_Team_to_resolve_the_missing_master_data_issue_label')}
      </Modal.Body>
      <Modal.Footer>
        <button type='button' className=' btn btn-outline-secondary' onClick={handleClose}>
          {t('Cancel_label')}
        </button>
      </Modal.Footer>
    </Modal>
  )

  const history = useHistory()
  const redirectToMergePax = async () =>
    history.push('/Customs/NACCS-Processing/Maintain-And-Merge-Pax')

  const redirectToMerge = params => {
    const mergePaxData = {
      carrierCode: params.data.carrierCodeNumber,
      departureDate: params.data.departureDate,
    }

    const depDate = Moment(Moment(mergePaxData.departureDate).format('YYYY-MM-DD')).toDate()
    setCarrierCode({ key: mergePaxData.carrierCode, value: mergePaxData.carrierCode })
    setDepartureDate(depDate)
    redirectToMergePax()
  }

  const redirectToNACCSFileGeneration = async () =>
    history.push('/Customs/NACCS-Processing/NACCS-File-Generation')

  const redirectToNACCSFileGen = params => {
    const NACCSFileData = {
      carrierCode: params.data.carrierCodeNumber,
      departureDate: params.data.departureDate,
    }
    const depDate = Moment()._d
    setPreviewFlightNo({ key: NACCSFileData.carrierCode, value: NACCSFileData.carrierCode })
    setPreviewDepartureDate(depDate)
    redirectToNACCSFileGeneration()
  }

  const showMissingTrans = params => {
    setTransInfo(params.data.missingSalesData)
    setShowTransModal(true)
  }

  const showMissingMaster = params => {
    setMasterInfo(params.data.missingMasterData)
    setShowMasterModal(true)
  }

  const columnDefs = [
    {
      headerName: t('Carrier_Code_label'),
      field: 'carrierCodeNumber',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 160,
      editable: false,
      sort: 'asc',
      cellRenderer: 'redirectNACCSFileGeneration',
    },
    {
      headerName: t('Departure_Date_label'),
      field: 'departureDate',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 160,
      editable: false,
    },
    {
      headerName: t('Pax_Number_label'),
      field: 'paxNo',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 140,
      editable: false,

      cellRenderer: 'redirectMerge',
    },
    {
      headerName: t('Missing_Transaction_Count_label'),
      field: 'missingTransCount',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 240,
      editable: false,

      cellRenderer: 'showMissingTransCount',
    },
    {
      headerName: t('Missing_Master_Information_Count_label'),
      field: 'missingMasterCount',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 280,
      editable: false,

      cellRenderer: 'showMissingMasterCount',
    },
  ]
  const defaultColDef = {
    width: 125,
    sortable: true,
    wrapText: true,
    resizable: true,
    cellStyle: rowStyle,
  }
  const autoGroupColumnDef = {
    width: 200,
    cellStyle: rowStyle,
  }
  const redirectRenderer1 = (params, onClick) => {
    if (params.value) {
      return (
        <button className='btn btn-link p-0' style={{ fontSize: 'inherit' }} onClick={onClick}>
          {params.value}
        </button>
      )
    } else {
      return <span>{params.value}</span>
    }
  }
  const frameworkComponents = {
    redirectMerge: params => redirectRenderer(params, () => redirectToMerge(params)),
    showMissingTransCount: params => redirectRenderer(params, () => showMissingTrans(params)),
    showMissingMasterCount: params => redirectRenderer(params, () => showMissingMaster(params)),
    redirectNACCSFileGeneration: params =>
      redirectRenderer1(params, () => redirectToNACCSFileGen(params)),
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {},
    validationSchema: Yup.object({
      departureDate: Yup.date()
        .required(t('Please_Select_A_Departure_Date_Validation_Msg_label'))
        .typeError(t('Please_Select_A_Departure_Date_Validation_Msg_label')),
      flightNumber: Yup.object()
        .shape({
          key: Yup.string().required(),
          value: Yup.string().required(),
        })
        .required(t('Please_Select_A_Flight_Number_Validation_Msg_label'))
        .typeError(t('Please_Select_A_Flight_Number_Validation_Msg_label')),
    }),
    onSubmit: values => {
      const depDate = Moment(values.departureDate).format('YYYY-MM-DD')
      setLoading(true)
      axios
        .get(
          process.env.REACT_APP_SERVER_URI +
            '/api/naccs/preview?departureDate=' +
            depDate +
            '&carrierCodeNumber=' +
            values.flightNumber.value.replace(/\s/g, '%20'),
        )
        .then(response => {
          showAlertSuccess(response.data.message, t('NACCS_Preview_label'))
          const getData = response.data.result

          setRowData(getData)
          setLoading(false)
        })
        .catch(err => {
          setRowData([])
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, t('NACCS_Preview_label'))
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, t('NACCS_Preview_label'))
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, t('NACCS_Preview_label'))
          else showAlertError('Internal Server Error')
          setLoading(false)
        })
    },
  })

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/carrier/carriercode')
      .then(response => {
        const dropdownList = []

        response.data.result.forEach(function (element) {
          dropdownList.push({ key: element, value: element })
        })
        setCarrierCodeList(dropdownList)
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, t('NACCS_Preview_label'))
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, t('NACCS_Preview_label'))
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, t('NACCS_Preview_label'))
        else showAlertError('Internal Server Error')
      })
  }, [])

  useEffect(() => {
    if (previewFlightNo && previewDepartureDate) {
      formik.setFieldValue('departureDate', previewDepartureDate, true)
      formik.setFieldValue('flightNumber', previewFlightNo, true)
      setRowData([])
      let date = Moment(previewDepartureDate).format('YYYY-MM-DD')
      setLoading(true)
      axios
        .get(
          process.env.REACT_APP_SERVER_URI +
            '/api/naccs/preview?departureDate=' +
            date +
            '&carrierCodeNumber=' +
            previewFlightNo.value.replace(/\s/g, '%20'),
        )
        .then(response => {
          showAlertSuccess(response.data.message, t('NACCS_Preview_label'))
          const getData = response.data.result
          setRowData(getData)
          setLoading(false)
        })
        .catch(err => {
          setRowData([])
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, t('NACCS_Preview_label'))
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, t('NACCS_Preview_label'))
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, t('NACCS_Preview_label'))
          else showAlertError('Internal Server Error')
          setLoading(false)
        })

      formik.setSubmitting(true)
      setPreviewDepartureDate(null)
      setPreviewFlightNo(null)
    }
  }, [previewFlightNo, previewDepartureDate])

  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const handleDate = dates => {
    formik.setFieldValue('departureDate', dates, true)
    formik.setSubmitting(false)
  }

  const handleExport = () => {
    var excelParams = {
      fileName: 'NACCS Preview.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }

  const handleCancel = () => {
    formik.resetForm()
    formik.setFieldValue('departureDate', null, false)
    formik.setFieldValue('flightNumber', null, true)

    setRowData([])
  }

  return (
    <div className='container bg-white'>
      <div>
        <h1 className='mb-4 mt-5'>{t('NACCS_Preview_label')}</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className='row'>
          <div className='col'>
            <div className='row'>
              <div className='col-3'>
                <label className='form-label'>
                  {t('Flight_Number_label')}
                  <span className='text-danger'> *</span>
                </label>
              </div>
              <div className='col-4'>
                <label className='form-label'>
                  {t('Departure_Date_label')}
                  <span className='text-danger'> *</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='row mb-4'>
          <div className='col'>
            <div className='row'>
              <div className='col-3'>
                <Dropdown
                  id='flightNumber'
                  name='flightNumber'
                  isClearable
                  closeMenuOnSelect={true}
                  value={formik.values.flightNumber}
                  onChange={selectedOption => formik.setFieldValue('flightNumber', selectedOption)}
                  onBlur={formik.handleBlur}
                  options={carrierCodeList}
                  optionLabel='key'
                  optionValue='value'
                  placeholder={t('TEXT_SELECT_label')}
                />
                {formik.touched.flightNumber && formik.errors.flightNumber ? (
                  <span className='h5 text-danger'>{formik.errors.flightNumber}</span>
                ) : null}
              </div>
              <div className='col-4'>
                <div className='customDatePickerWidth'>
                  <DatePicker
                    id='departureDate'
                    name='departureDate'
                    onBlur={formik.handleBlur}
                    className='form-control'
                    autoComplete='off'
                    placeholderText={t('TEXT_DATE_FORMAT_label')}
                    selected={formik.values.departureDate}
                    onChange={handleDate}
                    value={formik.values.departureDate}
                    dateFormat='yyyy-MM-dd'
                    // minDate={new Date()}
                    // onSelect={handleDate} //when day is clicked
                    disabledKeyboardNavigation
                    // disabled={disabled}
                  />
                  {formik.touched.departureDate && formik.errors.departureDate ? (
                    <span className='h5 text-danger'>{formik.errors.departureDate}</span>
                  ) : null}
                </div>
              </div>
              <div className='col'>
                <button
                  type='submit'
                  className='btn btn-primary'
                  disabled={!(formik.values.departureDate && formik.values.flightNumber)}
                  // disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
                >
                  {labels.BUTTON_GO}
                </button>

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
        </div>
      </form>

      <div className='mt-5'>
        <div className='row mt-4'>
          <div className='col text-right'>
            <button
              type='submit'
              className='btn btn-outline-secondary ml-3'
              disabled={!(rowData.length > 0)}
              onClick={() => handleExport()}
            >
              {t('Export_To_Excel_label')}
            </button>
          </div>
        </div>

        <label className='form-label'>{t('Results_label')}</label>
        {loading === true ? (
          <div style={{ textAlign: 'center' }} className='mt-5'>
            <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
          </div>
        ) : (
          <div
            id='myGrid'
            className='ag-theme-alpine'
            style={{
              width: '100%',
              height: 500,
            }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              animateRows={true}
              rowHeight={35}
              headerHeight={40}
              defaultColDef={defaultColDef}
              pagination={true}
              paginationPageSize={10}
              context={props.context}
              modules={AllModules}
              onGridReady={onGridReady}
              rowSelection={'multiple'}
              editType='fullRow'
              suppressClickEdit={true}
              undoRedoCellEditing={true}
              frameworkComponents={frameworkComponents}
              groupMultiAutoColumn={true}
              groupDefaultExpanded={1}
              autoGroupColumnDef={autoGroupColumnDef}
            />
          </div>
        )}
      </div>
      {transModal}
      {masterModal}
    </div>
  )
}

const mapStateToProps = state => ({
  previewFlightNo: state.naccsReducer.previewFlightNo,
  previewDepartureDate: state.naccsReducer.previewDepartureDate,
})

const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),
  setPreviewFlightNo: data => dispatch(setPreviewFlightNo(data)),
  setPreviewDepartureDate: data => dispatch(setPreviewDepartureDate(data)),
  setCarrierCode: data => dispatch(setCarrierCode(data)),
  setDepartureDate: data => dispatch(setDepartureDate(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NACCSPreview)
