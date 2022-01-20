import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { calcDate } from 'constants/dateTime'
import { Row, Col } from 'react-bootstrap'
import { AgGridReact } from '@ag-grid-community/react'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import '../../css/maintainreferencedata.css'
import { carrierActions } from 'actions/carrier.actions'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { useFormik } from 'formik'
import { DateTimeEditor } from 'components/AgGridCustomComponents/Editors'
import DateRangePicker from 'react-bootstrap-daterangepicker'
import 'bootstrap-daterangepicker/daterangepicker.css'
import { MdDateRange } from 'react-icons/md'
import i18next from 'i18next'
import Loader from 'react-loader-spinner'
import { useTranslation } from 'react-i18next'
import { maintainReferenceDataActions } from '../../actions/maintainReferenceData.actions'
import { EXCEPT_NUMBER, EXCEPT_ALPHANUMERIC } from 'constants/regex'
import { alertActions } from 'actions/alert.actions'
import { linkActions } from 'actions/link.actions'
import Moment from 'moment'
import { Dropdown } from 'components/UI/Input'

const NumberEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
  const refInput = useRef(null)

  const a = value.split(':')
  const [fromHours, setFromHours] = useState(a[0])
  const [fromMin, setFromMin] = useState(a[1])

  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        return String(fromHours).padStart(2, '0') + ':' + String(fromMin).padStart(2, '0')
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
    <div className='row' style={{ fontSize: '11px', width: '100%' }}>
      <div
        className='col ml-4  pl-0 pr-0'
        style={{ width: '100%', border: 'none', fontSize: '11px' }}
      >
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
          style={{ width: '100%', border: 'none', fontSize: '11px' }}
          className='form-control'
        />
      </div>
      <div
        className='ml-0 mr-0 pl-0 pr-0 col'
        style={{ width: '100%', border: 'none', fontSize: '11px' }}
      >
        <div className='mr-0 ml-3 pr-0' style={{ width: '100%', border: 'none', fontSize: '11px' }}>
          :
        </div>
      </div>
      <div className=' col ml-0 mr-0 pl-0 pr-0' style={{ border: 'none', fontSize: '11px' }}>
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
          style={{ width: '100%', border: 'none', fontSize: '11px' }}
          className='form-control'
        />
      </div>
    </div>
  )
})
const TextEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value && props.value !== null ? props.value : '')
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
        setValue(event.target.value.replace(EXCEPT_ALPHANUMERIC, '').substring(0, 50))
      }
      className='form-control'
    />
  )
})

const SelectEditorSchedule = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
  const refInput = useRef(null)
  const [drop, setDrop] = useState([])

  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
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
      style={{ width: '100%', border: 'none', fontSize: '11px' }}
      className='form-control'
      onChange={event => setValue(event.target.value)}
    >
      <option value={'Scheduled'}>Scheduled</option>
      <option value={'UnScheduled'}>UnScheduled</option>
    </select>
  )
})
const SelectEditorStatus = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
  const refInput = useRef(null)
  const [drop, setDrop] = useState([])

  useEffect(() => {
    // focus on the input
    // setTimeout(() => refInput.current.focus())

    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/carrier/status')
      .then(response => {
        setDrop(response.data.result)
      })
      .catch(err => {})
  }, [])

  // useEffect(() => {
  //   // focus on the input
  //   setTimeout(() => refInput.current.focus())
  // }, [])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
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
      style={{ width: '100%', border: 'none', fontSize: '11px' }}
      className='form-control'
      onChange={event => setValue(event.target.value)}
    >
      {drop.map(val => {
        return (
          <option key={val.statusDesc} value={val.statusDesc}>
            {val.statusDesc}
          </option>
        )
      })}
    </select>
  )
})

