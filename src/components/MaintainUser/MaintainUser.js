import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { AgGridColumn, AgGridReact } from '@ag-grid-community/react'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import { EXCEPT_ALPHA } from 'constants/regex'
import 'ag-grid-community/dist/styles/ag-grid.css'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { alertActions } from 'actions/alert.actions'
import { useFormik } from 'formik'
import { Row, Col } from 'react-bootstrap'
import { maintainUserDataActions } from 'actions/maintainUser.actions'
import Loader from 'react-loader-spinner'

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
      onChange={event => setValue(event.target.value.replace(EXCEPT_ALPHA, ''))}
      className='form-control'
    />
  )
})

const SelectEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
  const refInput = useRef(null)
  useEffect(() => {
    if (props.getRoleData) {
      let c = props.getRoleData.result
      b = c.map(val => {
        return val.role.roleName
      })
    }
  }, [props.getRoleData])

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
    <select
      ref={refInput}
      value={value}
      style={{ width: '100%', border: 'none' }}
      className='form-control'
      onChange={event => setValue(event.target.value)}
    >
      {b.map((val, key) => {
        return (
          <option key={key} value={val}>
            {val}
          </option>
        )
      })}
    </select>
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
let b

function MaintainUser(props) {
  const { getUserdata, takeUser, changeUser } = props
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)

  const [gridApi, setGridApi] = useState(null)
  // const [gridColumnApi, setGridColumnApi] = useState(null)
  const [a, setA] = useState([])

  const columnDefs = [
    {
      headerName: t('User_ID_label'),
      field: 'userId',
      sortable: true,
      filter: true,

      lockPosition: true,
      width: 270,
    },
    {
      headerName: t('Employee_ID_label'),
      field: 'employeeId',
      cellStyle: { textAlign: 'right' },
      sortable: true,
      filter: true,
      lockPosition: true,
      sort: 'asc',
      width: 150,
    },
    {
      headerName: t('First_Name_label'),
      field: 'firstName',
      sortable: true,
      filter: true,
      cellEditor: 'textEditor',
      width: 160,
      editable: true,

      lockPosition: true,
    },
    {
      headerName: t('Last_Name_label'),
      field: 'lastName',
      sortable: true,
      filter: true,
      cellEditor: 'textEditor',
      width: 160,
      editable: true,
      lockPosition: true,
    },
    {
      headerName: t('Role_label'),
      field: 'roleName',
      sortable: true,
      filter: true,
      cellEditor: 'selectEditor',
      width: 160,

      editable: true,
    },
    {
      headerName: t('Action_label'),
      field: 'action',
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'action',

      width: 150,
    },
  ]

  const defaultColDef = {
    width: 100,
    resizable: true,
    filter: true,
    wrapText: true,
    cellStyle: rowStyle,
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

        setLoading(true)
        let data = {}

        data.userId = params.node.data.userId

        data.firstName = params.node.data.roleId
        let f = params.node.data.roleName
        let c = props.getRoleData.result
        let d = c.map(val => {
          return val.role.roleName === f ? val.role.roleId : null
        })
        let e = d.filter(d => d !== null)
        data.firstName = params.node.data.firstName
        data.roleId = e[0]
        data.roleName = params.node.data.roleName
        data.employeeId = params.node.data.employeeId
        data.lastName = params.node.data.lastName
        data.lastLoggedIn = params.node.data.lastLoggedIn
        data.active = params.node.data.active
        if (
          params.node.data.lastName &&
          params.node.data.firstName &&
          params.node.data.lastName !== '' &&
          params.node.data.firstName !== ''
        ) {
          if (
            /^[a-zA-Z ]+$/.test(params.node.data.lastName) &&
            /^[a-zA-Z ]+$/.test(params.node.data.firstName)
          ) {
            changeUser(data)
          } else {
            props.valid('First Name and Last Name can only have alphabets', 'Maintain User')
            takeUser()
          }
        } else {
          props.valid('First Name and Last Name cannot be empty', 'Maintain User')
          takeUser()
        }
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

  useState(() => {
    initialValues.Reference = ''
  })

  function onGridReady(params) {
    setGridApi(params.api)
    // setGridColumnApi(params.columnApi)
  }
  useEffect(() => {
    takeUser()

    // a = getUserdata.result
  }, [props.takeUser])

  useEffect(() => {
    if (props.postUserData) takeUser()

    // a = getUserdata.result
  }, [props.postUserData])

  useEffect(() => {
    props.takeRole()
  }, [props.takeRole])
  useEffect(() => {
    if (getUserdata && getUserdata.result) {
      setA(getUserdata.result)
      setLoading(false)
    } else if (getUserdata && !getUserdata.result) {
      setLoading(false)
      setA([])
    } else {
      setLoading(false)
    }
  }, [getUserdata])

  useEffect(() => {
    if (props.getRoleData) {
      let c = props.getRoleData.result
      b = c.map(val => {
        return val.role.roleName
      })
    }
  }, [props.getRoleData])
  const onBtExport = () => {
    var excelParams = {
      fileName: 'Users.xlsx',
      columnKeys: ['userId', 'employeeId', 'firstName', 'lastName', 'roleName'],
      allColumns: false,
    }
    gridApi.exportDataAsExcel(excelParams)
  }

  return (
    <div className='container bg-white'>
      <div>
        <Row>
          <Col>
            {' '}
            <h1 className='mt-4 mb-4' style={{ fontWeight: '500' }}>
              {t('Maintain_User_label')}
            </h1>
          </Col>

          <Col className='text-right mr-4'>
            <br />{' '}
            <button
              onClick={() => onBtExport()}
              className=' btn btn-outline-secondary '
              disabled={!(a !== null && a.length > 0)}
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
            defaultColDef={defaultColDef}
            rowData={a}
            animateRows={true}
            rowHeight={30}
            headerHeight={40}
            modules={AllModules}
            frameworkComponents={{
              selectEditor: SelectEditor,

              textEditor: TextEditor,
            }}
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
      )}
    </div>
  )
}
function mapState(state) {
  return {
    getUserdata: state.getUser.getData,
    postUserData: state.postUser.getData,
    getRoleData: state.getRole.getData,
  }
}

const actionCreators = {
  changeUser: maintainUserDataActions.postUser,
  takeUser: maintainUserDataActions.getUser,
  takeRole: maintainUserDataActions.getRole,
  valid: alertActions.error,
}

export default connect(mapState, actionCreators)(MaintainUser)
