import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import { linkActions } from 'actions/link.actions'
import { EXCEPT_NUMBER } from 'constants/regex'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { ClipboardModule } from '@ag-grid-enterprise/clipboard'
import { ExcelExportModule } from '@ag-grid-enterprise/excel-export'
import { AgGridReact } from '@ag-grid-community/react'
import { cageTrackingEnquiryActions } from 'actions/cageTrackingEnquiry.actions'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import { useReactToPrint } from 'react-to-print'
import Loader from 'react-loader-spinner'
import {
  linkRenderer_bagTracking,
  linkRenderer_cartonTracking,
  linkRenderer_cageTracking,
  linkRenderer_purchaseEnquiryByPax,
} from 'components/AgGridCustomComponents/Renderers/link-page'

function cageTrackingEnquiry(props) {
  const { NoTitle } = props
  const [loading, setLoading] = useState(false)
  const [gridApi, setGridApi] = useState(null)
  // const [gridColumnApi, setGridColumnApi] = useState(null)
  const [gridApi1, setGridApi1] = useState(null)
  // const [gridColumnApi1, setGridColumnApi1] = useState(null)
  const [rowData, setRowData] = useState([])
  const [rowData1, setRowData1] = useState([])
  const [disableGo, setDisableGo] = useState(true)
  const [cageNumber, setCageNumber] = useState('')
  const [cageError, setCageError] = useState('')
  const [showData, setShowData] = useState(false)
  const { t } = useTranslation()
  const componentRef = useRef()
  const autoGroupColumnDef = {
    width: 240,
  }
  const columnDefs = [
    {
      headerName: t('Shelves_in_Cage/Total_no_of_Cartons_label'),
      field: 'group',
      rowGroup: true,
      hide: true,
      width: 80,
      filter: true,
      sortable: true,
      lockPosition: true,
    },

    {
      headerName: t('Carton_Number_label'),
      field: 'cartonNo',
      cellRenderer: 'DirectToCartonTracking',
      tooltipField: 'cartonNo',
      filter: true,
      sortable: true,
      width: 140,
    },
    {
      headerName: t('Bag_Status_label'),
      field: 'entityDisplayStatus',
      tooltipField: 'entityDisplayStatus',
      filter: true,

      sortable: true,
    },
    {
      headerName: t('Bag_Number_label'),
      field: 'bagNo',
      cellRenderer: 'DirectToBagTracking',
      tooltipField: 'bagNo',
      filter: true,
      width: 120,
      sortable: true,
    },
    {
      headerName: t('Pax_Number_label'),
      field: 'paxNo',
      cellRenderer: 'DirectToPurchaseEnquiry',
      tooltipField: 'paxNo',
      filter: true,
      width: 120,
      sortable: true,
    },
    {
      headerName: t('Last_Name_label'),
      field: 'paxLastName',
      tooltipField: 'paxLastName',
      filter: true,
      width: 120,
      sortable: true,
    },
    {
      headerName: t('First_Name_label'),
      field: 'paxFirstName',
      tooltipField: 'paxFirstName',
      filter: true,
      width: 120,
      sortable: true,
    },
  ]
  const columnDefs1 = [
    {
      headerName: t('Status_label'),
      field: 'entityDisplayStatus',
      sortable: true,
      filter: true,
      tooltipField: 'entityDisplayStatus',
      lockPosition: true,

      width: 140,
      editable: false,
    },
    {
      headerName: t('TRUCK_label'),
      field: 'truckNo',
      sortable: true,

      filter: true,
      tooltipField: 'truckNo',
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

      width: 180,
      editable: false,
    },

    {
      headerName: t('Status_Date/Time_label'),
      field: 'createdTm',
      sortable: true,
      sort: 'desc',
      filter: true,
      cellRenderer: stringFormatter,
      lockPosition: true,

      width: 165,
      editable: false,
    },
    {
      headerName: t('Terminal_label'),
      field: 'terminalNo',
      sortable: true,
      tooltipField: 'terminalNo',
      filter: true,

      lockPosition: true,

      width: 180,
      editable: false,
    },
    {
      headerName: t('Operator_label'),
      field: 'createdBy',
      sortable: true,
      tooltipField: 'createdBy',
      filter: true,

      lockPosition: true,

      width: 180,
      editable: false,
    },
  ]
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

    cellRendererParams: {
      suppressCount: true, // turn off the row count
    },
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

  function onGridReady(params) {
    setGridApi(params.api)
    // setGridColumnApi(params.columnApi)
  }
  function onGridReady1(params) {
    setGridApi1(params.api)
    // setGridColumnApi(params.columnApi)
  }
  const handleGo = object => {
    let data = cageNumber

    props.getCageTrackingEnquiry(data)
    setShowData(true)
    setLoading(true)
  }
  const onChangeCageNumber = object => {
    const { value } = object.target
    const maxLength = 3
    setCageNumber(value.replace(EXCEPT_NUMBER, '').substring(0, maxLength))
    // for showing the email confirmation text
  }

  useEffect(() => {
    if (cageNumber.length !== 3 && cageNumber !== '') {
      setCageError(t('Searched_Cage_Number_should_be_3_character_long_label'))
    } else {
      setCageError('')
    }
  }, [cageNumber])

  useEffect(() => {
    if (cageNumber !== null && cageNumber.length === 3) {
      setDisableGo(false)
    } else {
      setDisableGo(true)
    }
  }, [cageNumber])
  // useEffect(() => {
  //   if (cageNumber === null) {
  //     setShowData(false)
  //   }
  // }, [cageNumber])
  useEffect(() => {
    if (props.linkData && props.linkData.cageNumber) {
      setCageNumber(props.linkData.cageNumber)
      props.getCageTrackingEnquiry(props.linkData.cageNumber)
      props.link(null)
      setShowData(true)
      setLoading(true)
    }
  }, [props.linkData])

  useEffect(() => {
    if (props.getCageTrackingEnquiryData && props.getCageTrackingEnquiryData.result) {
      setCageNumber(props.getCageTrackingEnquiryData.result.cageNumber)
      setShowData(true)
      if (props.getCageTrackingEnquiryData.result.statusHistoryList !== null) {
        setRowData(props.getCageTrackingEnquiryData.result.statusHistoryList)
      } else {
        setRowData([])
      }
      if (props.getCageTrackingEnquiryData.result.shelfCountList !== null) {
        const newRowData = []
        props.getCageTrackingEnquiryData.result.shelfCountList.forEach((getDataItem, index) => {
          getDataItem.bagDetails.forEach((bag, index) => {
            newRowData.push({
              group:
                'Shelves in Cage:' +
                getDataItem.shelfNumber +
                ' , Total no of Cartons:' +
                getDataItem.totalNoOfCartons,
              cartonNo: bag.cartonNo,
              entityDisplayStatus: bag.entityDisplayStatus,
              bagNo: bag.bagNo,
              paxNo: bag.paxNo,
              paxLastName: bag.paxLastName,
              paxFirstName: bag.paxFirstName,
            })
          })
        })
        setRowData1(newRowData)
      } else {
        setRowData1([])
      }
      setLoading(false)
    } else if (props.getCageTrackingEnquiryData && !props.getCageTrackingEnquiryData.result) {
      setRowData([])
      setRowData1([])
      setLoading(false)
    }
  }, [props.getCageTrackingEnquiryData])
  const onBtExport = () => {
    var excelParams = {
      fileName: 'Status History.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }
  const onBtExport1 = () => {
    var excelParams = {
      fileName: 'Bags in the Cage.xlsx',
    }
    gridApi1.exportDataAsExcel(excelParams)
  }
  function cell(text, styleId) {
    return {
      styleId: styleId,
      data: {
        type: /^\d+$/.test(text) ? 'Number' : 'String',
        value: String(text),
      },
    }
  }
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  function setPrinterFriendly(api, api1) {
    const eGridDiv = document.querySelector('#myGrid1')
    eGridDiv.style.height = ''

    const eGridDiv1 = document.querySelector('#myGrid2')
    eGridDiv1.style.height = ''
    api1.setDomLayout('print')
    api.setDomLayout('print')
  }
  function setNormal(api, api1) {
    const eGridDiv = document.querySelector('#myGrid1')
    eGridDiv.style.width = '100%'
    eGridDiv.style.height = '300px'
    const eGridDiv1 = document.querySelector('#myGrid2')
    eGridDiv1.style.width = '100%'
    eGridDiv1.style.height = '500px'
    api.setDomLayout(null)
    api1.setDomLayout(null)
  }
  const onBtPrint = () => {
    const api = gridApi
    const api1 = gridApi1
    setPrinterFriendly(api, api1)
    setTimeout(function () {
      handlePrint()
      setTimeout(function () {
        setNormal(api, api1)
      }, 2000)
    }, 2000)
  }

  return (
    <div className='container bg-white' ref={componentRef}>
      {NoTitle ? null : (
        <div>
          <h1 className='mb-4 mt-5'>{t('Cage_Tracking_Enquiry_label')}</h1>
        </div>
      )}
      {/* <button onClick={getSelectedRowData} style={{ margin: 10 }}>
        Get Selected Nodes
      </button> */}

      <div className='mt-3'>
        <Row>
          <Col xs='3'>
            <label className='form-label'>{t('Cage_Number_label')}</label>
            <span className='astrick'>*</span>
            <br />

            <input
              name='cageNumber'
              value={cageNumber}
              autoComplete='off'
              type='text'
              onChange={onChangeCageNumber}
              placeholder={t('Cage_Number_label')}
              className='form-control'
            ></input>
            {cageError !== '' ? (
              <span className='form-label' style={{ color: '#B13C27' }}>
                {cageError}
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
        {loading === true && (
          <div style={{ textAlign: 'center' }} className='mt-5'>
            <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
          </div>
        )}
        {showData && loading !== true ? (
          <Row className='mb-4 mt-3'>
            <div className='col box1 mr-4' style={{ borderRadius: '0', width: '100%' }}>
              <Row>
                <Col>
                  <label>{t('Pickup_Location_label')}</label>
                  <br />
                  {props.getCageTrackingEnquiryData && props.getCageTrackingEnquiryData.result
                    ? props.getCageTrackingEnquiryData.result.pickupLocation
                    : '-'}
                </Col>
                <Col>
                  <label>{t('Departure_Date_label')} </label>
                  <br />{' '}
                  {props.getCageTrackingEnquiryData && props.getCageTrackingEnquiryData.result
                    ? props.getCageTrackingEnquiryData.result.departureDate
                    : '-'}
                </Col>

                <Col>
                  <label> {t('Total_No._of_Cartons_label')} </label>
                  <br />{' '}
                  {props.getCageTrackingEnquiryData && props.getCageTrackingEnquiryData.result
                    ? props.getCageTrackingEnquiryData.result.totalNumberOfCartons
                    : '-'}
                </Col>
              </Row>
            </div>
          </Row>
        ) : null}
      </div>
      <div className='Print'>
        {showData && loading !== true ? (
          <div>
            <div>
              <div>
                <Row>
                  <Col>
                    {' '}
                    <h2 className='mt-4'>{t('Status_History_label')}</h2>
                  </Col>
                  {showData ? (
                    <Col className='text-right mr-4'>
                      <br />{' '}
                      <button
                        type='submit'
                        onClick={onBtPrint}
                        className='btn btn-outline-secondary mr-3 mt-1'
                        disabled={
                          !(rowData !== null && rowData.length > 0) &&
                          !(rowData1 !== null && rowData1.length > 0)
                        }
                      >
                        {t('Print_label')}
                      </button>
                      <button
                        onClick={() => onBtExport()}
                        className=' btn btn-outline-secondary '
                        disabled={!(rowData !== null && rowData.length > 0)}
                      >
                        {t('Export_To_Excel_label')}
                      </button>
                    </Col>
                  ) : null}
                </Row>
              </div>
              <div
                id='myGrid1'
                className='ag-theme-alpine mt-3'
                style={{
                  width: '100%',
                  height: '300px',
                }}
              >
                <AgGridReact
                  columnDefs={columnDefs1}
                  rowData={rowData}
                  animateRows={true}
                  rowHeight={40}
                  headerHeight={50}
                  defaultColDef={defaultColDef}
                  context={props.context}
                  pagination={true}
                  paginationPageSize={35}
                  modules={AllModules}
                  frameworkComponents={{
                    customTooltip: ToolTip,
                    DirectToBagTracking: linkRenderer_bagTracking,
                    DirectToCartonTracking: linkRenderer_cartonTracking,
                    DirectToCageTracking: linkRenderer_cageTracking,
                    DirectToPurchaseEnquiry: linkRenderer_purchaseEnquiryByPax,
                  }}
                  cellRendererParams={{
                    suppressCount: true,
                    suppressDoubleClickExpand: true,
                    suppressEnterExpand: true,
                  }}
                  tooltipShowDelay={0}
                  onGridReady={onGridReady}
                  editType='fullRow'
                  suppressClickEdit={true}
                  undoRedoCellEditing={true}
                />
              </div>
            </div>
            <div>
              <div>
                <Row>
                  <Col>
                    {' '}
                    <h2 className='mt-4'>Bags in the Cage</h2>
                  </Col>
                  {showData && loading !== true ? (
                    <Col className='text-right mr-4'>
                      <br />{' '}
                      <button
                        onClick={() => onBtExport1()}
                        className=' btn btn-outline-secondary '
                        disabled={!(rowData1 !== null && rowData1.length > 0)}
                      >
                        {t('Export_To_Excel_label')}
                      </button>
                    </Col>
                  ) : null}
                </Row>
              </div>
              <div
                id='myGrid2'
                className='ag-theme-alpine mt-3'
                style={{
                  width: '100%',
                  height: '500px',
                }}
              >
                <AgGridReact
                  columnDefs={columnDefs}
                  rowData={rowData1}
                  animateRows={true}
                  rowHeight={40}
                  headerHeight={50}
                  defaultColDef={defaultColDef}
                  autoGroupColumnDef={autoGroupColumnDef}
                  context={props.context}
                  pagination={true}
                  paginationPageSize={35}
                  frameworkComponents={{
                    customTooltip: ToolTip,
                    DirectToBagTracking: linkRenderer_bagTracking,
                    DirectToCartonTracking: linkRenderer_cartonTracking,
                    DirectToCageTracking: linkRenderer_cageTracking,
                    DirectToPurchaseEnquiry: linkRenderer_purchaseEnquiryByPax,
                  }}
                  modules={AllModules}
                  onGridReady={onGridReady1}
                  rowSelection={'multiple'}
                  editType='fullRow'
                  suppressClickEdit={true}
                  undoRedoCellEditing={true}
                  groupMultiAutoColumn={true}
                  groupDefaultExpanded={1}
                  cellRendererParams={{
                    suppressCount: true,
                    suppressDoubleClickExpand: true,
                    suppressEnterExpand: true,
                  }}
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function mapState(state) {
  return {
    getCageTrackingEnquiryData: state.getCageTrackingEnquiry.getData,
    linkData: state.linksuccess,
  }
}

const actionCreators = {
  link: linkActions.linksuccess,
  getCageTrackingEnquiry: cageTrackingEnquiryActions.getCageTrackingEnquiry,
}

export default connect(mapState, actionCreators)(cageTrackingEnquiry)
