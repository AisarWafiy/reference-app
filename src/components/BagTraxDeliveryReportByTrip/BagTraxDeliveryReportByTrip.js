import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import Loader from 'react-loader-spinner'
import DatePicker from 'react-datepicker'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import { useTranslation } from 'react-i18next'
import 'react-datepicker/dist/react-datepicker.css'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

import { AgGridReact } from '@ag-grid-community/react'
import { bagTraxDeliveryReportByTripActions } from 'actions/bagtraxDeliveryReportByTrip.actions'
import Moment from 'moment'
import { AllModules } from '@ag-grid-enterprise/all-modules'

function bagTraxDeliveryReportBytrip(props) {
  const [gridApi, setGridApi] = useState(null)
  const [loading, setLoading] = useState(false)
  // const [gridColumnApi, setGridColumnApi] = useState(null)
  const [rowData, setRowData] = useState([])
  const { NoTitle } = props
  const [startDate, setStartDate] = useState(null)
  const [international, setInternational] = useState(false)
  const [disableGo, setDisableGo] = useState(true)
  const [showData, setShowData] = useState(false)
  const { t } = useTranslation()
  useEffect(() => {
    if (
      props.getBagTraxDeliveryReportByTripData &&
      props.getBagTraxDeliveryReportByTripData.result
    ) {
      setShowData(true)
      setRowData(props.getBagTraxDeliveryReportByTripData.result)
      setLoading(false)
    } else if (
      props.getBagTraxDeliveryReportByTripData &&
      !props.getBagTraxDeliveryReportByTripData.result
    ) {
      setRowData([])
      setLoading(false)
    }
  }, [props.getBagTraxDeliveryReportByTripData])

  const columnDefs = [
    {
      headerName: t('Trip_Number_label'),
      field: 'tripNumber',
      sortable: true,
      filter: true,
      cellStyle: { textAlign: 'right' },

      lockPosition: true,

      width: 140,
      editable: false,
    },
    {
      headerName: t('Truck_Number_label'),
      field: 'truckNumber',
      sortable: true,
      filter: true,

      lockPosition: true,

      width: 170,
      editable: false,
    },
    {
      headerName: t('Truck_Time_label'),
      field: 'truckTime',
      sortable: true,
      filter: true,
      sort: 'desc',
      lockPosition: true,

      width: 180,
      editable: false,
    },
    {
      headerName: t('SKU_label'),
      field: 'salesSkuNumber',
      sortable: true,
      filter: true,

      lockPosition: true,

      width: 170,
      editable: false,
    },
    {
      headerName: t('SKU_Price_label'),
      field: 'salesSkuRegularPrice',
      sortable: true,

      filter: true,
      lockPosition: true,

      width: 170,

      editable: false,
    },
    {
      headerName: t('Quantity_label'),
      field: 'quantity',
      sortable: true,
      tooltipField: 'lastName',
      filter: true,
      lockPosition: true,
      cellStyle: { textAlign: 'right' },
      width: 140,
      editable: false,
    },
  ]

  const defaultColDef = {
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
    tooltipComponent: 'customTooltip',
  }
  useEffect(() => {
    if (props.formValueData && props.formValueData !== null) {
      setStartDate(props.formValueData.startDate)
      setInternational(props.formValueData.international)
    }
  }, [props.formValueData])
  const handleGo = object => {
    let data = {}
    data.transferDate = Moment(startDate).format('YYYY-MM-DD')

    data.internationalFlag = international ? 'Y' : 'N'
    props.formValue({ startDate: startDate, international: international })
    props.getBagTraxDeliveryReportByTrip(data)
    setShowData(true)
    setLoading(true)
  }
  function onGridReady(params) {
    setGridApi(params.api)
    // setGridColumnApi(params.columnApi)
  }
  useEffect(() => {
    if (startDate !== null) {
      setDisableGo(false)
    } else {
      setDisableGo(true)
    }
  }, [startDate])
  // useEffect(() => {
  //   if (startDate === null) {
  //     setShowData(false)
  //   }
  // }, [startDate])
  const onBtExport = () => {
    var excelParams = {
      fileName: 'BagTrax Delivery Report By Trip.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }
  return (
    <div className='container bg-white'>
      {NoTitle ? null : (
        <div>
          <h1 className='mb-4 mt-5'>{t('BagTrax_Delivery_Report_By_Trip_label')}</h1>
        </div>
      )}
      <div className='mt-3'>
        <Row>
          <Col xs='3'>
            <label className='form-label'>{t('Transfer_Date_label')}</label>
            <span className='astrick'>*</span>
            <br />
            <DatePicker
              dateFormat='yyyy-MM-dd'
              placeholderText={t('TEXT_DATE_FORMAT_label')}
              className='form-control'
              selected={startDate}
              onChange={date => setStartDate(date)}
            />
          </Col>
          <div className='col-2'>
            <div className='form-group mt-2'>
              <div className='custom-control custom-checkbox'>
                <br />
                <input
                  type='checkbox'
                  className='custom-control-input'
                  id='international'
                  name='international'
                  checked={international}
                  onChange={() => setInternational(!international)}
                />
                <label className='custom-control-label' htmlFor='international'>
                  {t('International_label')}{' '}
                </label>
              </div>
            </div>
          </div>

          <Col>
            <br />
            <button
              type='submit'
              onClick={handleGo}
              className='btn btn-primary mr-3 mt-1'
              disabled={disableGo}
            >
              {t('Go_label')}
            </button>
          </Col>
        </Row>
      </div>{' '}
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div>
          {showData ? (
            <div>
              <div className='text-right mr-4'>
                <br />{' '}
                <button
                  onClick={() => onBtExport()}
                  className=' btn btn-outline-secondary '
                  disabled={!(rowData !== null && rowData.length > 0)}
                >
                  {t('Export_To_Excel_label')}
                </button>
              </div>
              <div
                id='myGrid'
                className='ag-theme-alpine mt-3'
                style={{
                  width: '100%',
                  height: 350,
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
                  frameworkComponents={{ customTooltip: ToolTip }}
                  tooltipShowDelay={0}
                  onGridReady={onGridReady}
                  editType='fullRow'
                  suppressClickEdit={true}
                  undoRedoCellEditing={true}
                />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

function mapState(state) {
  return {
    getBagTraxDeliveryReportByTripData: state.getBagTraxDeliveryReportByTrip.getData,
    formValueData: state.bagTraxDeliveryReportFormValue,
  }
}

const actionCreators = {
  getBagTraxDeliveryReportByTrip: bagTraxDeliveryReportByTripActions.getBagTraxDeliveryReportByTrip,
  formValue: bagTraxDeliveryReportByTripActions.bagTraxDeliveryReportFormValue,
}

export default connect(mapState, actionCreators)(bagTraxDeliveryReportBytrip)
