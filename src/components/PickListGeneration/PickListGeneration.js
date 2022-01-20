import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import { useReactToPrint } from 'react-to-print'
import 'react-datepicker/dist/react-datepicker.css'
import Loader from 'react-loader-spinner'
import { picklistActions } from 'actions/picklist.actions'
import { useFormik } from 'formik'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { Dropdown, DropdownSelectAll } from 'components/UI/Input'
import Moment from 'moment'
import { AgGridColumn, AgGridReact } from '@ag-grid-community/react'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { AllCommunityModules } from '@ag-grid-community/all-modules'

let initialValues = {}

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
      // the final value to send to the grid, on completion of editing
      getValue() {
        // this simple editor doubles any value entered into the input
        return value
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false
      },
      // isCancelAfterEnd() {
      //   // our editor will reject any value greater than 1000
      //   return value > 999
      // },
      // Gets called once when editing is finished (eg if enter is pressed).
      // If you return true, then the result of the edit will be ignored.
    }
  })

  return (
    <input
      type='number'
      ref={refInput}
      value={value}
      onChange={event => setValue(event.target.value)}
      style={{ width: '100%' }}
    />
  )
})

function PickListGeneration(props) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [rowData, setRowData] = useState([])

  const [pickupLocation, setpickupLocation] = useState(null)

  const [pickupLocationDrop, setpickupLocationDrop] = useState('')
  const [disableGo, setDisableGo] = useState(true)
  const [date, setDate] = useState(null)
  const [shift, setShift] = useState(null)

  const [shiftDrop, setShiftDrop] = useState('')
  const [disablePrint, setDisablePrint] = useState(true)
  const componentRef = useRef()

  useEffect(() => {
    props.takeRef()
  }, [props.takeRef])

  useEffect(() => {
    if (props.getRefdata) {
      let a = props.getRefdata.result.map(val => {
        return val
      })
      setpickupLocationDrop(a.filter(a => a.refMaster === 'Pick up Location'))
      setShiftDrop(a.filter(a => a.refMaster === 'Shift'))
    }
  }, [props.getRefdata])

  useEffect(() => {
    if (props.getPick && props.getPick.result) {
      setRowData(props.getPick.result)
      setLoading(false)
    } else if (props.getPick && !props.getPick.result) {
      setRowData([])
      setLoading(false)
    }
  }, [props.getPick])
  const columnDefs = [
    {
      headerName: t('Seq#_label'),
      valueGetter: 'node.rowIndex + 1',
      sortable: true,
      filter: true,
      cellStyle: { textAlign: 'right' },
      lockPosition: true,

      width: 100,
      editable: false,
    },
    {
      headerName: t('WH_Bin_Location_label'),
      field: 'warehouseBinLoc',
      sortable: true,
      filter: true,

      lockPosition: true,

      width: 200,
      editable: false,
    },
    {
      headerName: t('Cartons_label'),
      field: 'carton',
      sortable: true,

      filter: true,
      lockPosition: true,

      width: 160,

      editable: false,
    },
  ]
  const defaultColDef = {
    sortable: true,
    wrapText: true,
    resizable: true,
    cellStyle: rowStyle,
  }
  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
  })

  const onChangepickupLocation = selectedOption => {
    setpickupLocation(selectedOption)
  }

  const onChangeShift = selectedOption => {
    setShift(selectedOption)
  }
  const handleGo = () => {
    let data = {}
    data.pickupLocation = pickupLocation.refValue
    data.departureDate = Moment(date).format('YYYY-MM-DD')
    data.shift = shift.refValue
    props.getPicklist(data)
    setDisablePrint(false)
    setLoading(true)
  }
  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  })
  const print = () => {
    let data = {}
    data.pickupLocation = pickupLocation.refValue
    data.departureDate = Moment(date).format('YYYY-MM-DD')
    data.shift = shift.refValue
    props.printPicklist(data)
  }
  useEffect(() => {
    if (date !== null && pickupLocation !== null && shift !== null) {
      setDisableGo(false)
    } else {
      setDisableGo(true)
    }
  }, [date, pickupLocation, shift])

  useEffect(() => {
    if (date === null && pickupLocation === null && shift === null) {
      setRowData([])
    }
  }, [date, pickupLocation, shift])

  const onBtPrint = () => {
    const api = gridApi
    setPrinterFriendly(api)
    setTimeout(function () {
      handlePrint()
      print()
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
    eGridDiv.style.width = '520px'
    eGridDiv.style.height = '300px'
    api.setDomLayout(null)
  }
  const onFirstDataRendered = () => {
    gridApi.expandAll()
  }

  return (
    <div className='container bg-white' ref={componentRef}>
      <div>
        <h1 className='mb-4 mt-5'>{t('Picklist_Generation_label')}</h1>
      </div>

      <div className='mt-3'>
        <Row>
          <Col xs='3'>
            <label className='form-label'>{t('Pickup_Location_label')}</label>{' '}
            <span className='astrick'>*</span>
            <Dropdown
              closeMenuOnSelect={true}
              className='form-control mb-4 '
              isClearable
              placeholder={t('TEXT_SELECT_label')}
              value={pickupLocation}
              onChange={onChangepickupLocation}
              options={pickupLocationDrop}
              optionLabel='refValue'
              optionValue='refValue'
              onBlur={formik.handleBlur}
              onFirstDataRendered={onFirstDataRendered}
            />
          </Col>
          <Col xs='2'>
            <label className='form-label'>{t('Departure_Date_label')}</label>
            <span className='astrick'>*</span>
            <DatePicker
              dateFormat='yyyy-MM-dd'
              placeholderText='YYYY-MM-DD'
              className='form-control'
              selected={date}
              onChange={date => setDate(date)}
            />
          </Col>
          <Col xs='3'>
            <label className='form-label'>{t('Shift_label')}</label>
            <span className='astrick'>*</span>
            <Dropdown
              closeMenuOnSelect={true}
              className='form-control mb-4 '
              value={shift}
              placeholder={t('TEXT_SELECT_label')}
              isClearable
              onBlur={formik.handleBlur}
              onChange={onChangeShift}
              options={shiftDrop}
              optionLabel='refValue'
              optionValue='refValue'
            />
          </Col>
          <Col className='  text-right mr-5'>
            <br />
            <button
              type='submit'
              onClick={handleGo}
              className='btn btn-primary mr-3 mt-1'
              disabled={disableGo}
            >
              {t('View_Picklist_label')}
            </button>
            <button
              type='submit'
              onClick={onBtPrint}
              className='btn btn-outline-secondary mr-3 mt-1'
              disabled={disableGo || disablePrint}
            >
              {t('Print_Picklist_label')}
            </button>
          </Col>
        </Row>
        <Row></Row>
      </div>
      <div>
        <div>
          <h2 className='mt-4'>{t('View_Picklist_label')}</h2>
        </div>
        {loading === true ? (
          <div style={{ textAlign: 'center' }} className='mt-5'>
            <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
          </div>
        ) : (
          <div
            id='myGrid'
            className='ag-theme-alpine mt-3'
            style={{
              width: '520px',
              height: '300px',
            }}
          >
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              pagination={true}
              paginationPageSize={35}
              animateRows={true}
              rowHeight={30}
              headerHeight={40}
              defaultColDef={defaultColDef}
              context={props.context}
              modules={AllCommunityModules}
              onGridReady={onGridReady}
              frameworkComponents={{
                numberEditor: NumberEditor,
              }}
              editType='fullRow'
              suppressClickEdit={true}
              undoRedoCellEditing={true}
            />
          </div>
        )}
      </div>
    </div>
  )
}
function mapState(state) {
  return {
    getRefdata: state.getDrop.getData,
    getPick: state.getPicklist.getData,
  }
}

const actionCreators = {
  takeRef: picklistActions.getDrop,
  getPicklist: picklistActions.getPicklist,
  printPicklist: picklistActions.printPicklist,
}

export default connect(mapState, actionCreators)(PickListGeneration)
