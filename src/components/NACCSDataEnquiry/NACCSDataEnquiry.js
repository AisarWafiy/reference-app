import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import * as labels from 'constants/labels'
import * as regex from 'constants/regex'
import DatePicker from 'react-datepicker'
import { Dropdown } from 'components/UI/Input'

import 'react-datepicker/dist/react-datepicker.css'

import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next';

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'assets/styles/customDatePickerWidth.css'

import { alertActions } from 'actions/alert.actions'
import { AgGridReact } from '@ag-grid-community/react'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { AllModules } from '@ag-grid-enterprise/all-modules'

const NACCSDataEnquiry = props => {
  const { showAlertSuccess, showAlertError } = props

  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [rowData, setRowData] = useState([])
  const { t } = useTranslation();

  const columnDefs = [
    {
      headerName: t('Pax_First_Name_label'),
      field: 'paxFirstName',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
      border: true,
    },
    {
      headerName: t('Pax_Last_Name_label'),
      field: 'paxLastName',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
      border: true,
    },
    {
      headerName: t('Dutiable_label'),
      field: 'dutiable',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
      border: true,
    },
    {
      headerName: t('SKU_label'),
      field: 'sku',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
      border: true,
    },
    {
      headerName: t('Retail_Price_label'),
      field: 'retailPrice',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
      border: true,
    },
    {
      headerName: t('SKU_Quantity_label'),
      field: 'skuQuantity',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
      border: true,
    },
    {
      headerName: t('RETAIL_TOTAL_label'),
      field: 'retailTotal',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
      border: true,
    },
    {
      headerName: t('HS_CODE_label'),
      field: 'hsCode',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
      border: true,
    },
    {
      headerName: t('HS_CODE2_label'),
      field: 'hsCode2',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
      border: true,
    },
    {
      headerName: t('COO_label'),
      field: 'coo',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
      border: true,
    },
    {
      headerName: t('COO2_label'),
      field: 'coo2',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
      border: true,
    },
    {
      headerName: t('TAX_CODE_label'),
      field: 'taxCode',
      sortable: true,
      filter: true,
      lockPosition: true,
      width: 180,
      editable: false,
      border: true,
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {},
    validationSchema: Yup.object({
      // departure: Yup.Date(),
      searchCodeNum: Yup.string(),
    }),
    onSubmit: values => {

      const postData = 'test'

      //   axios
      //     .get(
      //       process.env.REACT_APP_SERVER_URI + '/api/deliveryManifest/getDeliveryManifest' + postData,
      //     )
      //     .then(response => {
      //       const getData = response.data.result
      //       console.log(response.data.result)
      //     })
      //     .catch(err => {
      //       showAlertError(err.response.data.errors, 'generating NACCS Infomation')
      //     })
    },
  })

  useEffect(() => {
    setRowData([
      {
        paxFirstName: 'Bruce',
        paxLastName: 'Lee',
        dutiable: 'du',
        sku: '23476SEDAN',
        retailPrice: '$5.50',
        skuQuantity: 500,
        retailTotal: 234,
        hsCode: 'code1',
        hsCode2: 'code2',
        coo: 'coo1',
        coo2: 'coo2',
        taxCode: 'ASHH22344',
      },
      {
        paxFirstName: 'Bruce',
        paxLastName: 'Lee',
        dutiable: 'du',
        sku: '23476SEDAN',
        retailPrice: '$5.50',
        skuQuantity: 500,
        retailTotal: 234,
        hsCode: 'code1',
        hsCode2: 'code2',
        coo: 'coo1',
        coo2: 'coo2',
        taxCode: 'ASHH22344',
      },
    ])
    //   axios
    //     .get(process.env.REACT_APP_SERVER_URI + '/api/truck/getAllLoadingOrInTransitTruck')
    //     .then(response => {
    //       console.log(response.data.result)
    //     })
    //     .catch(err => {
    //       showAlertError(err.response.data.errors, 'fetching truck numbers')
    //     })
  }, [])

  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const handleAlphaNumeric = (event, maxLength = 25) => {
    formik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_ALPHANUMERIC, '').substring(0, maxLength),
    )
    formik.setSubmitting(false)
  }

  //   const handleDate = date => {
  //     formik.setFieldValue('date', date, true)

  //     formik.setSubmitting(false)
  //   }

  const handleCancel = () => {
  }

  return (
    <div className='container bg-white'>
      <div>
        <h1 className='mb-4 mt-5'>{t('NACCS_Data_Enquiry_Report_label')}</h1>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className='row'>
          <div className='col-8'>
            <div className='row'>
              <div className='col-4'>
                <label className='form-label'>
                  {t('Departure_Flight_label')}
                  <span className='text-danger'> *</span>
                </label>
              </div>
              <div className='col-4'>
                <label className='form-label'>
                  {t('Departure_Month/Year_label')}
                  <span className='text-danger'> *</span>
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className='row mb-4'>
          <div className='col-8'>
            <div className='row'>
              <div className='col-4'>
                <Dropdown
                  id='departureFlight'
                  name='departureFlight'
                  closeMenuOnSelect={true}
                  //   value={formik.values.departureFlight}
                  //   onChange={selectedOption => formik.setFieldValue('departureFlight', selectedOption)}
                  isClearable
                  onBlur={formik.handleBlur}
                  //   options={departureFlightList}
                  optionLabel='key'
                  optionValue='value'
                  placeholder={t('TEXT_SELECT_label')}
                />
              </div>
              <div className='col-4'>
                <div className='customDatePickerWidth'>
                  <DatePicker
                    id='startDate'
                    name='startDate'
                    onBlur={formik.handleBlur}
                    className='form-control'
                    autoComplete='off'
                    onChange={date => formik.setFieldValue('date', date, true)}
                    // value={formik.values.date}
                    // minDate={new Date()}
                    // onSelect={handleDate} //when day is clicked
                    disabledKeyboardNavigation
                    // disabled={disabled}
                    dateFormat='yyyy MMMM'
                    placeholderText={t('YEARMONTH_FORMAT_label')}
                    selected={formik.values.date}
                    showMonthYearPicker
                    showFullMonthYearPicker
                    showtwoColumnMonthYearPicker
                  />
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
              </div>
            </div>
          </div>

          <div className='col text-right'>
            <div className='input-group'>
              <input
                id='searchCodeNum'
                name='searchCodeNum'
                type='text'
                placeholder={t('Search_Code_or_Number_label')}
                onChange={handleAlphaNumeric}
                onBlur={formik.handleBlur}
                value={formik.values.searchCodeNum}
                className='form-control border-end-0'
              // disabled={formik.isSubmitting}
              />
              <span className='input-group-append'>
                <button
                  style={{ border: '1px solid #e5e5e5' }}
                  className='btn bg-transparent border-start-0 form-control'
                  type='button'
                  onClick={() => console.log('clicked')}
                >
                  <i className='fa fa-search'></i>
                </button>
              </span>
            </div>
          </div>
        </div>
      </form>

      <div className='mt-5'>
        <label className='form-label'>
          {t('Results_label')}
          {/* <span className='text-danger'> *</span> */}
        </label>
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
            rowHeight={40}
            headerHeight={50}
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
          />
        </div>
      </div>
    </div>
  )
}

// const mapStateToProps = state => ({
// terminalNo: state.deliveryManifestReducer.terminalNo,
// })

const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
})

export default connect(null, mapDispatchToProps)(NACCSDataEnquiry)