const SelectEditorPickup = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
  const refInput = useRef(null)
  useEffect(() => {
    if (props.getRefdata) {
      let b = props.getRefdata && props.getRefdata.result
      d = b.filter(b => b.refMaster === 'Airport')
      e = b.filter(b => b.refMaster === 'Pick up Location')
      c = d.map(val => {
        return val.refValue
      })
      r = e.map(val => {
        return val.refValue
      })
    }
  }, [props.getRefdata])

  // useEffect(() => {
  //   // focus on the input
  //   setTimeout(() => refInput.current.focus())
  // }, [])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
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
      style={{ width: '100%', border: 'none', fontSize: '11px' }}
      className='form-control'
      onChange={event => setValue(event.target.value)}
    >
      {r.map((val, key) => {
        return (
          <option key={key} value={val}>
            {val}
          </option>
        )
      })}
    </select>
  )
})

const SelectEditor = forwardRef((props, ref) => {
  const [value, setValue] = useState(props.value)
  const refInput = useRef(null)
  useEffect(() => {
    if (props.getRefdata) {
      let b = props.getRefdata && props.getRefdata.result
      d = b.filter(b => b.refMaster === 'Airport')
      e = b.filter(b => b.refMaster === 'Pick up Location')
      c = d.map(val => {
        return val.refValue
      })
      r = e.map(val => {
        return val.refValue
      })
    }
  }, [props.getRefdata])

  // useEffect(() => {
  //   // focus on the input
  //   setTimeout(() => refInput.current.focus())
  // }, [])

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
      style={{ width: '100%', border: 'none', fontSize: '11px' }}
      className='form-control'
      onChange={event => setValue(event.target.value)}
    >
      {c.map((val, key) => {
        return (
          <option key={key} value={val}>
            {val}
          </option>
        )
      })}
    </select>
  )
})

let r
let c, d, e, o

