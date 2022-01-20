import React, { useEffect, useState, useRef } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import Loader from 'react-loader-spinner'
import { useFormik } from 'formik'
import { useReactToPrint } from 'react-to-print'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { stampDutyActions } from 'actions/stampDuty.actions'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { AgGridColumn, AgGridReact } from '@ag-grid-community/react'

import { Dropdown, DropdownSelectAll } from 'components/UI/Input'
import { AllModules } from '@ag-grid-enterprise/all-modules'

let initialValues = {}

function stampDutyReport(props) {
  const [gridApi, setGridApi] = useState(null)
  const [loading, setLoading] = useState(false)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [disableGo, setDisableGo] = useState(true)
  const { t } = useTranslation()
  const [date, setDate] = useState(null)
  const [location, setLocation] = useState(null)
  const [showData, setShowData] = useState(false)
  const [rowData, setRowData] = useState([])
  const [locationDrop, setLocationDrop] = useState('')
  const [monthDrop, setMonthDrop] = useState('')
  const componentRef = useRef()
  useEffect(() => {
    props.getLocation()
  }, [props.getLocation])
  useEffect(() => {
    props.getMonth()
  }, [props.getMonth])

  useEffect(() => {
    if (props.getMonthData) {
      setMonthDrop(props.getMonthData.result)
    }
  }, [props.getMonthData])
  useEffect(() => {
    if (props.getStampData && props.getStampData.result) {
      setRowData(props.getStampData.result)
      setLoading(false)
    } else if (props.getStampData && !props.getStampData.result) {
      setLoading(false)
      setRowData([])
    }
  }, [props.getStampData])

  useEffect(() => {
    if (props.getLocationData) {
      const list = []

      props.getLocationData.result.forEach(function (element) {
        list.push({ key: element, value: element })
      })
      setLocationDrop(list)
    }
  }, [props.getLocationData])
  const columnDefs = [
    {
      headerName: t('S.No_label'),
      valueGetter: 'node.rowIndex + 1',
      lockPosition: true,
      sortable: true,
      filter: true,
      cellStyle: { textAlign: 'right' },
      width: 100,

      editable: false,
    },
    {
      headerName: t('Gross_Sales_Amount_label'),
      field: 'grossSaleAmount',

      sortable: true,
      filter: true,
      cellStyle: { textAlign: 'right' },

      editable: false,
      width: 180,
    },
    {
      headerName: t('Total_Taxable_Amount_label'),
      field: 'totalTaxableAmount',
      sortable: true,
      filter: true,
      cellEditor: 'numberEditor',

      cellStyle: { textAlign: 'right' },
      width: 200,
      editable: true,
    },
    {
      headerName: t('Amount_of_Revenue_Stamp_label'),
      field: 'amountOfRevenueStamp',
      sortable: true,
      filter: true,

      cellStyle: { textAlign: 'right' },
      cellEditor: 'textEditor',

      width: 230,
      editable: true,
    },

    {
      headerName: t('Stamps_label'),
      field: 'numberOfStamps',
      sortable: true,

      filter: true,

      cellStyle: { textAlign: 'right' },
      cellEditor: 'textEditor',

      width: 110,
      editable: true,
    },
    {
      headerName: t('Tax_Amount_label'),
      field: 'taxAmount',
      sortable: true,

      filter: true,

      cellEditor: 'textEditor',

      width: 140,
      cellStyle: { textAlign: 'right' },
      editable: true,
    },
  ]

  const defaultColDef = {
    width: 150,
    cellStyle: rowStyle,
    filter: true,
    resizable: true,
    // floatingFilter: true,
    // editable: true,
    borders: true,
    field: 'value',
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
  })

  const onChangeDate = selectedOption => {
    setDate(selectedOption)
  }
  const onChangeLocation = selectedOption => {
    setLocation(selectedOption)
  }
  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }
  const handleGo = () => {
    let data = {}
    data.location = location.value
    data.monthYear = date.monthYear

    props.getStamp(data)
    setShowData(true)
    setLoading(true)
  }
  useEffect(() => {
    if (date !== null && location !== null) {
      setDisableGo(false)
    } else {
      setDisableGo(true)
    }
  }, [date, location])

  useEffect(() => {
    if (date === null && location === null) {
      setShowData(false)
    }
  }, [date, location])
  const onBtExport = () => {
    var excelParams = {
      fileName: 'Stamp Duty Report.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  const onBtPrint = () => {
    const api = gridApi
    setPrinterFriendly(api)
    setTimeout(function () {
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
    eGridDiv.style.width = '1000px'
    eGridDiv.style.height = '330px'
    api.setDomLayout(null)
  }
  const onFirstDataRendered = () => {
    gridApi.expandAll()
  }
  return (
    <div className='container bg-white' ref={componentRef}>
      <div>
        <h1 className='mb-5 mt-5'>{t('Stamp_Duty_Report_label')}</h1>
      </div>

      <div className='mt-3'>
        <Row>
          <Col xs='3'>
            <label className='form-label'>{t('Location_label')}</label>
            <span className='astrick'>*</span>
            <br />

            <Dropdown
              closeMenuOnSelect={true}
              className='form-control mb-4 '
              isClearable
              value={location}
              onChange={onChangeLocation}
              placeholder={t('TEXT_SELECT_label')}
              options={locationDrop}
              optionLabel='value'
              optionValue='value'
              onBlur={formik.handleBlur}
            />
          </Col>
          <Col xs='3'>
            <label className='form-label'>{t('Departure_Date_label')}</label>
            <span className='astrick'>*</span>
            <Dropdown
              closeMenuOnSelect={true}
              className='form-control mb-4 '
              isClearable
              value={date}
              onChange={onChangeDate}
              placeholder={t('TEXT_SELECT_label')}
              options={monthDrop}
              optionLabel='displayMonth'
              optionValue='monthYear'
              onBlur={formik.handleBlur}
            />
          </Col>
          <Col xs='2'>
            <br />{' '}
            <button
              disabled={disableGo}
              className='btn btn-primary mr-3 mt-1'
              type='submit'
              onClick={handleGo}
            >
              {t('BUTTON_SEARCH_label')}
            </button>
          </Col>
          {showData ? (
            <Col className='text-right mr-4'>
              <br />{' '}
              <button
                type='submit'
                onClick={onBtPrint}
                className='btn btn-outline-secondary mr-3 mt-1'
              >
                {t('Print_label')}
              </button>
              <button onClick={() => onBtExport()} className=' btn btn-outline-secondary '>
                {t('Export_To_Excel_label')}
              </button>
            </Col>
          ) : null}
        </Row>
      </div>
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div>
          {showData ? (
            <div>
              <div className='mt-4'>
                <h2>{t('Results_label')}</h2>
              </div>
              <div
                id='myGrid'
                className='ag-theme-alpine'
                style={{
                  width: '1000px',
                  height: '330px',
                }}
              >
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowData}
                  pagination={true}
                  paginationPageSize={35}
                  rowHeight={30}
                  headerHeight={40}
                  defaultColDef={defaultColDef}
                  context={props.context}
                  modules={AllModules}
                  onGridReady={onGridReady}
                  rowSelection={'multiple'}
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
    getMonthData: state.getMonth.getData,
    getLocationData: state.getLocationId.getData,
    getStampData: state.getstampDuty.getData,
  }
}

const actionCreators = {
  getMonth: stampDutyActions.getMonth,
  getLocation: stampDutyActions.getLocationId,
  getStamp: stampDutyActions.getstampDuty,
}

export default connect(mapState, actionCreators)(stampDutyReport)
