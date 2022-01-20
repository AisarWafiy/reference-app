import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { AgGridReact } from '@ag-grid-community/react'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { useTranslation } from 'react-i18next'
import { alertActions } from 'actions/alert.actions'
import { useFormik } from 'formik'
import { maintainReferenceDataActions } from '../../actions/maintainReferenceData.actions'
import { Dropdown } from 'components/UI/Input'
import NewData from 'components/MaintainReferenceData/CreateNewData'
import { EXCEPT_NUMBER, EXCEPT_ALPHANUMERIC } from 'constants/regex'
import Loader from 'react-loader-spinner'

const TimeEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)

  const refInput = useRef(null)
  const maxlength = 3
  const a = value.split(':')
  const [fromHours, setFromHours] = useState(a[0])
  const [fromMin, setFromMin] = useState(a[1])

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        if (fromHours === '' || fromMin === '') {
          return ''
        } else return fromHours + ':' + fromMin
      },

      isCancelBeforeStart() {
        return false
      },
    }
  })

  useEffect(() => {
    if (fromHours !== '' && fromHours > 23) {
      setFromHours('')
    }
    if (fromMin !== '' && fromMin > 59) {
      setFromMin('')
    }
  }, [fromMin, fromHours])
  return (
    <div className='row'>
      <div className='col' style={{ paddingRight: '0', paddingLeft: '3' }}>
        <input
          ref={refInput}
          type='text'
          max={23}
          min={0}
          placeholder='HH'
          onChange={event =>
            setFromHours(event.target.value.replace(EXCEPT_NUMBER, '').substring(0, 2))
          }
          name='fromHours'
          value={fromHours}
          className='form-control'
          style={{ border: 'none' }}
        />
      </div>
      :
      <div className=' col' style={{ paddingRight: '2', paddingLeft: '0' }}>
        <input
          ref={refInput}
          type='text'
          onChange={event =>
            setFromMin(event.target.value.replace(EXCEPT_NUMBER, '').substring(0, 2))
          }
          name='fromMin'
          placeholder='mm'
          value={fromMin}
          max={23}
          min={0}
          className='form-control'
          style={{ border: 'none' }}
        />
      </div>
    </div>
  )
})

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
        setValue(event.target.value.replace(EXCEPT_ALPHANUMERIC, '').substring(0, 15))
      }
      className='form-control'
    />
  )
})
const TextEditor1 = forwardRef((props, ref) => {
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
        setValue(event.target.value.replace(EXCEPT_ALPHANUMERIC, '').substring(0, 2))
      }
      className='form-control'
    />
  )
})
const TextEditor2 = forwardRef((props, ref) => {
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
        setValue(event.target.value.replace(EXCEPT_ALPHANUMERIC, '').substring(0, 3))
      }
      className='form-control'
    />
  )
})

const SelectEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
  const refInput = useRef(null)
  const [checked, setChecked] = useState(props.value === 'Y' ? true : false)

  useEffect(() => {
    setTimeout(() => refInput.current.focus())
  }, [])

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        return checked ? 'Y' : 'N'
      },

      isCancelBeforeStart() {
        return false
      },
    }
  })

  return (
    <input
      ref={refInput}
      className='ml-2'
      type='checkbox'
      defaultChecked={checked}
      onChange={() => setChecked(!checked)}
      name='Flag'
    ></input>
  )
})

