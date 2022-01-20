import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Modal, Button } from 'react-bootstrap'
import Loader from 'react-loader-spinner'
import { EXCEPT_NUMBER } from 'constants/regex'
import { useTranslation } from 'react-i18next'
import 'react-datepicker/dist/react-datepicker.css'
import axios from 'axios'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { useFormik } from 'formik'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

import { releaseBagsActions } from 'actions/releaseBags.actions'
import { AgGridColumn, AgGridReact } from '@ag-grid-community/react'

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

const actionCellRenderer = params => {
  let divElement = document.createElement('div')

  let editingCells = params.api.getEditingCells()

  // checks if the rowIndex matches in at least one of the editing cells
  let isCurrentRowEditing = editingCells.some(cell => {
    return cell.rowIndex === params.node.rowIndex
  })

  divElement.innerHTML = `
<button data-action="release" class="edit-option"> Release </button>

`

  return divElement
}

function releaseBags(props) {
  const [gridApi, setGridApi] = useState(null)
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const [gridColumnApi, setGridColumnApi] = useState(null)
  const [rowData, setRowData] = useState([])
  const [data, setData] = useState([])

  const [paxNumber, setPaxNumber] = useState('')
  const [paxNumber1, setPaxNumber1] = useState('')
  const [show, setShow] = useState(false)
  const [display, setDisplay] = useState(false)
  const [bagNumber, setBagNumber] = useState('')

  const [disableGo, setDisableGo] = useState(true)
  const [msg1, setMsg1] = useState('')
  const columnDefs = [
    {
      headerName: t('Bag_Number_label'),
      field: 'bagNo',
      sortable: true,
      filter: true,
      sort: 'asc',
      lockPosition: true,

      width: 140,
      editable: false,
    },
    {
      headerName: t('Carton_Number_label'),
      field: 'cartonNumber',
      sortable: true,

      filter: true,
      lockPosition: true,

      width: 160,

      editable: false,
    },
    {
      headerName: t('Cage_Number_label'),
      field: 'cageNumber',
      sortable: true,

      filter: true,
      lockPosition: true,

      width: 160,
      editable: false,
    },
    {
      headerName: t('Status_label'),
      field: 'bagStatus',
      sortable: true,

      filter: true,

      lockPosition: true,

      width: 250,
      editable: false,
    },
    {
      headerName: t('Action_label'),
      field: 'action',
      cellRenderer: actionCellRenderer,
      editable: false,

      colId: 'action',
      width: 150,
      lockPosition: true,
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

  const onCellClicked = params => {
    // Handle click event for action cells
    if (params.column.colId === 'action' && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action

      if (action === 'release') {
        let dataBag = {}
        dataBag.bagNo = params.node.data.bagNo
        dataBag.cartonNumber = params.node.data.cartonNumber
        dataBag.cageNumber = params.node.data.cageNumber
        dataBag.bagStatus = params.node.data.bagStatus
        dataBag.carrierNumber = params.node.data.carrierNumber
        dataBag.carrierDate = params.node.data.carrierDate
        props.releaseBags(dataBag)
        setLoading(true)
      }
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
  })

  const onChangePax = object => {
    const { value } = object.target

    setPaxNumber(value.replace(EXCEPT_NUMBER, ''))
  }
  const onChangeBag = object => {
    const { value } = object.target

    setBagNumber(value.replace(EXCEPT_NUMBER, ''))
  }
  const handleGo = () => {
    let data = {}
    data.paxNumber = paxNumber

    props.getBags(data)
    setPaxNumber1(paxNumber)
    setDisplay(true)
    setBagNumber('')
    setLoading(true)
  }
  useEffect(() => {
    if (props.releaseBagsData && props.releaseBagsData.result) {
      axios
        .get(process.env.REACT_APP_SERVER_URI + '/api/bag/releaseLookup?paxNumber=' + paxNumber)
        .then(response => {
          setRowData(response.data.result)
          setLoading(false)
        })
        .catch(err => {
          setRowData([])
          setLoading(false)
        })
    } else if (props.releaseBagsData && !props.releaseBagsData.result) {
      setLoading(false)
    }
  }, [props.releaseBagsData])
  function onGridReady(params) {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  useEffect(() => {
    if (paxNumber !== '' && paxNumber.length === 10) {
      setDisableGo(false)
    } else {
      setDisableGo(true)
    }
  }, [paxNumber])
  useEffect(() => {
    if (paxNumber !== '' && paxNumber.length !== 10) {
      setMsg1(t('Pax_Number_Should_Be_Of_10_Digits_label'))
    } else {
      setMsg1('')
    }
  }, [paxNumber])

  useEffect(() => {
    if (display === true) {
      if (paxNumber1 !== setPaxNumber) {
        setDisplay(false)
      }
    }
  }, [paxNumber])
  useEffect(() => {
    if (props.getBagsData && props.getBagsData.result) {
      setRowData(props.getBagsData.result)
      setLoading(false)
    } else if (props.getBagsData && !props.getBagsData.result) {
      setRowData([])
      setLoading(false)
    }
  }, [props.getBagsData])

  useEffect(() => {
    if (bagNumber.length === 12) {
      let b = rowData
      let c = b.filter(b => b.bagNo === bagNumber)
      setData(c[0])
      setShow(true)
    }
  }, [bagNumber])
  const handleClose = () => setShow(false)
  const handleRelease = () => {
    setShow(false)
    props.releaseBags(data)
    setLoading(true)
  }
  return (
    <div className='container bg-white'>
      <div>
        <h1 className='mb-4 mt-5'>{t('Release_Bags_label')}</h1>
      </div>
      {/* <button onClick={getSelectedRowData} style={{ margin: 10 }}>
        Get Selected Nodes
      </button> */}

      <div className='mt-3'>
        <Row>
          <Col xs='3'>
            <label className='form-label'>{t('Pax_Number_label')}</label>
            <span className='astrick'>*</span>
            <input
              type='text'
              placeholder={t('Search_Pax_Number_label')}
              className='form-control'
              maxLength={10}
              // maxLength='3'
              // min={100}
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
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div>
          {props.getBagsData && props.getBagsData.result && display ? (
            <div className='row'>
              <div className='col-sm'>
                <h2 className='mb-3 mt-5 '>
                  {t('Release_Bag_for_Pax_label')} #{paxNumber1}
                </h2>
              </div>
            </div>
          ) : null}
          {props.getBagsData && props.getBagsData.result && display ? (
            <div className='row'>
              <div className='col-sm-9 box1' style={{ backgroundColor: '#E4F3FF' }}>
                <div className='row'>
                  <div className='col-sm-3 mr-4'>
                    <div className='form-group'>
                      <label htmlFor='originAirport'>{t('Bag_Number_label')}</label>{' '}
                      <input
                        type='text'
                        className='form-control'
                        maxLength={12}
                        autoComplete='off'
                        name='bagNumber'
                        value={bagNumber}
                        onChange={onChangeBag}
                      ></input>
                    </div>
                  </div>
                  <div className='col-sm-3'>
                    <div className='form-group'>
                      <label htmlFor='destinationAirport'>
                        {t('Departure_Flight_Number_label')}
                      </label>{' '}
                      <div>
                        {' '}
                        {props.getBagsData.result[0] && props.getBagsData.result[0].carrierNumber
                          ? props.getBagsData.result[0].carrierNumber
                          : '-'}
                      </div>
                    </div>
                  </div>
                  <div className='col-sm-3'>
                    <div className='form-group'>
                      <label htmlFor='pickupLocation'>{t('Departure_Flight_Date_label')}</label>
                      <div>
                        {props.getBagsData.result[0] && props.getBagsData.result[0].carrierDate
                          ? props.getBagsData.result[0].carrierDate
                          : '-'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {props.getBagsData && props.getBagsData.result && display ? (
            <div
              id='myGrid'
              className='ag-theme-alpine mt-3'
              style={{
                width: '88%',
                height: 500,
              }}
            >
              <AgGridReact
                columnDefs={columnDefs}
                rowData={rowData}
                animateRows={true}
                rowHeight={30}
                headerHeight={40}
                defaultColDef={defaultColDef}
                pagination={true}
                paginationPageSize={10}
                context={props.context}
                modules={AllCommunityModules}
                onGridReady={onGridReady}
                onCellClicked={onCellClicked}
                frameworkComponents={{
                  numberEditor: NumberEditor,
                }}
                editType='fullRow'
                suppressClickEdit={true}
                undoRedoCellEditing={true}
              />
            </div>
          ) : null}
        </div>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {' '}
          {bagNumber.length === 12 && data && data.carrierDate
            ? t('Do_you_want_to_Release_Bag?_label') + data.bagNo
            : t("Bag_doesn't_exist_label")}
        </Modal.Body>
        <Modal.Footer>
          <button type='button' className=' btn btn-outline-secondary' onClick={handleClose}>
            {t('Cancel_label')}
          </button>
          {bagNumber.length === 12 && data && data.carrierDate ? (
            <Button variant='primary' onClick={handleRelease}>
              {t('Release_label')}
            </Button>
          ) : null}
        </Modal.Footer>
      </Modal>
    </div>
  )
}

function mapState(state) {
  return {
    getBagsData: state.getBags.getData,
    releaseBagsData: state.releaseBags.getData,
  }
}

const actionCreators = {
  getBags: releaseBagsActions.getBags,
  releaseBags: releaseBagsActions.releaseBags,
}

export default connect(mapState, actionCreators)(releaseBags)