let initialValues = {}
function MaintainCarrier(props) {
  const { getCarrierData, takeCarrier } = props
  const [loading, setLoading] = useState(true)
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)

  const [depDate, setDepDate] = useState(
    Moment(calcDate()).format('YYYY-MM-DD') + ' - ' + Moment(calcDate()).format('YYYY-MM-DD'),
  )
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [sStatus, setSStatus] = useState('')
  const [a, setA] = useState([])
  const [changeCutOffHour, setChangeCuttOffHour] = useState('')
  const [changeCutOffMin, setChangeCuttOffMin] = useState('')
  const [startdate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const [disableUpdate, setDisableUpdate] = useState(true)
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
  const excelStyles = [
    {
      id: 'carrierNumber',
      numberFormat: {
        format: '000',
      },
    },
  ]
  const columnDefs = [
    {
      editable: false,
      checkboxSelection: true,
      width: 2,
      lockPosition: true,
    },
    {
      headerName: t('Action_label'),
      field: 'action',
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'action',
      width: 150,
      // lockPosition: true,
    },
    {
      headerName: t('Departure_Time_label'),
      field: 'departureTm',
      cellEditor: 'dateEditor',
      cellRenderer: stringFormatter,
      sortable: true,
      sort: 'asc',
      // lockPosition: true,
      width: 140,
      editable: true,
    },
    {
      headerName: t('Code_label'),
      field: 'carrierRefValue',
      sortable: true,
      filter: true,
      // lockPosition: true,
      tooltipField: 'carrierRefValue',
      width: 80,
      cellStyle: { textAlign: 'right' },
      editable: false,
    },

    {
      headerName: t('Number_label'),
      field: 'carrierNumber',
      sortable: true,
      cellClass: 'carrierNumber',
      tooltipField: 'carrierNumber',
      filter: true,
      // lockPosition: true,

      width: 95,
      editable: false,
    },
    {
      headerName: t('Origin_label'),
      field: 'originAirportRefValue',
      sortable: true,
      filter: true,
      tooltipField: 'originAirportRefValue',
      cellEditor: 'selectEditor',
      // lockPosition: true,
      width: 140,
      editable: true,
    },
    {
      headerName: t('Destination_label'),
      field: 'destAirportRefValue',
      sortable: true,
      tooltipField: 'destAirportRefValue',
      filter: true,
      // lockPosition: true,
      width: 140,
      cellEditor: 'selectEditor',
      editable: true,
    },
    {
      headerName: t('Vessel_Description_label'),
      field: 'vesselName',
      sortable: true,
      tooltipField: 'vesselName',
      cellEditor: 'textEditor',
      filter: true,
      // lockPosition: true,
      width: 140,
      editable: true,
    },
    {
      headerName: t('Carrier_Status_label'),
      field: 'carrierStatus',
      // lockPosition: true,
      sortable: true,
      filter: true,
      width: 105,
      cellEditor: 'selectEditorStatus',
      tooltipField: 'carrierStatus',
      editable: true,
    },
    {
      headerName: t('Scheduled/Unscheduled_label'),
      field: 'scheduleFlag',
      // lockPosition: true,
      sortable: true,
      filter: true,
      width: 130,
      tooltipField: 'scheduleFlag',
      cellEditor: 'selectEditorSchedule',
      editable: true,
    },
    {
      headerName: t('Arrival/Departure_label'),
      field: 'carrierFlag',
      // lockPosition: true,
      sortable: true,
      filter: true,
      width: 110,
      tooltipField: 'carrierFlag',
      editable: false,
    },
    {
      headerName: t('Domestic/International_label'),
      field: 'travelType',
      sortable: true,
      filter: true,
      tooltipField: 'travelType',
      // lockPosition: true,
      width: 130,
      editable: false,
    },
    {
      headerName: t('Pickup_Location_label'),
      field: 'pickupLocationRefValue',
      sortable: true,
      tooltipField: 'pickupLocationRefValue',
      filter: true,
      cellEditor: 'selectEditorPickup',
      // lockPosition: true,
      width: 100,
      editable: true,
    },

    {
      headerName: t('Transport_Type_label'),
      wrapText: true,
      field: 'carrierType',
      // lockPosition: true,
      sortable: true,
      filter: true,
      tooltipField: 'carrierType',
      width: 110,
      editable: false,
    },
    {
      headerName: t('Selling_Cut-Off_Time_label'),
      field: 'sellingCutoffTm',
      sortable: true,
      tooltipField: 'sellingCutoffTm',
      filter: true,
      // lockPosition: true,
      width: 135,
      cellEditor: 'numberEditor',
      editable: true,
      cellRenderer: stringFormatter1,
    },
  ]

  function stringFormatter(params) {
    var date = params.value
    var firstChar = date.slice(0, 10) + ' ' + date.slice(11, 16)
    return firstChar
  }

  function stringFormatter1(params) {
    var date = params.value
    if (date !== null) {
      var firstChar = date.slice(0, 5)
      return firstChar
    }
  }

  useEffect(() => {
    props.takeRef()
  }, [props.takeRef])

  useEffect(() => {
    if (props.linkData && props.linkData.statusDesc) {
      setLoading(true)
      let status = { statusDesc: props.linkData.statusDesc }
      setSStatus(status)
      props.link(null)
      let data = {}
      data.departureFrom = depDate.slice(0, 10)
      data.departureTo = depDate.slice(13, 23)
      data.carrierStatus = status.statusDesc
      data.carrierCodeNum = search
      props.searchCarrier(data)
    }
  }, [props.linkData])

  useEffect(() => {
    if (props.getRefdata) {
      let b = props.getRefdata && props.getRefdata.result
      d = b.filter(b => b.refMaster === 'Airport')
      e = b.filter(b => b.refMaster === 'Pick up Location')
      c = d.map(val => {
        return val.refValue
      })
      r = e.map(val => {
        return val.refValue
      })
    }
  }, [props.getRefdata])
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
  }

  useEffect(() => {
    if (props.postData && props.postData.result) {
      let data = {}
      data.departureFrom = depDate.slice(0, 10)
      data.departureTo = depDate.slice(13, 23)
      if (sStatus && sStatus != null) data.carrierStatus = sStatus.statusDesc
      else data.carrierStatus = null
      data.carrierCodeNum = search
      if (props.linkData === null) props.searchCarrier(data)
      setLoading(false)
    }
    if (props.postData && !props.postData.result) {
      setLoading(false)
    }
  }, [props.postData])
  const updateRow = () => {
    let data = {}
    data.departureFrom = depDate.slice(0, 10)
    data.departureTo = depDate.slice(13, 23)
    if (sStatus && sStatus != null) data.carrierStatus = sStatus.statusDesc
    else data.carrierStatus = null
    data.carrierCodeNum = search
    if (props.linkData === null) props.searchCarrier(data)
    setLoading(false)
  }

  useEffect(() => {
    if (props.updateSellOffData && props.updateSellOffData.result) {
      let data = {}
      data.departureFrom = depDate.slice(0, 10)
      data.departureTo = depDate.slice(13, 23)
      if (sStatus && sStatus != null) data.carrierStatus = sStatus.statusDesc
      else data.carrierStatus = null

      data.carrierCodeNum = search
      props.searchCarrier(data)
      setLoading(false)
    }
    if (props.updateSellOffData && !props.updateSellOffData.result) {
      let data = {}
      data.departureFrom = depDate.slice(0, 10)
      data.departureTo = depDate.slice(13, 23)
      data.carrierStatus = sStatus
      data.carrierCodeNum = search
      props.searchCarrier(data)
      setLoading(false)
    }
  }, [props.updateSellOffData])
  useEffect(() => {
    props.takeCarrierStatus()
  }, [props.takeCarrierStatus])

  useEffect(() => {
    let data = {}
    data.departureFrom = depDate.slice(0, 10)
    data.departureTo = depDate.slice(13, 23)
    if (sStatus && sStatus != null) data.carrierStatus = sStatus.statusDesc
    else data.carrierStatus = null
    data.carrierCodeNum = search
    if (props.linkData === null) props.searchCarrier(data)
  }, [])

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
        data.id = params.node.data.id
        data.carrierType = params.node.data.carrierType
        data.carrierFlag = params.node.data.carrierFlag
        data.travelType = params.node.data.travelType

        data.carrierRefMaster = 'Airline Code'
        data.carrierRefCode = params.node.data.carrierRefCode
        data.carrierNumber = params.node.data.carrierNumber
        data.vesselName = params.node.data.vesselName
        data.scheduleFlag = params.node.data.scheduleFlag

        data.status = params.node.data.carrierStatus
        let f = d.filter(d => d.refValue === params.node.data.originAirportRefValue)
        let g = d.filter(d => d.refValue === params.node.data.destAirportRefValue)
        let h = e.filter(e => e.refValue === params.node.data.pickupLocationRefValue)

        data.originAirportRefMaster = 'Airport'
        data.originAirportRefCode = f[0].refCode

        data.destAirportRefMaster = 'Airport'
        data.destAirportRefCode = g[0].refCode
        data.pickupLocationRefMaster = 'Pick up Location'
        let t = params.node.data.departureTm
        let ft = t.slice(0, 10) + ' ' + t.slice(11, 16)
        data.pickupLocationRefCode = h[0].refCode
        let z = params.node.data.sellingCutoffTm
        let m
        if (z !== null) {
          m = z.slice(0, 5)
        } else {
          m = null
        }
        data.sellingCutoffTm = m
        data.scheduleTimes = [{ departureFromTm: ft, departureToTm: ft }]

        if (params.node.data.carrierType === 'Vessel') {
          if (params.node.data.vesselName && params.node.data.vesselName !== '') {
            props.postUpdate(data)
          } else {
            props.valid('Vessel Description cannot be empty', i18next.t('Maintain_Carrier_label'))
            updateRow()
          }
        } else {
          props.postUpdate(data)
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

  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }
  const handleEvent = (event, picker) => {
    setDepDate(picker.startDate.format('YYYY-MM-DD') + ' - ' + picker.endDate.format('YYYY-MM-DD'))
    setStartDate(picker.startDate.format('YYYY/MM/DD'))
    setEndDate(picker.endDate.format('YYYY/MM/DD'))
  }
  const handleCallback = (start, end, label) => {
    console.log('callback ', start, end, label)
  }

  const onSearch = object => {
    const { value } = object.target
    setSearch(value)
  }

  useEffect(() => {
    if (changeCutOffHour !== '' && changeCutOffHour > 23) {
      setChangeCuttOffHour('')
    }
    if (changeCutOffMin !== '' && changeCutOffMin > 59) {
      setChangeCuttOffMin('')
    }
  }, [changeCutOffHour, changeCutOffMin])

  const onStatus = object => {
    setSStatus(object)
  }

  useEffect(() => {
    if (props.getCarrierSearch && props.getCarrierSearch.result) {
      setA(props.getCarrierSearch.result)
      setLoading(false)
    } else if (props.getCarrierSearch && !props.getCarrierSearch.result) {
      setLoading(false)
    }
  }, [props.getCarrierSearch])
  const onBtExport = () => {
    var excelParams = {
      fileName: 'Carrier List.xlsx',
      columnKeys: [
        'departureTm',
        'carrierRefValue',
        'carrierNumber',
        'originAirportRefValue',
        'destAirportRefValue',
        'vesselName',
        'carrierStatus',
        'scheduleFlag',
        'carrierFlag',
        'travelType',
        'pickupLocationRefValue',
        'carrierType',
        'sellingCutoffTm',
      ],
      allColumns: false,
    }
    gridApi.exportDataAsExcel(excelParams)
  }
  useEffect(() => {
    if (changeCutOffHour !== '' && changeCutOffMin !== '') {
      setDisableUpdate(false)
    } else {
      setDisableUpdate(true)
    }
  }, [changeCutOffHour, changeCutOffMin])
  const update = () => {
    let selectedNodes = gridApi.getSelectedNodes()
    let selectedData = selectedNodes.map(node => node.data)
    let sle = selectedData.map(item => {
      if (item.sellingCutoffTm) {
        return {
          ...item,
          sellingCutoffTm:
            String(changeCutOffHour).padStart(2, '0') +
            ':' +
            String(changeCutOffMin).padStart(2, '0'),
        }
      }
      return item
    })

    let k = sle.map(item => {
      return {
        sellingCutoffTm: item.sellingCutoffTm,
        carrierFlag: item.carrierFlag,
        carrierRefMaster: item.carrierRefMaster,
        carrierRefCode: item.carrierRefCode,
        carrierNumber: item.carrierNumber,
      }
    })

    if (gridApi.getSelectedNodes().length === 0) {
      props.valid(t('Please_select_the_row_label'), t('Maintain_Carrier_label'))
    } else {
      props.updateSellOff(k)
      setLoading(true)
    }
  }
  const onGo = () => {
    setLoading(true)
    let data = {}
    data.departureFrom = depDate.slice(0, 10)
    data.departureTo = depDate.slice(13, 23)
    if (sStatus && sStatus !== null) data.carrierStatus = sStatus.statusDesc
    else data.carrierStatus = null
    data.carrierCodeNum = search.toUpperCase()
    props.searchCarrier(data)
  }

  return (
    <div className='ml-2 mt-4  '>
      <h1 className='mt-4 mb-4 main-heading'>{t('Carrier_List_label')}</h1>

      <Row
        style={{
          width: '100%',
          paddingRight: '30px',
        }}
      >
        <Col className='col-sm-4'>
          <DateRangePicker
            onEvent={handleEvent}
            onCallback={handleCallback}
            initialSettings={{
              'drops': 'down',
              'showDropdowns': true,
            }}
            style={{ width: '100%' }}
          >
            <div className='form-group'>
              <label
                htmlFor='date'
                style={{ fontSize: '11px', fontWeight: 600, lineHeight: '18px' }}
              >
                {t('Date_label')}
              </label>
              <span className='astrick'>*</span>
              <div className='input-group'>
                <input
                  type='text'
                  className='form-control'
                  id='date'
                  disabled
                  value={depDate}
                  placeholder='YYYY-MM-DD - YYYY-MM-DD'
                />
                <div className='input-group-append'>
                  <div className='input-group-text' style={{ background: 'white' }}>
                    <MdDateRange color={'black'} />
                  </div>
                </div>
              </div>
            </div>
          </DateRangePicker>{' '}
        </Col>

        <Col xs='2'>
          <div className='form-group '>
            <label htmlFor='date' style={{ fontSize: '11px', fontWeight: 600, lineHeight: '18px' }}>
              {t('Carrier_Status_label')}
            </label>
            <div className=''>
              <Dropdown
                closeMenuOnSelect={true}
                className='form-control mb-4 '
                value={sStatus}
                onChange={onStatus}
                isClearable
                options={props.getCarrierStatus && props.getCarrierStatus.result.map(val => val)}
                optionLabel='statusDesc'
                optionValue='statusDesc'
              />
            </div>
          </div>
        </Col>

        <Col className='mt-1 ' xs='4'>
          <input
            type='text'
            className='form-control  mt-4'
            id='Search'
            placeholder={t('Search_Code_or_Number_label')}
            value={search}
            name='search'
            onChange={onSearch}
          />
        </Col>
        <Col>
          {' '}
          <br />
          <button
            className='btn btn-primary mt-1'
            // disabled={!(formik.isValid && formik.dirty)}
            onClick={() => onGo()}
            // disabled={!(formik.isValid && formik.dirty) || formik.isSubmitting}
          >
            {t('BUTTON_SEARCH_label')}
          </button>
        </Col>
      </Row>
      <div>
        <Row>
          <label className='form-group ml-3 mt-2'>{t('Selling_Cut-Off_Time_label')} :</label>
          <Col className='' xs='1'>
            <input
              type='text'
              max={23}
              min={0}
              placeholder='HH'
              onChange={event =>
                setChangeCuttOffHour(event.target.value.replace(EXCEPT_NUMBER, '').substring(0, 2))
              }
              name='changeCutOffHour'
              value={changeCutOffHour}
              className='form-control'
            />
          </Col>
          <label className='mt-2'>:</label>
          <Col className='' xs='1'>
            <input
              type='text'
              max={23}
              min={0}
              placeholder='HH'
              onChange={event =>
                setChangeCuttOffMin(event.target.value.replace(EXCEPT_NUMBER, '').substring(0, 2))
              }
              name='changeCutOffMin'
              value={changeCutOffMin}
              className='form-control'
            />
          </Col>
          <Col>
            <button onClick={() => update()} className='btn btn-primary' disabled={disableUpdate}>
              {t('update_label')}
            </button>
          </Col>
          <Col className='text-right mr-1'>
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
          className='ag-theme-alpine mr-1'
          style={{
            width: '100%',
            height: 510,
          }}
        >
          <AgGridReact
            columnDefs={columnDefs}
            rowData={a}
            animateRows={true}
            rowHeight={40}
            headerHeight={40}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            context={props.context}
            rowSelection={'multiple'}
            onGridReady={onGridReady}
            onRowEditingStopped={onRowEditingStopped}
            frameworkComponents={{
              numberEditor: NumberEditor,
              dateEditor: DateTimeEditor,
              selectEditor: SelectEditor,
              selectEditorPickup: SelectEditorPickup,
              selectEditorStatus: SelectEditorStatus,
              selectEditorSchedule: SelectEditorSchedule,
              textEditor: TextEditor,
              customTooltip: ToolTip,
            }}
            excelStyles={excelStyles}
            modules={AllModules}
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
    getCarrierData: state.getAllCarrier.getData,
    getCarrierStatus: state.getCarrierStatus.getData,
    getCarrierSearch: state.postFilterCarrier.getData,
    getRefdata: state.getRefAll.getData,
    postData: state.maintainCarrier.getData,
    updateSellOffData: state.updateSellOff.getData,
    linkData: state.linksuccess,
  }
}

const actionCreators = {
  searchCarrier: carrierActions.postFilterCarrier,
  takeCarrier: carrierActions.getAllCarrier,
  takeCarrierStatus: carrierActions.getCarrierStatus,
  takeRef: maintainReferenceDataActions.getRefAll,
  postUpdate: carrierActions.maintainCarrier,
  valid: alertActions.error,
  updateSellOff: carrierActions.updateSellOff,
  link: linkActions.linksuccess,
}

export default connect(mapState, actionCreators)(MaintainCarrier)