const actionCellRenderer = params => {
  let divElement = document.createElement('div')

  let editingCells = params.api.getEditingCells()

  // checks if the rowIndex matches in at least one of the editing cells
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
`
  }

  return divElement
}

let initialValues = {}

function MaintainReferenceData(props) {
  const { getRefdata, takeRef, changeRef, takeMasterRef, getMasterRefdata } = props
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  let [editing, setEditing] = useState(false)
  let [create, setCreate] = useState(false)
  let [save, setSave] = useState(false)

  const [rowData, setRowData] = useState([])
  const [rowData1, setRowData1] = useState(null)

  const columnDefs = [
    {
      headerName: t('Code_label'),
      width: 100,
      field: 'refCode',
      lockPosition: true,
      sortable: true,
      filter: true,

      colId: 'refCode',

      editable: false,
    },
    {
      headerName: t('Value_label'),
      field: 'refValue',
      lockPosition: true,
      sortable: true,
      sort: 'asc',
      filter: true,
      cellEditor: 'textEditor',
      editable: true,
    },

    {
      headerName: t('Action_label'),
      width: 160,
      field: 'action',
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'action',
    },
  ]

  const columnDefs5 = [
    {
      headerName: t('Code_label'),
      width: 100,
      field: 'refCode',
      lockPosition: true,
      sortable: true,
      filter: true,

      colId: 'refCode',

      editable: false,
    },
    {
      headerName: t('Value_label'),
      field: 'refValue',
      lockPosition: true,
      sortable: true,
      sort: 'asc',
      filter: true,
      cellEditor: 'textEditor',
      editable: true,
    },

    {
      headerName: t('Action_label'),
      width: 160,
      field: 'action',
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'action',
    },
  ]

  const columnDefs1 = [
    {
      headerName: t('Code_label'),
      width: 100,
      field: 'refCode',
      sortable: true,
      lockPosition: true,
      filter: true,

      editable: false,
    },
    {
      headerName: t('Value_label'),
      cellEditor: 'textEditor',
      field: 'refValue',
      lockPosition: true,
      sortable: true,
      filter: true,
      sort: 'asc',
      editable: true,
    },

    {
      headerName: t('Store_label'),
      field: 'refFlag',
      width: 110,
      sortable: true,
      cellRenderer: params => {
        if (params.value === 'Y') {
          return `<input type="checkbox" checked style="pointer-events: none" />`
        } else {
          return `<input type="checkbox" style="pointer-events: none"/>`
        }
      },
      cellEditor: 'selectEditor',
      lockPosition: true,
      filter: true,

      editable: true,
    },

    {
      headerName: t('Action_label'),
      width: 160,
      field: 'action',
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'action',
    },
  ]

  const columnDefs2 = [
    {
      headerName: t('Code_label'),
      width: 100,
      field: 'refCode',
      sortable: true,
      lockPosition: true,
      filter: true,

      editable: false,
    },
    {
      headerName: t('Value_label'),
      field: 'refValue',
      cellEditor: 'textEditor',
      lockPosition: true,
      sortable: true,
      filter: true,
      sort: 'asc',
      editable: true,
    },

    {
      headerName: t('International_label'),
      field: 'refFlag',
      width: 150,
      sortable: true,
      cellRenderer: params => {
        if (params.value === 'Y') {
          return `<input type="checkbox" checked style="pointer-events: none" />`
        } else {
          return `<input type="checkbox" style="pointer-events: none"/>`
        }
      },
      cellEditor: 'selectEditor',
      lockPosition: true,
      filter: true,

      editable: true,
    },

    {
      headerName: t('Action_label'),
      width: 160,
      field: 'action',
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'action',
    },
  ]

  const columnDefs3 = [
    {
      headerName: t('Code_label'),
      width: 100,
      field: 'refCode',
      sortable: true,
      filter: true,

      editable: false,
      lockPosition: true,
    },
    {
      headerName: t('Value_label'),
      cellEditor: 'textEditor',
      field: 'refValue',
      sortable: true,
      filter: true,
      sort: 'asc',
      editable: true,

      lockPosition: true,
    },
    {
      headerName: t('From_label'),
      field: 'tmFrom',
      width: 130,
      sortable: true,

      cellEditor: 'timeEditor',
      lockPosition: true,
      filter: true,

      editable: true,
    },
    {
      headerName: t('To_label'),
      field: 'tmTo',
      width: 120,
      sortable: true,

      cellEditor: 'timeEditor',
      lockPosition: true,
      filter: true,

      editable: true,
    },

    {
      headerName: t('Action_label'),
      width: 160,
      field: 'action',
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'action',
    },
  ]
  const columnDefs4 = [
    {
      headerName: t('Code_label'),
      width: 100,
      field: 'refCode',
      sortable: true,
      filter: true,

      editable: false,
      lockPosition: true,
    },
    {
      headerName: t('Value_label'),
      cellEditor: 'textEditor1',
      field: 'refValue',
      sortable: true,
      filter: true,
      sort: 'asc',
      editable: true,

      lockPosition: true,
    },
    {
      headerName: t('NACCS_label'),
      width: 140,
      cellEditor: 'textEditor2',
      field: 'naccsCode',
      sortable: true,
      filter: true,

      editable: true,

      lockPosition: true,
    },

    {
      headerName: t('Action_label'),
      width: 160,
      field: 'action',
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'action',
    },
  ]

  const defaultColDef = {
    resizable: true,
    filter: true,
    // floatingFilter: true,
    // editable: true,
    cellStyle: rowStyle,
    borders: true,
    field: 'value',
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

      if (action === 'save') {
        params.api.stopEditing(false)
        if (formik.values.Reference === 'Airport') {
          let data = {}

          data.refId = params.node.data.refId

          data.refMaster = params.node.data.refMaster

          data.refCode = params.node.data.refCode

          data.refValue = params.node.data.refValue
          data.naccsCode = null
          data.tmTo = null
          data.tmFrom = null
          data.refFlag = null
          if (params.node.data.refValue === '') {
            props.valid('Value cannot be empty', 'Maintain Reference Data')
            setLoading(false)
          } else {
            changeRef(data)
          }
        } else if (formik.values.Reference === 'Location Type') {
          let data = {}

          data.refId = params.node.data.refId

          data.refMaster = params.node.data.refMaster

          data.refCode = params.node.data.refCode

          data.refValue = params.node.data.refValue
          data.naccsCode = null
          data.tmTo = null
          data.tmFrom = null
          data.refFlag = params.node.data.refFlag

          if (params.node.data.refValue === '') {
            props.valid('Value cannot be empty', 'Maintain Reference Data')
            setLoading(false)
          } else {
            changeRef(data)
          }
        } else if (formik.values.Reference === 'Nationality') {
          let data = {}

          data.refId = params.node.data.refId

          data.refMaster = params.node.data.refMaster

          data.refCode = params.node.data.refCode

          data.refValue = params.node.data.refValue
          data.naccsCode = null
          data.tmTo = null
          data.tmFrom = null
          data.refFlag = null

          if (params.node.data.refValue === '') {
            props.valid('Value cannot be empty', 'Maintain Reference Data')
            setLoading(false)
          } else {
            changeRef(data)
          }
        } else if (formik.values.Reference === 'Pick up Location') {
          let data = {}

          data.refId = params.node.data.refId

          data.refMaster = params.node.data.refMaster

          data.refCode = params.node.data.refCode

          data.refValue = params.node.data.refValue
          data.naccsCode = null
          data.tmTo = null
          data.tmFrom = null
          data.refFlag = params.node.data.refFlag

          if (params.node.data.refValue === '') {
            props.valid('Value cannot be empty', 'Maintain Reference Data')
            setLoading(false)
          } else {
            changeRef(data)
          }
        } else if (formik.values.Reference === 'Shift') {
          let data = {}

          data.refId = params.node.data.refId

          data.refMaster = params.node.data.refMaster

          data.refCode = params.node.data.refCode
          let t = params.node.data.tmTo

          data.refValue = params.node.data.refValue
          data.naccsCode = null
          data.tmTo = params.node.data.tmTo
          data.tmFrom = params.node.data.tmFrom
          data.refFlag = null

          if (
            params.node.data.refValue === '' ||
            params.node.data.tmTo === '' ||
            params.node.data.tmFrom === ''
          ) {
            props.valid('Value and Time cannot be empty', 'Maintain Reference Data')
            setLoading(false)
          } else {
            changeRef(data)
          }
        } else if (formik.values.Reference === 'Airline Code') {
          let data = {}

          data.refId = params.node.data.refId

          data.refMaster = params.node.data.refMaster

          data.refCode = params.node.data.refCode

          data.refValue = params.node.data.refValue
          data.naccsCode = params.node.data.naccsCode
          data.tmTo = null
          data.tmFrom = null
          data.refFlag = null

          if (params.node.data.refValue === '' || params.node.data.naccsCode === '') {
            props.valid('Value and NACCS cannot be empty', 'Maintain Reference Data')
            setLoading(false)
          } else {
            changeRef(data)
          }
        } else if (formik.values.Reference === 'Group') {
          let data = {}

          data.refId = params.node.data.refId

          data.refMaster = params.node.data.refMaster

          data.refCode = params.node.data.refCode

          data.refValue = params.node.data.refValue
          data.naccsCode = null
          data.tmTo = null
          data.tmFrom = null
          data.refFlag = null

          if (params.node.data.refValue === '') {
            props.valid('Value cannot be empty', 'Maintain Reference Data')
            setLoading(false)
          } else {
            changeRef(data)
          }
        } else if (formik.values.Reference === 'Purchase Type') {
          let data = {}

          data.refId = params.node.data.refId

          data.refMaster = params.node.data.refMaster

          data.refCode = params.node.data.refCode

          data.refValue = params.node.data.refValue
          data.naccsCode = null
          data.tmTo = null
          data.tmFrom = null
          data.refFlag = null

          if (params.node.data.refValue === '') {
            props.valid('Value cannot be empty', 'Maintain Reference Data')
            setLoading(false)
          } else {
            changeRef(data)
          }
        } else if (formik.values.Reference === 'Currencies') {
          let data = {}

          data.refId = params.node.data.refId

          data.refMaster = params.node.data.refMaster

          data.refCode = params.node.data.refCode

          data.refValue = params.node.data.refValue
          data.naccsCode = null
          data.tmTo = null
          data.tmFrom = null
          data.refFlag = null

          if (params.node.data.refValue === '') {
            props.valid('Value cannot be empty', 'Maintain Reference Data')
            setLoading(false)
          } else {
            changeRef(data)
          }
        } else if (formik.values.Reference === 'Promotion') {
          let data = {}

          data.refId = params.node.data.refId

          data.refMaster = params.node.data.refMaster

          data.refCode = params.node.data.refCode

          data.refValue = params.node.data.refValue
          data.naccsCode = null
          data.tmTo = null
          data.tmFrom = null
          data.refFlag = null

          if (params.node.data.refValue === '') {
            props.valid('Value cannot be empty', 'Maintain Reference Data')
            setLoading(false)
          } else {
            changeRef(data)
          }
        } else if (formik.values.Reference === 'DP Tracking') {
          let data = {}

          data.refId = params.node.data.refId

          data.refMaster = params.node.data.refMaster

          data.refCode = params.node.data.refCode

          data.refValue = params.node.data.refValue
          data.naccsCode = null
          data.tmTo = null
          data.tmFrom = null
          data.refFlag = null

          if (params.node.data.refValue === '') {
            props.valid('Value cannot be empty', 'Maintain Reference Data')
            setLoading(false)
          } else {
            changeRef(data)
          }
        }
      }

      if (action === 'cancel') {
        params.api.stopEditing(true)
      }
    }
  }

  const onRowEditingStarted = params => {
    setEditing(true)
    params.api.refreshCells({
      columns: ['action'],
      rowNodes: [params.node],
      force: true,
    })
  }
  const onRowEditingStopped = params => {
    setEditing(false)
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

  useState(() => {
    initialValues.Reference = ''
  })

  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  useEffect(() => {
    takeMasterRef()
  }, [props.takeMasterRef])

  useEffect(() => {
    if (formik.values.Reference) {
      if (formik.values.Reference !== null || formik.values.Reference !== '') {
        setLoading(true)
        takeRef(formik.values.Reference)
      }
    }
  }, [formik.values.Reference])

  useEffect(() => {
    if (rowData1 == null) {
      setRowData([])
    }
  }, [rowData1])

  useEffect(() => {
    if (props.postRefData) {
      setLoading(true)
      takeRef(formik.values.Reference)
    }
  }, [props.postRefData])

  useEffect(() => {
    if (getRefdata) {
      setRowData(getRefdata.result)
      setLoading(false)
    }
  }, [getRefdata])

  const createData = () => {
    setCreate(true)
  }

  const handleChange = selectedOption => {
    setRowData1(selectedOption)
    if (selectedOption !== null) {
      formik.setFieldValue('Reference', selectedOption.refMaster)
    }
  }
  const onBtExport = () => {
    var excelParams = {
      fileName: 'Reference Data.xlsx',
      columnKeys: ['refCode', 'refValue', 'tmFrom', 'tmTo', 'refFlag', 'naccsCode'],
      allColumns: false,
    }
    gridApi.exportDataAsExcel(excelParams)
  }

  return (
    <div className='container bg-white'>
      <h1 className='mt-4 mb-4' style={{ fontWeight: '500' }}>
        {t('Maintain_Reference_Data_label')}
      </h1>
      <div className=''>
        <Row>
          <Col>
            <div
              className='mt-3 mb-1'
              style={{ fontSize: '12px', fontWeight: '500', lineHeight: '18px' }}
            >
              {t('Reference_type_label')}
            </div>
            <div>
              <Row>
                <Col xs='3 mb-4'>
                  <Dropdown
                    closeMenuOnSelect={true}
                    className='form-control mb-4 '
                    value={rowData1}
                    placeholder={t('TEXT_SELECT_label')}
                    isClearable
                    onChange={handleChange}
                    options={getMasterRefdata && getMasterRefdata.result.map(val => val)}
                    optionLabel='refMaster'
                    optionValue='refMaster'
                    isDisabled={create || editing}
                  />
                </Col>

                <Col xs='2'>
                  <button
                    type='button'
                    onClick={createData}
                    disabled={create || rowData1 === null || editing}
                    className='btn btn-primary'
                  >
                    {t('Create_label')}
                  </button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </div>

      {create ? (
        <div style={{ fontSize: '16px', fontWeight: '520', lineHeight: '20.5px' }} className='mb-4'>
          {t('Create_label')}
        </div>
      ) : null}

      {loading === false && create && (
        <NewData Reference={rowData1.refMaster} refId={rowData1.refId} />
      )}
      {!create && formik.values.Reference ? (
        <div>
          <Row>
            <Col xs='5' className='mt-3'>
              {' '}
              <h2>{t('Reference_Data_label')}</h2>
            </Col>
            <Col xs='4'>
              <button
                onClick={() => onBtExport()}
                className=' btn btn-outline-secondary mb-4'
                disabled={!(rowData.length > 0)}
              >
                {t('Export_To_Excel_label')}
              </button>
            </Col>
          </Row>
        </div>
      ) : null}
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div>
          {formik.values.Reference === 'Airport' && !create ? (
            <div
              id='myGrid'
              className='ag-theme-alpine'
              style={{
                width: '46%',
                height: 400,
              }}
            >
              <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                animateRows={true}
                rowHeight={30}
                modules={AllModules}
                headerHeight={40}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                context={props.context}
                onGridReady={onGridReady}
                onRowEditingStopped={onRowEditingStopped}
                onRowEditingStarted={onRowEditingStarted}
                onCellClicked={onCellClicked}
                editType='fullRow'
                frameworkComponents={{
                  selectEditor: SelectEditor,
                  timeEditor: TimeEditor,
                  textEditor: TextEditor,
                  textEditor1: TextEditor1,
                  textEditor2: TextEditor2,
                }}
                suppressClickEdit={true}
                undoRedoCellEditing={true}
              />
            </div>
          ) : formik.values.Reference === 'Location Type' && !create ? (
            <div
              id='myGrid'
              className='ag-theme-alpine'
              style={{
                width: '57%',
                height: 400,
              }}
            >
              <AgGridReact
                columnDefs={columnDefs1}
                rowData={rowData}
                animateRows={true}
                rowHeight={30}
                modules={AllModules}
                frameworkComponents={{
                  selectEditor: SelectEditor,
                  timeEditor: TimeEditor,

                  textEditor: TextEditor,
                  textEditor1: TextEditor1,
                  textEditor2: TextEditor2,
                }}
                headerHeight={40}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                context={props.context}
                onGridReady={onGridReady}
                onRowEditingStopped={onRowEditingStopped}
                onRowEditingStarted={onRowEditingStarted}
                onCellClicked={onCellClicked}
                editType='fullRow'
                suppressClickEdit={true}
                undoRedoCellEditing={true}
              />
            </div>
          ) : (formik.values.Reference === 'Nationality' ||
              formik.values.Reference === 'Group' ||
              formik.values.Reference === 'Purchase Type' ||
              formik.values.Reference === 'Currencies' ||
              formik.values.Reference === 'Promotion' ||
              formik.values.Reference === 'DP Tracking') &&
            !create ? (
            <div
              id='myGrid'
              className='ag-theme-alpine'
              style={{
                width: '46%',
                height: 400,
              }}
            >
              <AgGridReact
                columnDefs={columnDefs5}
                rowData={rowData}
                animateRows={true}
                rowHeight={30}
                modules={AllModules}
                headerHeight={40}
                frameworkComponents={{
                  selectEditor: SelectEditor,
                  timeEditor: TimeEditor,
                  textEditor: TextEditor,
                  textEditor1: TextEditor1,
                  textEditor2: TextEditor2,
                }}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                context={props.context}
                onGridReady={onGridReady}
                onRowEditingStopped={onRowEditingStopped}
                onRowEditingStarted={onRowEditingStarted}
                onCellClicked={onCellClicked}
                editType='fullRow'
                suppressClickEdit={true}
                undoRedoCellEditing={true}
              />
            </div>
          ) : formik.values.Reference === 'Pick up Location' && !create ? (
            <div
              id='myGrid'
              className='ag-theme-alpine'
              style={{
                width: '62%',
                height: 400,
              }}
            >
              <AgGridReact
                columnDefs={columnDefs2}
                rowData={rowData}
                animateRows={true}
                frameworkComponents={{
                  selectEditor: SelectEditor,
                  timeEditor: TimeEditor,
                  textEditor: TextEditor,
                  textEditor1: TextEditor1,
                  textEditor2: TextEditor2,
                }}
                rowHeight={30}
                headerHeight={40}
                defaultColDef={defaultColDef}
                modules={AllModules}
                pagination={true}
                paginationPageSize={10}
                context={props.context}
                onGridReady={onGridReady}
                onRowEditingStopped={onRowEditingStopped}
                onRowEditingStarted={onRowEditingStarted}
                onCellClicked={onCellClicked}
                editType='fullRow'
                suppressClickEdit={true}
                undoRedoCellEditing={true}
              />
            </div>
          ) : formik.values.Reference === 'Shift' && !create ? (
            <div
              id='myGrid'
              className='ag-theme-alpine'
              style={{
                width: '80%',

                height: 400,
              }}
            >
              <AgGridReact
                columnDefs={columnDefs3}
                rowData={rowData}
                animateRows={true}
                frameworkComponents={{
                  selectEditor: SelectEditor,
                  timeEditor: TimeEditor,
                  textEditor: TextEditor,
                  textEditor1: TextEditor1,
                  textEditor2: TextEditor2,
                }}
                rowHeight={30}
                headerHeight={40}
                modules={AllModules}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                context={props.context}
                onGridReady={onGridReady}
                onRowEditingStopped={onRowEditingStopped}
                onRowEditingStarted={onRowEditingStarted}
                onCellClicked={onCellClicked}
                editType='fullRow'
                suppressClickEdit={true}
                undoRedoCellEditing={true}
              />
            </div>
          ) : formik.values.Reference === 'Airline Code' && !create ? (
            <div
              id='myGrid'
              className='ag-theme-alpine'
              style={{
                width: '62%',
                height: 400,
              }}
            >
              <AgGridReact
                columnDefs={columnDefs4}
                rowData={rowData}
                animateRows={true}
                modules={AllModules}
                rowHeight={30}
                headerHeight={40}
                frameworkComponents={{
                  selectEditor: SelectEditor,
                  timeEditor: TimeEditor,
                  textEditor: TextEditor,
                  textEditor1: TextEditor1,
                  textEditor2: TextEditor2,
                }}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                context={props.context}
                onGridReady={onGridReady}
                onRowEditingStopped={onRowEditingStopped}
                onRowEditingStarted={onRowEditingStarted}
                onCellClicked={onCellClicked}
                editType='fullRow'
                suppressClickEdit={true}
                undoRedoCellEditing={true}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}
function mapState(state) {
  return {
    getRefdata: state.getRef.getData,
    getMasterRefdata: state.getMasterRef.getData,
    postRefData: state.postRef.getData,
  }
}

const actionCreators = {
  changeRef: maintainReferenceDataActions.postRef,
  takeRef: maintainReferenceDataActions.getRef,
  takeMasterRef: maintainReferenceDataActions.getMasterRef,
  valid: alertActions.error,
}

export default connect(mapState, actionCreators)(MaintainReferenceData)
