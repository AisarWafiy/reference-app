import React, { useState } from 'react'
import { AgGridReact } from '@ag-grid-community/react'
// import { AllCommunityModules } from '@ag-grid-community/all-modules'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import Moment from 'moment'
import { useHistory } from 'react-router-dom'
import { setPreviewFlightNo, setPreviewDepartureDate } from 'actions/action-naccs'
import { connect } from 'react-redux'
import { AllModules } from '@ag-grid-enterprise/all-modules'

const redirectRenderer = (params, onClick) => {
  if (params.value >= 0) {
    return (
      <button className='btn btn-link p-0' style={{ fontSize: 'inherit' }} onClick={onClick}>
        {params.value}
      </button>
    )
  } else {
    return <span>{params.value}</span>
  }
}

const FlightsGrid = props => {
  const { setPreviewFlightNo, setPreviewDepartureDate } = props
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const { t } = useTranslation()
  const history = useHistory()

  const redirectToNACCSPreview = async () => history.push('/Customs/NACCS-Processing/NACCS-Preview')

  const redirectNACCSPreview = params => {
    const maintainCarrierData = {
      carrierCode: params.data.carrierFullName,
      departureDate: Moment()._d,
    }
    const depDate = maintainCarrierData.departureDate
    setPreviewFlightNo({
      key: maintainCarrierData.carrierCode,
      value: maintainCarrierData.carrierCode,
    })
    setPreviewDepartureDate(depDate)
    redirectToNACCSPreview()
  }

  const frameworkComponents = {
    redirectNACCSPreview: params => redirectRenderer(params, () => redirectNACCSPreview(params)),
  }
  const columnDefs = [
    {
      headerName: t('Flight_Code_Number_label'),
      field: 'carrierFullName',
      sortable: true,
      filter: true,
      lockPosition: true,
      // cellStyle: rowStyle,
      // flex: 1,
      // editable: false,
    },

    {
      headerName: t('Time_label'),
      field: 'carrierTime',
      sortable: true,
      filter: true,
      sort: 'asc',
      lockPosition: true,
      // cellStyle: rowStyle,
      // suppressSizeToFit: true,
      // flex: 1,
      // editable: false,
    },

    {
      headerName: t('Status_label'),
      field: 'carrierStatus',
      sortable: true,
      filter: true,
      lockPosition: true,
      // cellStyle: rowStyle,
      // suppressSizeToFit: true,
      // flex: 1,
      // editable: true,
      cellRenderer: params => {
        switch (params.value) {
          case 'Departed':
            return `<span class='badge badge-success p-2'>Departed</span>`
          case 'Delayed':
            return `<span class='badge badge-warning p-2'>Delayed</span>`
          case 'Scheduled':
            return `<span class='badge badge-light p-2'>Scheduled</span>`
          case 'Canceled':
            return `<span class='badge badge-danger p-2'>Cancelled</span>`

          default:
            return null
        }
      },
    },

    {
      headerName: t('NACCS_Status_label'),
      field: 'naccsStatus',
      sortable: true,
      filter: true,
      lockPosition: true,
    },
    {
      headerName: t('Declarations_label'),
      field: 'countDeclared',
      sortable: true,
      filter: true,
      lockPosition: true,
      cellRenderer: 'redirectNACCSPreview',
      // cellStyle: rowStyle,
      // suppressSizeToFit: true,
      // flex: 3,
      // editable: true,
    },
    {
      headerName: t('Acknowledgements_label'),
      field: 'countAck',
      sortable: true,
      filter: true,
      lockPosition: true,
      cellRenderer: 'redirectNACCSPreview',
      // cellStyle: rowStyle,
      // suppressSizeToFit: true,
      // flex: 3,
      // editable: true,
    },
    {
      headerName: t('Errors_label'),
      field: 'countError',
      sortable: true,
      filter: true,
      lockPosition: true,
      cellRenderer: 'redirectNACCSPreview',
      // cellStyle: rowStyle,
      // suppressSizeToFit: true,
      // flex: 3,
      // editable: true,
    },
  ]
  const defaultColDef = {
    flex: 1,
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
  const onBtExport = () => {
    var excelParams = {
      fileName: 'Dashboard.xlsx',
    }
    gridApi.exportDataAsExcel(excelParams)
  }

  const onGridReady = params => {
    setGridApi(params.api)
  }
  let flightDetails = useSelector(state => state?.dashboardReducer?.dashboardData)?.flightDetails

  return (
    <>
      <div className='row mt-1 mb-1'>
        <div className='col text-right'>
          <button
            type='submit'
            className='btn btn-outline-secondary'
            style={{ 'width': '7%', 'padding': '0px 0px' }}
            disabled={!(flightDetails?.length > 0)}
            onClick={() => onBtExport()}
          >
            <small> {t('Export_To_Excel_label')}</small>
          </button>
        </div>
      </div>
      <div className='box1 ml-0 p-4'>
        <div className='ag-theme-alpine' style={{ height: 400, width: '100%' }}>
          <AgGridReact
            columnDefs={columnDefs}
            rowData={flightDetails ? flightDetails : []}
            animateRows={true}
            rowHeight={30}
            headerHeight={40}
            paginationPageSize={10}
            defaultColDef={defaultColDef}
            // frameworkComponents={rowState.frameworkComponents}
            pagination={true}
            context={props.context}
            onGridReady={onGridReady}
            frameworkComponents={frameworkComponents}
            modules={AllModules}
            // onRowEditingStopped={onRowEditingStopped}
            // onRowEditingStarted={onRowEditingStarted}
            // onCellClicked={onCellClicked}
            // editType='fullRow'
            // suppressClickEdit={true}
            // undoRedoCellEditing={true}
          />
        </div>
      </div>
    </>
  )
}

const mapDispatchToProps = dispatch => ({
  setPreviewFlightNo: data => dispatch(setPreviewFlightNo(data)),
  setPreviewDepartureDate: data => dispatch(setPreviewDepartureDate(data)),
})
function mapState(state) {
  return {}
}
export default connect(mapState, mapDispatchToProps)(FlightsGrid)
