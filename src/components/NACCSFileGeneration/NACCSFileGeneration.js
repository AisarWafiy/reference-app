import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import * as regex from 'constants/regex'
import DatePicker from 'react-datepicker'
import { Dropdown } from 'components/UI/Input'
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
import { setCarrierCode, setDepartureDate } from 'actions/action-merge-pax'

import { setPreviewFlightNo, setPreviewDepartureDate } from 'actions/action-naccs'

const NACCSFileGeneration = props => {
  const {
    showAlertSuccess,
    showAlertError,
    showAlertWarn,
    previewFlightNo,
    previewDepartureDate,
    setCarrierCode,
    setDepartureDate,
    setPreviewFlightNo,
    setPreviewDepartureDate,
  } = props

  const history = useHistory()
  const redirectToMergePax = async () =>
    history.push('/Customs/NACCS-Processing/Maintain-And-Merge-Pax')

  const redirectToNACCSPreview = async () => history.push('/Customs/NACCS-Processing/NACCS-Preview')

  const redirectToPreview = params => {
    const previewData = {
      flightNo: params.data.carrierCodeNumber,
      departureDate: params.data.departureDate,
    }

    const depDate = Moment(Moment(previewData.departureDate).format('YYYY-MM-DD')).toDate()

    setPreviewFlightNo({ key: previewData.flightNo, value: previewData.flightNo })
    setPreviewDepartureDate(depDate)
    redirectToNACCSPreview()
  }

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

  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [carrierCodeList, setCarrierCodeList] = useState([])
  const [rowData, setRowData] = useState([])
  const [rowSelected, setRowSelected] = useState(false)
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const columnDefs = [
    {
      editable: false,

      checkboxSelection: true,
      width: 50,
      lockPosition: true,
    },
    {
      headerName: t('Carrier_Code_label'),
      field: 'carrierCodeNumber',
      sortable: true,
      filter: true,
      sort: 'asc',
      lockPosition: true,
      width: 120,
      editable: false,
    },
    {
      headerName: t('Departure_Date_label'),
      field: 'departureDate',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 150,
      editable: false,
    },
    {
      headerName: t('No._of_Pax_label'),
      field: 'numOfPax',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 110,
      editable: false,
    },
    {
      headerName: t('No._of_PAX_Generated_label'),
      field: 'numofPaxGen',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 150,
      editable: false,
    },
    {
      headerName: t('No._of_PAX_not_Generated_label'),
      field: 'numofPaxNotGen',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 150,
      editable: false,
    },
    {
      headerName: t('No._of_PAX_having_issue_label'),
      field: 'numofIssuePax',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 150,
      editable: false,

      cellRenderer: 'redirectPreview',
    },
    {
      headerName: t('NO_DUPLICATE_PAX_label'),
      field: 'numofDuplicatePax',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 150,
      editable: false,

      cellRenderer: 'redirectMerge',
    },
    {
      headerName: t('NO_ACKNOWLEDGED_PAX_label'),
      field: 'numofAckPax',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
    },
  ]
  const defaultColDef = {
    width: 125,
    sortable: true,
    wrapText: true,
    resizable: true,
    cellStyle: rowStyle,
    headerComponentParams: {
      template:
        '<div class="ag-cell-label-container" role="presentation">' +
        '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
        '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
        '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
        '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
        '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
        '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
        '    <span ref="eText" class="ag-header-cell-text" role="columnheader" style="white-space: normal;"></span>' +
        '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
        '  </div>' +
        '</div>',
    },
  }
  const frameworkComponents = {
    redirectMerge: params => redirectRenderer(params, () => redirectToMerge(params)),
    redirectPreview: params => redirectRenderer(params, () => redirectToPreview(params)),
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {},
    validationSchema: Yup.object({
      departureDate: Yup.date().required(t('Please_Select_A_Departure_Date_Validation_Msg_label')),
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
            '/api/naccs/searchCarrier?departureDate=' +
            depDate +
            '&carrierCodeNumber=' +
            values.flightNumber.value.replace(/\s/g, '%20'),
        )
        .then(response => {
          showAlertSuccess(response.data.message, 'fetching records')
          const getData = response.data.result

          setRowData(getData)
          setLoading(false)
        })
        .catch(err => {
          setRowData([])
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'generating NACCS Information')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'generating NACCS Information')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'generating NACCS Information')
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
          showAlertError(err.response.data.error, 'fetching carrier codes')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'fetching carrier codes')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'fetching carrier codes')
        else showAlertError('Internal Server Error')
      })
  }, [])

  useEffect(() => {
    if (previewFlightNo && previewDepartureDate) {
      formik.setFieldValue('departureDate', previewDepartureDate, true)
      formik.setFieldValue('flightNumber', previewFlightNo, true)
      let date = Moment(previewDepartureDate).format('YYYY-MM-DD')
      setLoading(true)
      axios
        .get(
          process.env.REACT_APP_SERVER_URI +
            '/api/naccs/searchCarrier?departureDate=' +
            date +
            '&carrierCodeNumber=' +
            previewFlightNo.value.replace(/\s/g, '%20'),
        )
        .then(response => {
          showAlertSuccess(response.data.message, 'fetching records')
          const getData = response.data.result
          setRowData(getData)
          setLoading(false)
        })
        .catch(err => {
          setRowData([])
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'generating NACCS Infomation')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'generating NACCS Infomation')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'generating NACCS Infomation')
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

  const rowChecked = params => {
    if (rowData.length > 0) {
      params.api.getSelectedRows().length > 0 ? setRowSelected(true) : setRowSelected(false)
    }
  }

  const handleDate = dates => {
    formik.setFieldValue('departureDate', dates, true)
    formik.setSubmitting(false)
  }
  const handleGo1 = values => {
    const depDate = Moment(values.departureDate).format('YYYY-MM-DD')
    axios
      .get(
        process.env.REACT_APP_SERVER_URI +
          '/api/naccs/searchCarrier?departureDate=' +
          depDate +
          '&carrierCodeNumber=' +
          values.flightNumber.value.replace(/\s/g, '%20'),
      )
      .then(response => {
        const getData = response.data.result
        setRowData(getData)
        setLoading(false)
      })
      .catch(err => {
        setRowData([])
        setLoading(false)
      })
  }
  const handleGenerate = values => {
    setRowSelected(false)
    setLoading(true)
    const selectedRows = gridApi.getSelectedRows()
    axios
      .post(process.env.REACT_APP_SERVER_URI + '/api/naccs/generateNaccs', selectedRows)
      .then(response => {
        handleGo1(values)
        showAlertSuccess(response.data.message, 'generating NACCS file')
        const getData = response.data.result
      })
      .catch(err => {
        handleGo1(values)
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'generating NACCS file')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'generating NACCS file')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'generating NACCS file')
        else showAlertError('Internal Server Error')
      })
  }

  const handleCancel = () => {
    formik.resetForm()
    formik.setFieldValue('departureDate', null, false)
    formik.setFieldValue('flightNumber', null, true)
    setRowSelected(false)
    setRowData([])
  }

  return (
    <div className='ml-4 mt-4 bg-white'>
      <div>
        <h1 className='mb-4 mt-5'>{t('NACCS_File_Generation_label')}</h1>
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
                  disabled={!(formik.isValid && formik.dirty)}
                  // disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
                >
                  {t('Go_label')}
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
        <div className='row'>
          <div className='col text-right'>
            <button
              type='button'
              className='btn btn-primary ml-3'
              // disabled={!(rowData.length > 0)}
              disabled={!rowSelected}
              onClick={() => handleGenerate(formik.values)}
              // disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
            >
              {t('GENERATE_FILE_label')}
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
              rowHeight={30}
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
              onRowSelected={rowChecked}
            />
          </div>
        )}
      </div>
    </div>
  )
}

// const mapStateToProps = state => ({
// terminalNo: state.deliveryManifestReducer.terminalNo,
// })
const mapStateToProps = state => ({
  previewFlightNo: state.naccsReducer.previewFlightNo,
  previewDepartureDate: state.naccsReducer.previewDepartureDate,
})
const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),

  setCarrierCode: data => dispatch(setCarrierCode(data)),
  setDepartureDate: data => dispatch(setDepartureDate(data)),

  setPreviewFlightNo: data => dispatch(setPreviewFlightNo(data)),
  setPreviewDepartureDate: data => dispatch(setPreviewDepartureDate(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(NACCSFileGeneration)
