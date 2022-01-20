import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { useReactToPrint } from 'react-to-print'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import { useTranslation } from 'react-i18next'
import { EXCEPT_NUMBER } from 'constants/regex'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { purchaseEnquiryByPaxActions } from 'actions/purchaseEnquiryByPax.actions'
import { AgGridReact } from '@ag-grid-community/react'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import Loader from 'react-loader-spinner'
import { linkActions } from 'actions/link.actions'
import {
  linkRenderer_bagTracking,
  linkRenderer_cartonTracking,
  linkRenderer_cageTracking,
  linkRenderer_purchaseEnquiryByPax,
} from 'components/AgGridCustomComponents/Renderers/link-page'

function purchaseEnquiryByPax(props) {
  const { NoTitle } = props
  const [gridApi, setGridApi] = useState(null)
  const [loading, setLoading] = useState(false)
  // const [gridColumnApi, setGridColumnApi] = useState(null)
  const [rowData, setRowData] = useState([])
  const [disableGo, setDisableGo] = useState(true)
  const [paxNumber, setPaxNumber] = useState('')
  const [showData, setShowData] = useState(false)
  const [msg1, setMsg1] = useState('')
  const { t } = useTranslation()
  const componentRef = useRef()

  useEffect(() => {
    if (props.getPurchaseEnquiryByPaxData && props.getPurchaseEnquiryByPaxData.result) {
      setPaxNumber(props.getPurchaseEnquiryByPaxData.result.paxNumber)
      setShowData(true)
      if (props.getPurchaseEnquiryByPaxData.result.purchaseHistoryList !== null) {
        setRowData(props.getPurchaseEnquiryByPaxData.result.purchaseHistoryList)
      } else {
        setRowData([])
      }
      setLoading(false)
    } else if (props.getPurchaseEnquiryByPaxData && !props.getPurchaseEnquiryByPaxData.result) {
      setRowData([])
      setLoading(false)
    }
  }, [props.getPurchaseEnquiryByPaxData])

  const excelStyles = [
    {
      id: 'cartonNumber',
      numberFormat: {
        format: '000000',
      },
    },
    {
      id: 'bagNumber',
      numberFormat: {
        format: '000000000000',
      },
    },
  ]
  const columnDefs = [
    {
      headerName: t('Bag_Number_label'),
      field: 'bagNo',
      sortable: true,
      filter: true,
      cellRenderer: 'DirectToBagTracking',
      lockPosition: true,
      tooltipField: 'bagNo',
      cellClass: 'bagNumber',
      width: 130,
      editable: false,
    },
    {
      headerName: t('Status_label'),
      field: 'status',
      sortable: true,
      filter: true,
      tooltipField: 'status',
      lockPosition: true,

      width: 140,
      editable: false,
    },
    {
      headerName: t('CARTON_label'),
      field: 'cartonNumber',
      sortable: true,
      filter: true,
      cellRenderer: 'DirectToCartonTracking',
      lockPosition: true,
      tooltipField: 'cartonNumber',
      width: 90,
      cellClass: 'cartonNumber',
      editable: false,
    },
    {
      headerName: t('WH_Bin_Location_label'),
      field: 'whBinLocId',
      sortable: true,
      tooltipField: 'whBinLocId',
      filter: true,
      lockPosition: true,

      width: 100,
      editable: false,
    },

    {
      headerName: t('Cage/Shelf_label'),
      field: 'cageNumber&shelfNumber',
      valueGetter: fullNameGetter,
      sortable: true,
      cellRenderer: 'DirectToCageTracking',
      filter: true,

      lockPosition: true,

      width: 95,
      editable: false,
    },
    {
      headerName: t('TRUCK_label'),
      field: 'truckNumber',
      sortable: true,
      tooltipField: 'truckNumber',
      filter: true,

      lockPosition: true,

      width: 95,
      editable: false,
    },
    {
      headerName: t('AP_Bin_Location_label'),
      field: 'apBinLocId',
      sortable: true,
      tooltipField: 'apBinLocId',
      filter: true,

      lockPosition: true,

      width: 100,
      editable: false,
    },
    {
      headerName: t('Status_Date/Time_label'),
      field: 'updatedTm',
      sortable: true,
      cellRenderer: stringFormatter,
      filter: true,
      sort: 'desc',
      lockPosition: true,

      width: 140,
      editable: false,
    },
    {
      headerName: t('Terminal_label'),
      field: 'terminalNumber',
      sortable: true,
      tooltipField: 'terminalNumber',
      filter: true,

      lockPosition: true,

      width: 100,
      editable: false,
    },
    {
      headerName: t('Operator_label'),
      field: 'updatedBy',
      sortable: true,
      tooltipField: 'updatedBy',
      filter: true,

      lockPosition: true,

      width: 100,
      editable: false,
    },
  ]
  function fullNameGetter(params) {
    if (
      params.data.cageNumber &&
      params.data.shelfNumber &&
      params.data.cageNumber !== null &&
      params.data.shelfNumber !== null
    ) {
      return params.data.cageNumber + '-' + params.data.shelfNumber
    } else {
      return ''
    }
  }
  function stringFormatter(params) {
    var date = params.value
    if (params.value) {
      var firstChar = date.slice(0, 10) + ' ' + date.slice(11, 16)
      return firstChar
    }
  }
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

  const onChangePax = object => {
    const { value } = object.target

    setPaxNumber(value.replace(EXCEPT_NUMBER, ''))
  }
  const handleGo = object => {
    let data = paxNumber

    props.getPurchaseEnquiryByPax(data)
    setShowData(true)
    setLoading(true)
  }
  function onGridReady(params) {
    setGridApi(params.api)
    // setGridColumnApi(params.columnApi)
  }
  useEffect(() => {
    if (paxNumber !== '' && paxNumber.length !== 10) {
      setMsg1(t('Pax_Number_Should_Be_Of_10_Digits_label'))
    } else {
      setMsg1('')
    }
  }, [paxNumber])
  useEffect(() => {
    if (paxNumber !== '' && paxNumber.length === 10) {
      setDisableGo(false)
    } else {
      setDisableGo(true)
    }
  }, [paxNumber])
  // useEffect(() => {
  //   if (paxNumber === null || paxNumber === '') {
  //     setShowData(false)
  //   }
  // }, [paxNumber])
  useEffect(() => {
    if (props.linkData && props.linkData.paxNumber) {
      setPaxNumber(props.linkData.paxNumber)
      props.getPurchaseEnquiryByPax(props.linkData.paxNumber)
      props.link(null)
      setShowData(true)
      setLoading(true)
    }
  }, [props.linkData])
  const onBtExport = () => {
    var excelParams = {
      fileName: 'Purchase Enquiry By Pax.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }
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
    eGridDiv.style.width = '100%'
    eGridDiv.style.height = '400px'
    api.setDomLayout(null)
  }
  const onFirstDataRendered = () => {
    gridApi.expandAll()
  }
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  return (
    <div className='ml-2 mt-4 bg-white' ref={componentRef}>
      {NoTitle ? null : (
        <div>
          <h1 className='mb-4 mt-5'>{t('Purchase_Enquiry_By_Pax_label')}</h1>
        </div>
      )}

      <div className='mt-3'>
        <Row>
          <Col xs='3'>
            <label className='form-label'> {t('Pax_Number_label')}</label>
            <span className='astrick'>*</span>
            <input
              type='text'
              placeholder={t('Search_Pax_Number_label')}
              className='form-control'
              maxLength={10}
              name='paxNumber'
              value={paxNumber}
              onChange={onChangePax}
            ></input>{' '}
            {msg1 !== '' ? (
              <span className='form-label' style={{ color: '#B13C27' }}>
                {msg1}
              </span>
            ) : null}
          </Col>

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
      </div>
      {loading === true && (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      )}
      {showData && loading !== true && props.getPurchaseEnquiryByPaxData.result ? (
        <Row className=' mb-4 mt-3'>
          <div className='col box1 mr-4' style={{ borderRadius: '0', width: '100%' }}>
            <Row>
              <Col>
                <label>{t('Pax_Details_label')} </label>
                <br />{' '}
                {props.getPurchaseEnquiryByPaxData && props.getPurchaseEnquiryByPaxData.result
                  ? props.getPurchaseEnquiryByPaxData.result.paxFirstName
                  : '-'}{' '}
                {props.getPurchaseEnquiryByPaxData && props.getPurchaseEnquiryByPaxData.result
                  ? props.getPurchaseEnquiryByPaxData.result.paxLastName
                  : '-'}
                <br />
                {props.getPurchaseEnquiryByPaxData &&
                props.getPurchaseEnquiryByPaxData.result &&
                props.getPurchaseEnquiryByPaxData.result.paxAddress
                  ? props.getPurchaseEnquiryByPaxData.result.paxAddress.addressLine1
                  : null}
                <br />
                {props.getPurchaseEnquiryByPaxData &&
                props.getPurchaseEnquiryByPaxData.result &&
                props.getPurchaseEnquiryByPaxData.result.paxAddress
                  ? props.getPurchaseEnquiryByPaxData.result.paxAddress.addressLine2
                  : null}{' '}
                <br />
                {props.getPurchaseEnquiryByPaxData &&
                props.getPurchaseEnquiryByPaxData.result &&
                props.getPurchaseEnquiryByPaxData.result.paxAddress
                  ? props.getPurchaseEnquiryByPaxData.result.paxAddress.addressCity
                  : '-'}
                <br />
                {props.getPurchaseEnquiryByPaxData &&
                props.getPurchaseEnquiryByPaxData.result &&
                props.getPurchaseEnquiryByPaxData.result.paxAddress
                  ? props.getPurchaseEnquiryByPaxData.result.paxAddress.country
                  : null}{' '}
                <br />
                {props.getPurchaseEnquiryByPaxData &&
                props.getPurchaseEnquiryByPaxData.result &&
                props.getPurchaseEnquiryByPaxData.result.paxAddress
                  ? props.getPurchaseEnquiryByPaxData.result.paxAddress.postCode
                  : null}
              </Col>
              <Col>
                <label>{t('Departure_Flight_No_label')}</label>
                <br />{' '}
                {props.getPurchaseEnquiryByPaxData && props.getPurchaseEnquiryByPaxData.result
                  ? props.getPurchaseEnquiryByPaxData.result.carrierNumber
                  : '-'}
              </Col>
              <Col>
                <label>{t('Date_label')} </label>
                <br />{' '}
                {props.getPurchaseEnquiryByPaxData && props.getPurchaseEnquiryByPaxData.result
                  ? props.getPurchaseEnquiryByPaxData.result.carrierDepDate
                  : '-'}
              </Col>
              <Col>
                <label>{t('Time_label')} </label>
                <br />{' '}
                {props.getPurchaseEnquiryByPaxData && props.getPurchaseEnquiryByPaxData.result
                  ? props.getPurchaseEnquiryByPaxData.result.carrierDepTime
                  : '-'}
              </Col>
              <Col>
                <label> {t('Total_No._of_Bags_label')} </label>
                <br />{' '}
                {props.getPurchaseEnquiryByPaxData && props.getPurchaseEnquiryByPaxData.result
                  ? props.getPurchaseEnquiryByPaxData.result.totalNumberOfBags
                  : '-'}
              </Col>
              <Col>
                <label> {t('Total_No._of_Items_label')} </label>
                <br />{' '}
                {props.getPurchaseEnquiryByPaxData && props.getPurchaseEnquiryByPaxData.result
                  ? props.getPurchaseEnquiryByPaxData.result.totalNumberOfItems
                  : '-'}
              </Col>
            </Row>
          </div>
        </Row>
      ) : null}
      {showData && loading !== true && rowData.length > 0 ? (
        <div>
          <div className='text-right '>
            <br />{' '}
            <button
              type='submit'
              onClick={onBtPrint}
              className='btn btn-outline-secondary mr-3 mt-1'
              disabled={!(rowData.length > 0)}
            >
              {t('Print_label')}
            </button>
            <button
              onClick={() => onBtExport()}
              className=' btn btn-outline-secondary '
              disabled={!(rowData.length > 0)}
            >
              {t('Export_To_Excel_label')}
            </button>
          </div>
          <div>
            <h2 className='mt-4'>{t('Purchase_History_label')}</h2>
          </div>
          <div
            id='myGrid'
            className='ag-theme-alpine mt-3'
            style={{
              width: '100%',
              height: '400px',
            }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              animateRows={true}
              rowHeight={40}
              headerHeight={50}
              defaultColDef={defaultColDef}
              context={props.context}
              modules={AllModules}
              frameworkComponents={{
                customTooltip: ToolTip,
                DirectToBagTracking: linkRenderer_bagTracking,
                DirectToCartonTracking: linkRenderer_cartonTracking,
                DirectToCageTracking: linkRenderer_cageTracking,
                DirectToPurchaseEnquiry: linkRenderer_purchaseEnquiryByPax,
              }}
              pagination={true}
              paginationPageSize={35}
              excelStyles={excelStyles}
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
  )
}

function mapState(state) {
  return {
    getPurchaseEnquiryByPaxData: state.getPurchaseEnquiryByPax.getData,
    linkData: state.linksuccess,
  }
}

const actionCreators = {
  getPurchaseEnquiryByPax: purchaseEnquiryByPaxActions.getPurchaseEnquiryByPax,
  link: linkActions.linksuccess,
}

export default connect(mapState, actionCreators)(purchaseEnquiryByPax)
