import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect } from 'react-redux'
import i18next from 'i18next'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { Row, Col } from 'react-bootstrap'
import Loader from 'react-loader-spinner'
import { EXCEPT_ALPHANUMERIC, EXCEPT_NUMBER } from 'constants/regex'
import { useFormik } from 'formik'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { cageActions } from 'actions/cage.actions'
import { alertActions } from 'actions/alert.actions'
import { AgGridColumn, AgGridReact } from '@ag-grid-community/react'
import { ALPHANUMERIC_NO_SC, NUMBER_NO_SC } from 'constants/regex'
import { useTranslation } from 'react-i18next'
import { AllModules } from '@ag-grid-enterprise/all-modules'

let initialValues = {}

const TextEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
  const refInput = useRef(null)

  useEffect(() => {
    // focus on the input
    setTimeout(() => refInput.current.focus())
  }, [])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value
      },

      isCancelBeforeStart() {
        return false
      },
    }
  })

  return (
    <input
      type='text'
      ref={refInput}
      value={value}
      onChange={event =>
        setValue(event.target.value.replace(EXCEPT_ALPHANUMERIC, '').substring(0, 25))
      }
      className='form-control'
    />
  )
})
const NumberEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(parseInt(props.value))
  const refInput = useRef(null)

  useEffect(() => {
    // focus on the input
    setTimeout(() => refInput.current.focus())
  }, [])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return value
      },

      isCancelBeforeStart() {
        return false
      },
    }
  })

  return (
    <input
      type='text'
      ref={refInput}
      value={value}
      onChange={event => setValue(event.target.value.replace(EXCEPT_NUMBER, '').substring(0, 3))}
      className='form-control'
    />
  )
})
const actionCellRenderer = params => {
  let divElement = document.createElement('div')

  let editingCells = params.api.getEditingCells()

  let isCurrentRowEditing = editingCells.some(cell => {
    return cell.rowIndex === params.node.rowIndex
  })

  if (isCurrentRowEditing) {
    divElement.innerHTML = `
<button data-action="save"  class="save-option"> Save  </button>
<button  data-action="cancel" class="cancel-option"> Cancel </button>
`
  } else {
    divElement.innerHTML = `
<button data-action="edit" class="edit-option"> Edit </button>
<button data-action="delete" class="edit-option"> Delete </button>
`
  }

  return divElement
}
function maintainCage(props) {
  const [cageError, setCageError] = useState('')
  const [loading, setLoading] = useState(true)
  const { getCageData, takeCage, deleteCage } = props
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const { t } = useTranslation()
  const [count, setCount] = useState(0)
  const [cageNumber, setCageNumber] = useState(null)
  const [a, setA] = useState([])

  const columnDefs = [
    {
      headerName: t('Cage_Number_label'),
      field: 'cageNumber',
      lockPosition: true,
      sortable: true,
      filter: true,
      cellStyle: { textAlign: 'right' },
      width: 150,
      sort: 'asc',
      editable: false,
    },
    {
      headerName: t('Status_label'),
      field: 'entityStatus.entityDisplayStatus',
      lockPosition: true,
      sortable: true,
      filter: true,

      editable: false,
      width: 150,
    },
    {
      headerName: t('Maximum_no._of_Cartons_per_Cage_label'),
      field: 'maxNumCartons',
      sortable: true,
      filter: true,
      cellEditor: 'numberEditor',

      lockPosition: true,
      cellStyle: { textAlign: 'right' },
      width: 165,
      editable: true,
    },
    {
      headerName: t('Remarks_label'),
      field: 'cageRemarks',
      sortable: true,
      tooltipField: 'cageRemarks',
      filter: true,
      lockPosition: true,
      cellEditor: 'textEditor',

      width: 200,
      editable: true,
    },

    {
      headerName: t('Description_label'),
      field: 'cageDesc',
      sortable: true,

      filter: true,
      lockPosition: true,
      cellEditor: 'textEditor',
      tooltipField: 'cageDesc',
      width: 200,
      editable: true,
    },
    {
      headerName: t('Action_label'),
      field: 'action',
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'action',
    },
  ]

  const defaultColDef = {
    width: 150,
    resizable: true,
    filter: true,
    wrapText: true,
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
    borders: true,
    tooltipComponent: 'customTooltip',
    field: 'value',
  }
  useEffect(() => {
    props.takeCage()
  }, [props.takeCage])

  useEffect(() => {
    if (props.postCage && props.postCage.result) {
      if (cageNumber !== null && cageNumber.length === 3) {
        props.searchCage(cageNumber)
        setLoading(false)
      } else {
        props.takeCage()
      }
    }
    if (props.postCage && !props.postCage.result) {
      if (cageNumber !== null && cageNumber.length === 3) {
        props.searchCage(cageNumber)
        setLoading(false)
      } else {
        props.takeCage()
      }
    }
  }, [props.postCage])
  useEffect(() => {
    if (props.delete) {
      props.takeCage()
    }
  }, [props.delete])

  useEffect(() => {
    if (getCageData && getCageData.result) {
      setA(getCageData.result)
      setLoading(false)
    }
    if (getCageData && !getCageData.result) {
      setA([])
      setLoading(false)
    }
  }, [getCageData])

  const checklength = value => {
    if (value.length <= 25) {
      return true
    } else {
      return false
    }
  }

  const checkCarton = value => {
    if (value >= 100 && value <= 999) {
      return true
    } else {
      return false
    }
  }
  const onCellClicked = params => {
    // Handle click event for action cells
    if (params.column.colId === 'action' && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action

      if (action === 'edit') {
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
        })
      }

      if (action === 'delete') {
        params.api.updateRowData({ remove: [gridApi.getRowNode(params.node.rowIndex).data] })
        let data = params.node.data.cageNumber
        deleteCage(data)
        setLoading(true)
      }
      if (action === 'save') {
        params.api.stopEditing(false)
        setLoading(true)

        let data = {}
        data.cageNumber = params.node.data.cageNumber
        data.maxNumCartons = params.node.data.maxNumCartons
        data.cageRemarks = params.node.data.cageRemarks
        data.cageDesc = params.node.data.cageDesc

        props.updateCage(data)
      }

      if (action === 'cancel') {
        params.api.stopEditing(true)
      }
    }
  }

  const onRowEditingStarted = params => {
    params.api.refreshCells({
      columns: ['action'],
      rowNodes: [params.node],
      force: true,
    })
  }
  const onRowEditingStopped = params => {
    gridApi.undoCellEditing()
    params.api.refreshCells({
      columns: ['action'],
      rowNodes: [params.node],
      force: true,
    })
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
  })

  const onSearch = object => {
    const { value } = object.target
    const maxLength = 3

    setCageNumber(value.replace(EXCEPT_NUMBER, '').substring(0, maxLength))
  }

  useEffect(() => {
    if (cageNumber !== null && cageNumber.length === 3) {
      props.searchCage(cageNumber)
    }

    if (cageNumber === '') {
      takeCage()
      setA(props.getCarrierData && props.getCarrierData.result)
    }
  }, [cageNumber])

  useEffect(() => {
    if (cageNumber !== null && cageNumber.length < 3 && cageNumber !== '') {
      setCageError(t('Searched_Cage_Number_should_be_3_character_long_label'))
    } else {
      setCageError('')
    }
  }, [cageNumber])

  useEffect(() => {
    if (props.resultCage) {
      if (props.resultCage.result !== null) {
        setA([props.resultCage.result])
      } else {
        setA(props.resultCage.result)
      }
      setCount(count + 1)
      if (count === 2) setCount(0)
    }
  }, [props.resultCage, count === 1])

  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }
  const onBtExport = () => {
    var excelParams = {
      fileName: 'Cages.xlsx',
      columnKeys: [
        'cageNumber',
        'entityStatus.entityDisplayStatus',
        'maxNumCartons',
        'cageRemarks',
        'cageDesc',
      ],
      allColumns: false,
    }
    gridApi.exportDataAsExcel(excelParams)
  }
  return (
    <div className='container bg-white'>
      <div>
        <h1 className='mb-4 mt-5'>{t('Maintain_Cage_label')}</h1>
      </div>
      <div>
        <h2>{t('TEXT_SEARCH_BY_label')}</h2>
      </div>
      <div className='mt-3'>
        <Row>
          <Col xs='5'>
            <label className='form-label'>{t('Cage_Number_label')}</label>
            <br />

            <input
              type='text'
              placeholder={t('Cage_Number_label')}
              className='form-control'
              maxLength='3'
              autoComplete='off'
              min={100}
              name='cageNumber'
              value={cageNumber}
              onChange={onSearch}
            ></input>
            {cageError !== '' ? (
              <span className='form-label' style={{ color: '#B13C27' }}>
                {cageError}
              </span>
            ) : null}
          </Col>
        </Row>
      </div>

      <div>
        <Row>
          <Col>
            {' '}
            <div className='mt-4'>
              <h2>{t('Results_label')}</h2>
            </div>
          </Col>

          <Col className='text-right mr-4'>
            <br />{' '}
            <button
              onClick={() => onBtExport()}
              className=' btn btn-outline-secondary mb-3'
              // disabled={!(a.length > 0)}
            >
              {t('Export_To_Excel_label')}
            </button>
          </Col>
        </Row>
      </div>
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
            rowData={a}
            rowHeight={40}
            headerHeight={40}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            tooltipShowDelay={0}
            context={props.context}
            modules={AllModules}
            onGridReady={onGridReady}
            onRowEditingStopped={onRowEditingStopped}
            onRowEditingStarted={onRowEditingStarted}
            onCellClicked={onCellClicked}
            frameworkComponents={{
              numberEditor: NumberEditor,
              textEditor: TextEditor,
              customTooltip: ToolTip,
            }}
            editType='fullRow'
            suppressClickEdit={true}
            undoRedoCellEditing={true}
          />
        </div>
      )}
    </div>
  )
}

function mapState(state) {
  return {
    getCageData: state.getAllCage.getData,
    resultCage: state.getCage.getData,
    postCage: state.updateCage.getData,
    delete: state.deleteCage.getData,
  }
}

const actionCreators = {
  deleteCage: cageActions.deleteCage,
  takeCage: cageActions.getAllCage,
  updateCage: cageActions.updateCage,
  searchCage: cageActions.getCage,
  valid: alertActions.error,
}

export default connect(mapState, actionCreators)(maintainCage)
