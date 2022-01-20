import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Loader from 'react-loader-spinner'
import * as labels from 'constants/labels'
import DatePicker from 'react-datepicker'
// import { mergePaxActions } from 'actions/mergePax.actions'

import { rowStyle } from 'assets/styles/ag-rowStyle'
import { useTranslation } from 'react-i18next'
import 'react-datepicker/dist/react-datepicker.css'
import { ToolTip } from 'components/AgGridCustomComponents/Editors'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import { alertActions } from 'actions/alert.actions'
import { AgGridReact } from '@ag-grid-community/react'
import { Dropdown } from 'components/UI/Input'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import { setCarrierCode, setDepartureDate, setRowData } from 'actions/action-merge-pax'
import { EXCEPT_ALPHA_NO_SPACE, EXCEPT_NUMBER } from 'constants/regex'

const NumberEditor = forwardRef((props, ref, maxLength = 7) => {
  const [value, setValue] = useState(props.value && props.value !== null ? props.value : '')
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
        return value
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
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
        setValue(event.target.value.replace(EXCEPT_NUMBER, '').substring(0, maxLength))
      }
      style={{ width: '100%', border: 'none' }}
    />
  )
})
const TextEditorFormat = forwardRef((props, ref, maxLength = 25) => {
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

  const handleChange = event => {
    // const maxLength = 4
    setValue(event.target.value.replace(EXCEPT_ALPHA_NO_SPACE, '').substring(0, maxLength))
  }

  return (
    <input
      type='text'
      ref={refInput}
      value={value}
      onChange={handleChange}
      className='form-control'
      style={{ width: '100%', border: 'none' }}
    />
  )
})

const TextEditorFormat1 = forwardRef((props, ref, maxLength = 25) => {
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

  const handleChange = event => {
    // const maxLength = 4
    setValue(event.target.value.substring(0, maxLength))
  }

  return (
    <input
      type='text'
      ref={refInput}
      value={value}
      onChange={handleChange}
      className='form-control'
      style={{ width: '100%', border: 'none' }}
    />
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

const MaintainMergePax = props => {
  const {
    showAlertError,
    showAlertSuccess,
    showAlertWarn,
    setDepartureDate,
    setCarrierCode,
    departureDate,
    carrierCode,
    rowData,
    setRowData,
  } = props
  const [loading, setLoading] = useState(false)
  const [isMerge, setIsMerge] = useState(true)
  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [paxNumber, setPaxNumber] = useState('')
  const { t } = useTranslation()
  const [disableMerge, setDisableMerge] = useState(true)
  const [carrierCodeList, setCarrierCodeList] = useState([])

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/carrier/carriercode')
      .then(response => {
        const dropdownList = []

        response.data.result.forEach(function (element) {
          dropdownList.push({ key: element, value: element })
        })
        setCarrierCodeList(dropdownList)
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'fetching carrier codes')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'fetching carrier codes')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'fetching carrier codes')
        else showAlertError('Internal Server Error')
      })

    // const localMergePaxData = JSON.parse(localStorage.getItem('mergePaxData'))

    // if (localMergePaxData) {
    //   const dateSplit = localMergePaxData.departureDate.split('-')
    //   const date = new Date(
    //     dateSplit[0],
    //     parseInt(dateSplit[1], 10) - 1,
    //     parseInt(dateSplit[2], 10),
    //   )
    //   setDepartureDate(date)
    //   setCarrierCode({ key: localMergePaxData.carrierCode, value: localMergePaxData.carrierCode })
    //   console.log(localMergePaxData)
    //   handleFindDuplicate(false, localMergePaxData.departureDate, localMergePaxData.carrierCode)
    // }

    // localStorage.removeItem('mergePaxData')
  }, [])

  const selectionChanged = () => {
    let selectedNodes = gridApi.getSelectedNodes()

    if (selectedNodes.length >= 2) {
      setDisableMerge(false)
    } else {
      setDisableMerge(true)
    }
  }

  const columnDefs1 = [
    {
      headerName: t('Action_label'),
      field: 'action',
      cellRenderer: actionCellRenderer,
      editable: false,
      colId: 'action',
      lockPosition: true,
      width: 150,
    },
    {
      headerName: t('Pax_Number_label'),
      field: 'paxNo',
      sortable: true,
      filter: true,
      sort: 'asc',
      tooltipField: 'paxNo',
      width: 120,
      editable: false,
    },
    {
      headerName: t('First_Name_label'),
      field: 'paxFirstName',
      sortable: true,
      filter: true,
      tooltipField: 'paxFirstName',
      cellEditor: 'textEditorFormat',
      width: 150,
      editable: true,
    },
    {
      headerName: t('Last_Name_label'),
      field: 'paxLastName',
      sortable: true,
      filter: true,
      tooltipField: 'paxLastName',
      cellEditor: 'textEditorFormat',
      width: 150,
      editable: true,
    },
    {
      headerName: t('Address_Line_1_label'),
      field: 'paxAddress.addressLine1',
      sortable: true,
      filter: true,
      tooltipField: 'paxAddress.addressLine1',
      cellEditor: 'textEditorFormat1',
      width: 150,
      editable: true,
    },
    {
      headerName: t('Address_Line_2_label'),
      field: 'paxAddress.addressLine2',
      sortable: true,
      filter: true,
      tooltipField: 'paxAddress.addressLine2',
      cellEditor: 'textEditorFormat1',
      width: 150,
      editable: true,
    },
    {
      headerName: t('City_label'),
      field: 'paxAddress.addressCity',
      tooltipField: 'paxAddress.addressCity',
      cellEditor: 'textEditorFormat1',
      sortable: true,

      width: 140,
      editable: true,
    },

    {
      headerName: t('Postal_Code_label'),
      wrapText: true,
      field: 'paxAddress.postCode',
      tooltipField: 'paxAddress.postCode',
      sortable: true,
      filter: true,
      width: 120,
      cellEditor: 'numberEditor',
      editable: true,
    },
  ]

  const columnDefs = [
    {
      editable: false,
      checkboxSelection: true,
      width: 5,
      lockPosition: true,
    },

    {
      headerName: t('Pax_Number_label'),
      field: 'paxMaster.paxNo',
      sortable: true,
      filter: true,
      tooltipField: 'paxMaster.paxNo',
      width: 120,
      sort: 'asc',
      editable: false,
    },
    {
      headerName: t('First_Name_label'),
      field: 'paxMaster.paxFirstName',
      sortable: true,
      filter: true,
      tooltipField: 'paxMaster.paxFirstName',
      width: 150,
      editable: false,
    },
    {
      headerName: t('Last_Name_label'),
      field: 'paxMaster.paxLastName',
      sortable: true,
      filter: true,
      tooltipField: 'paxMaster.paxLastName',
      width: 150,
      editable: false,
    },
    {
      headerName: t('Address_Line_1_label'),
      field: 'paxMaster.paxAddress.addressLine1',
      sortable: true,
      filter: true,
      tooltipField: 'paxMaster.paxAddress.addressLine1',
      width: 150,
      editable: false,
    },
    {
      headerName: t('Address_Line_2_label'),
      field: 'paxMaster.paxAddress.addressLine2',
      sortable: true,
      filter: true,
      tooltipField: 'paxMaster.paxAddress.addressLine2',
      width: 150,
      editable: false,
    },
    {
      headerName: t('City_label'),
      field: 'paxMaster.paxAddress.addressCity',
      tooltipField: 'paxMaster.paxAddress.addressCity',
      sortable: true,

      width: 140,
      editable: false,
    },

    {
      headerName: t('Postal_Code_label'),
      wrapText: true,
      field: 'paxMaster.paxAddress.postCode',
      tooltipField: 'paxMaster.paxAddress.postCode',
      sortable: true,
      filter: true,
      width: 120,
      cellEditor: 'numberEditor',
      editable: false,
    },
  ]
  const defaultColDef = {
    sortable: true,
    wrapText: true,
    cellStyle: rowStyle,
    resizable: true,
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

  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
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
        let postData = {}
        postData.paxSeqId = params.data.paxSeqId
        setLoading(true)
        postData.paxAddress = {
          addressLine1: params.data.paxAddress.addressLine1,
          addressLine2: params.data.paxAddress.addressLine2,
          addressCity: params.data.paxAddress.addressCity,
          country: params.data.paxAddress.country,
          postCode: params.data.paxAddress.postCode,
        }
        postData.paxNo = params.data.paxNo
        postData.paxFirstName = params.data.paxFirstName
        postData.paxLastName = params.data.paxLastName
        if (!postData.paxFirstName || !postData.paxLastName) {
          if (!postData.paxFirstName) {
            if (!postData.paxFirstName && !postData.paxLastName) {
              showAlertError(t('First name , Last name should not be empty'), 'Maintain pax')
              handleGo1()
            } else {
              showAlertError(t('First Name cannot be empty'), 'Maintain pax')
              handleGo1()
            }
          }
          if (!postData.paxLastName) {
            if (!postData.paxFirstName && !postData.paxLastName) {
              showAlertError(t('First name , Last name should not be empty'), 'Maintain pax')
              handleGo1()
            } else {
              showAlertError(t('Last  Name cannot be empty'), 'Maintain pax')
              handleGo1()
            }
          }
        } else {
          if (postData.paxAddress.postCode && postData.paxAddress.postCode.length < 7) {
            showAlertError(t('Postal Code Must be seven digit number'), 'Maintain pax')
            handleGo1()
          } else {
            axios
              .post(process.env.REACT_APP_SERVER_URI + '/api/pax/updatePax', postData)
              .then(response => {
                showAlertSuccess(response.data.message, 'Maintain And Merge Pax')
                handleGo1()
              })
              .catch(err => {
                if (err.response.data.error && !err.response.data.record)
                  showAlertError(err.response.data.error, 'Maintain And Merge Pax')
                else if (err.response.data.error && err.response.data.record)
                  showAlertError(err.response.data.record, 'Maintain And Merge Pax')
                else if (err.response.data.warning)
                  showAlertWarn(err.response.data.warning, 'Maintain And Merge Pax')
                else showAlertError('Internal Server Error')
                handleGo1()
              })
          }
        }
      }

      if (action === 'cancel') {
        params.api.stopEditing(true)
      }
    }
  }

  const getSelectedRowData = () => {
    let selectedNodes = gridApi.getSelectedNodes()
    let selectedData = selectedNodes.map(node => node.data.paxMaster)

    let a = selectedData.map(node => node.paxNo)
    let b = new Set(a)
    if (selectedData.length === b.size) {
      axios
        .post(process.env.REACT_APP_SERVER_URI + '/api/pax/mergePax', selectedData)
        .then(response => {
          showAlertSuccess(response.data.message, 'Maintain And Merge Pax')
          // refresh the rowData
          handleFindDuplicate(false)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'Maintain And Merge Pax')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'Maintain And Merge Pax')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'Maintain And Merge Pax')
          else showAlertError('Internal Server Error')
        })
    } else {
      showAlertError('Same Pax Number cannot be merged', labels.mergePax)
    }
  }

  const handleClear = () => {
    setRowData([])
    setCarrierCode(null)
    setDepartureDate(null)
    setPaxNumber('')
  }

  const handleFindDuplicate = (showMessage = true, formattedDate, formattedCarrierCode) => {
    let formatDate
    let carrCode
    setLoading(true)
    if (!formattedDate) {
      const year = departureDate.getFullYear()
      const month = departureDate.getMonth() + 1
      const date = departureDate.getDate()

      formatDate =
        year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
    } else {
      formatDate = formattedDate
      console.log(formatDate)
    }

    if (!formattedCarrierCode) {
      carrCode = carrierCode.value.replace(/\s/g, '+')
    } else {
      carrCode = formattedCarrierCode.replace(/\s/g, '+')
    }

    axios
      .get(
        process.env.REACT_APP_SERVER_URI +
          '/api/pax/getDuplicate?carrierCode=' +
          carrCode +
          '&departureDate=' +
          formatDate,
      )
      .then(response => {
        showMessage && showAlertSuccess(response.data.message, 'Maintain And Merge Pax')

        setRowData(response.data.result)
        setLoading(false)
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'Maintain And Merge Pax')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'Maintain And Merge Pax')
        else if (err.response.data.warning) {
          showMessage && showAlertWarn(err.response.data.warning, 'Maintain And Merge Pax')
        } else {
          showMessage && showAlertError('Internal Server Error')
        }
        setRowData(null)
        setLoading(false)
      })
    setIsMerge(true)
    setPaxNumber('')
  }

  const handleGo = (showMessage = true, formattedDate, formattedCarrierCode) => {
    let formatDate
    let carrCode
    setLoading(true)
    if (departureDate !== null) {
      if (!formattedDate) {
        const year = departureDate.getFullYear()
        const month = departureDate.getMonth() + 1
        const date = departureDate.getDate()

        formatDate =
          year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
      } else {
        formatDate = formattedDate
        console.log(formatDate)
      }
    } else {
      formatDate = null
    }
    if (carrierCode !== null) {
      if (!formattedCarrierCode) {
        carrCode = carrierCode.value.replace(/\s/g, '+')
      } else {
        carrCode = formattedCarrierCode.replace(/\s/g, '+')
      }
    } else {
      carrCode = null
    }
    axios
      .get(
        process.env.REACT_APP_SERVER_URI +
          '/api/pax/getPax?' +
          (paxNumber !== '' && carrCode !== null && formatDate !== null
            ? 'paxNumber=' + paxNumber + '&carrierCode=' + carrCode + '&departureDate=' + formatDate
            : paxNumber !== '' && carrCode === null && formatDate === null
            ? 'paxNumber=' + paxNumber
            : paxNumber === '' && carrCode !== null && formatDate === null
            ? 'carrierCode=' + carrCode
            : paxNumber === '' && carrCode === null && formatDate !== null
            ? 'departureDate=' + formatDate
            : paxNumber === '' && carrCode !== null && formatDate !== null
            ? 'carrierCode=' + carrCode + '&departureDate=' + formatDate
            : paxNumber !== '' && carrCode !== null && formatDate === null
            ? 'paxNumber=' + paxNumber + '&carrierCode=' + carrCode
            : paxNumber !== '' && carrCode === null && formatDate !== null
            ? 'paxNumber=' + paxNumber + '&departureDate=' + formatDate
            : null),
      )
      .then(response => {
        showMessage && showAlertSuccess(response.data.message, 'Maintain And Merge Pax')

        setRowData(response.data.result)
        setLoading(false)
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'Maintain And Merge Pax')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'Maintain And Merge Pax')
        else if (err.response.data.warning) {
          showMessage && showAlertWarn(err.response.data.warning, 'Maintain And Merge Pax')
        } else {
          showMessage && showAlertError('Internal Server Error')
        }
        setRowData(null)
        setLoading(false)
      })
    setIsMerge(false)
  }

  const handleGo1 = (showMessage = true, formattedDate, formattedCarrierCode) => {
    let formatDate
    let carrCode
    setLoading(true)
    if (departureDate !== null) {
      if (!formattedDate) {
        const year = departureDate.getFullYear()
        const month = departureDate.getMonth() + 1
        const date = departureDate.getDate()

        formatDate =
          year + '-' + (month < 10 ? '0' + month : month) + '-' + (date < 10 ? '0' + date : date)
      } else {
        formatDate = formattedDate
        console.log(formatDate)
      }
    } else {
      formatDate = null
    }
    if (carrierCode !== null) {
      if (!formattedCarrierCode) {
        carrCode = carrierCode.value.replace(/\s/g, '+')
      } else {
        carrCode = formattedCarrierCode.replace(/\s/g, '+')
      }
    } else {
      carrCode = null
    }
    axios
      .get(
        process.env.REACT_APP_SERVER_URI +
          '/api/pax/getPax?' +
          (paxNumber !== '' && carrCode !== null && formatDate !== null
            ? 'paxNumber=' + paxNumber + '&carrierCode=' + carrCode + '&departureDate=' + formatDate
            : paxNumber !== '' && carrCode === null && formatDate === null
            ? 'paxNumber=' + paxNumber
            : paxNumber === '' && carrCode !== null && formatDate === null
            ? 'carrierCode=' + carrCode
            : paxNumber === '' && carrCode === null && formatDate !== null
            ? 'departureDate=' + formatDate
            : paxNumber === '' && carrCode !== null && formatDate !== null
            ? 'carrierCode=' + carrCode + '&departureDate=' + formatDate
            : paxNumber !== '' && carrCode !== null && formatDate === null
            ? 'paxNumber=' + paxNumber + '&carrierCode=' + carrCode
            : paxNumber !== '' && carrCode === null && formatDate !== null
            ? 'paxNumber=' + paxNumber + '&departureDate=' + formatDate
            : null),
      )
      .then(response => {
        setRowData(response.data.result)
        setLoading(false)
      })
      .catch(err => {
        setRowData(null)
        setLoading(false)
      })
    setIsMerge(false)
  }
  const onPaxNumber = object => {
    const { value } = object.target
    const maxLength = 3

    setPaxNumber(value.replace(EXCEPT_NUMBER, ''))
  }
  return (
    <div className='ml-4 mr-4 bg-white'>
      <div>
        <h1 className='mb-4 mt-5'>{t('Maintain_And_Merge_Pax_label')}</h1>
      </div>

      <div className='mt-3'>
        <div className='row'>
          <div className='col-3'>
            <label className='form-label'>{t('Carrier_Code/Number_label')}</label>
            {/* <span className='astrick'>*</span> */}
            <br />
            <Dropdown
              closeMenuOnSelect={true}
              className='form-control mb-4 '
              value={carrierCode}
              placeholder={t('TEXT_SELECT_label')}
              onChange={selectedOption => setCarrierCode(selectedOption)}
              options={carrierCodeList}
              isClearable
              optionLabel='value'
              optionValue='value'
            />
          </div>
          <div className='col-3 ml-4'>
            <label className='form-label'>{t('Departure_Date_label')}</label>
            {/* <span className='astrick'>*</span> */}
            <br />
            <DatePicker
              dateFormat='yyyy-MM-dd'
              placeholderText='YYYY-MM-DD'
              className='form-control'
              selected={departureDate}
              popperPlacement='bottom'
              popperModifiers={{
                flip: {
                  behavior: ['bottom'],
                },
                preventOverflow: {
                  enabled: false,
                },
                hide: {
                  enabled: false,
                },
              }}
              onChange={selectedOption => setDepartureDate(selectedOption)}
            />
          </div>

          <div className='col-3 ml-2'>
            <label className='form-label'>{t('Pax_Number_label')}</label>
            <br />
            <input
              type='text'
              placeholder={t('Pax_Number_label')}
              className='form-control'
              maxLength={10}
              autoComplete='off'
              name='paxNumber'
              value={paxNumber}
              onChange={onPaxNumber}
            ></input>
          </div>
          <div className='col-2 mt-1'>
            <br />
            <button
              type='submit'
              className='btn btn-primary mr-3'
              disabled={!(carrierCode || departureDate || paxNumber)}
              onClick={handleGo}
            >
              {t('Go_label')}
            </button>
          </div>
        </div>
      </div>
      <div className='mt-4 row  '>
        <div className=' col-12 '>
          <button type='button' className=' btn btn-outline-secondary mr-3' onClick={handleClear}>
            {t('Clear_label')}
          </button>
          <button
            type='submit'
            className='btn btn-primary mr-3'
            disabled={disableMerge}
            onClick={getSelectedRowData}
          >
            {t('Merge_Pax_label')}
          </button>

          <button
            type='button'
            className=' btn btn-outline-secondary'
            onClick={handleFindDuplicate}
            disabled={!(carrierCode && departureDate)}
          >
            {t('Find_Duplicate_label')}
          </button>
        </div>
      </div>
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div>
          {rowData && rowData !== null && rowData.length > 0 ? (
            <div>
              <div className='mt-5'>
                {rowData && (rowData[0].paxMaster || rowData[0].paxNo) ? (
                  <h2>{t('Results_label')}</h2>
                ) : null}
              </div>
              <div
                id='myGrid'
                className='ag-theme-alpine'
                style={{
                  width: '100%',
                  height: 500,
                }}
              >
                {' '}
                {isMerge && rowData && rowData[0].paxMaster ? (
                  <AgGridReact
                    columnDefs={columnDefs}
                    rowData={rowData}
                    animateRows={true}
                    rowHeight={40}
                    headerHeight={40}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    context={props.context}
                    modules={AllModules}
                    onGridReady={onGridReady}
                    rowSelection={'multiple'}
                    onRowEditingStopped={onRowEditingStopped}
                    onRowEditingStarted={onRowEditingStarted}
                    // onCellClicked={onCellClicked}
                    frameworkComponents={{
                      numberEditor: NumberEditor,
                      customTooltip: ToolTip,
                    }}
                    onSelectionChanged={selectionChanged}
                    editType='fullRow'
                    suppressClickEdit={true}
                    undoRedoCellEditing={true}
                  />
                ) : rowData && rowData[0].paxNo ? (
                  <AgGridReact
                    columnDefs={columnDefs1}
                    rowData={rowData}
                    animateRows={true}
                    rowHeight={40}
                    headerHeight={40}
                    defaultColDef={defaultColDef}
                    pagination={true}
                    paginationPageSize={10}
                    context={props.context}
                    modules={AllModules}
                    onGridReady={onGridReady}
                    rowSelection={'multiple'}
                    onRowEditingStopped={onRowEditingStopped}
                    onRowEditingStarted={onRowEditingStarted}
                    onCellClicked={onCellClicked}
                    frameworkComponents={{
                      numberEditor: NumberEditor,
                      customTooltip: ToolTip,
                      textEditorFormat: TextEditorFormat,
                      textEditorFormat1: TextEditorFormat1,
                    }}
                    onSelectionChanged={selectionChanged}
                    editType='fullRow'
                    suppressClickEdit={true}
                    undoRedoCellEditing={true}
                  />
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  carrierCode: state.mergePaxReducer.carrierCode,
  departureDate: state.mergePaxReducer.departureDate,
  rowData: state.mergePaxReducer.rowData,
})

const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),

  setCarrierCode: data => dispatch(setCarrierCode(data)),
  setDepartureDate: data => dispatch(setDepartureDate(data)),
  setRowData: data => dispatch(setRowData(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MaintainMergePax)
