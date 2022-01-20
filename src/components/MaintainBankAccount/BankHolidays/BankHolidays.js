import React, { useState } from 'react'
import { connect } from 'react-redux'
import * as regex from 'constants/regex'
import * as labels from 'constants/labels'
import { mockDate } from 'constants/dateTime'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useTranslation } from 'react-i18next'
import DatePicker from 'react-datepicker'
import { DateEditor, TextEditor30 } from 'components/AgGridCustomComponents/Editors'
import { calcDate } from 'constants/dateTime'
import { AgGridReact } from '@ag-grid-community/react'
import { rowStyle } from 'assets/styles/ag-rowStyle'
import { AllModules } from '@ag-grid-enterprise/all-modules'
import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'

import { alertActions } from 'actions/alert.actions'
import { setBankHolidays, setHolidaysChanged } from 'actions/action-bank'

const BankHolidays = props => {
  const { t } = useTranslation()
  const {
    showAlertError,
    setBankHolidays,
    setHolidaysChanged,
    bankHolidays,
    bankHolidaysFormatted,
    disabled,
  } = props

  const chFormik = useFormik({
    initialValues: {
      chDate: '',
      chFrom: new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
      chTo: new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
    },
    validationSchema: Yup.object({
      chDate: Yup.date().required(
        t('Please_Enter_A_Date_In_Format_YYYY-MM-DD_Validation_Msg_label'),
      ),
      chRemarks: Yup.string().required(t('Please_Enter_A_Valid_Remark_Validation_Msg_label')),

      chTo: Yup.date().required(t('Please_Enter_A_Valid_Time_Validation_Msg_label')),
      chFrom: Yup.date()
        .required(t('Please_Enter_A_Valid_Time_Validation_Msg_label'))
        .when(
          'chTo',
          (chTo, schema) =>
            chTo &&
            schema.max(
              new Date(
                mockDate.getFullYear(),
                mockDate.getMonth(),
                mockDate.getDate(),
                chTo.getHours(),
                chTo.getMinutes() - 1,
              ),
              t('To_Time_Must_Be_Later_Than_From_Time_Validation_Msg_label'),
            ),
        ),
    }),
  })

  const handleSubmit = () => {
    const year = chFormik.values.chDate.getFullYear()
    const month = chFormik.values.chDate.getMonth() + 1
    const day = chFormik.values.chDate.getDate()

    const formattedDate =
      year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day)

    const hoursFrom = chFormik.values.chFrom.getHours()
    const minsFrom = chFormik.values.chFrom.getMinutes()
    const formattedTimeFrom =
      (hoursFrom < 10 ? '0' + hoursFrom : hoursFrom) +
      ':' +
      (minsFrom < 10 ? '0' + minsFrom : minsFrom)

    const hoursTo = chFormik.values.chTo.getHours()
    const minsTo = chFormik.values.chTo.getMinutes()
    const formattedTimeTo =
      (hoursTo < 10 ? '0' + hoursTo : hoursTo) + ':' + (minsTo < 10 ? '0' + minsTo : minsTo)

    if (bankHolidays.filter(rec => rec.bankHolidayDate === formattedDate).length === 0) {
      const newHoliday = {
        bankHolidayDate: formattedDate,
        bankHolidayDesc: chFormik.values.chRemarks,
        bankHolidayFrom: formattedTimeFrom,
        bankHolidayTo: formattedTimeTo,
      }

      const newBankHolidays = [...bankHolidays]
      newBankHolidays.push(newHoliday)

      setBankHolidays(newBankHolidays)
      setHolidaysChanged(true)
    } else {
      showAlertError('Only one holiday allowed for each date', 'creating new holiday')
    }

    chFormik.setSubmitting(true)
  }

  const actionCellRenderer = (params, disabled) => {
    let divElement = document.createElement('div')
    divElement.innerHTML = `
  <span> Read Only </span>
  `

    if (!disabled) {
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
    <button data-action="delete" class="edit-option"> Delete </button>
    `
      }
    }

    return divElement
  }

  const [gridApi, setGridApi] = useState(null)
  const [gridColumnApi, setGridColumnApi] = useState(null)

  const [state, setState] = useState({
    columnDefs: [
      {
        headerName: t('Action_label'),
        field: 'action',
        lockPosition: true,
        cellRenderer: params => actionCellRenderer(params, disabled),
        editable: false,
        colId: 'action',
        width: 150,
      },
      {
        headerName: t('Date/Time_label'),
        field: 'bankHolidayDateFormatted',
        sortable: true,
        filter: true,
        cellEditor: 'dateEditor',
        lockPosition: true,
        width: 250,
        editable: true,
      },

      {
        headerName: t('Remarks_label'),
        field: 'bankHolidayDesc',
        sortable: true,
        filter: true,
        cellEditor: 'textEditor',
        lockPosition: true,
        flex: 2,
        editable: true,
        width: 250,
      },
    ],
    defaultColDef: {
      width: 125,
      sortable: true,
      wrapText: true,
      resizable: true,
      cellStyle: rowStyle,
    },
    frameworkComponents: {
      dateEditor: DateEditor,
      textEditor: TextEditor30,
    },
  })

  let editedRow

  const onCellClicked = params => {
    // Handle click event for action cells
    if (params.column.colId === 'action' && params.event.target.dataset.action) {
      let action = params.event.target.dataset.action

      if (action === 'edit') {
        editedRow = params.node.data.bankHolidayDateFormatted
        params.api.startEditingCell({
          rowIndex: params.node.rowIndex,
          // gets the first columnKey
          colKey: params.columnApi.getDisplayedCenterColumns()[0].colId,
        })
      }
      if (action === 'delete') {
        const toBeDeleted = gridApi.getRowNode(params.node.rowIndex).data

        const newData = bankHolidays.filter(
          rec =>
            rec.bankHolidayDate !== toBeDeleted.bankHolidayDate &&
            rec.bankHolidayDesc !== toBeDeleted.bankHolidayDesc,
        )

        setBankHolidays(newData)
        setHolidaysChanged(true)
      }

      if (action === 'save') {
        params.api.stopEditing(false)

        const dateTimeValuesArr = params.node.data.bankHolidayDateFormatted.split(' ')
        const editedRemarks = params.node.data.bankHolidayDesc

        const toRemoveArr = editedRow.split(' ')
        const fromTimeArr = dateTimeValuesArr[1].split(':')
        const toTimeArr = dateTimeValuesArr[3].split(':')

        const fromTime = new Date(
          mockDate.getFullYear(),
          mockDate.getMonth(),
          mockDate.getDate(),
          Number(fromTimeArr[0]),
          Number(fromTimeArr[1]),
        )
        const toTime = new Date(
          mockDate.getFullYear(),
          mockDate.getMonth(),
          mockDate.getDate(),
          Number(toTimeArr[0]),
          Number(toTimeArr[1]),
        )

        const checkForDuplicateDate = bankHolidays.filter(
          rec => rec.bankHolidayDate === dateTimeValuesArr[0],
        )

        if (
          checkForDuplicateDate.length !== 0 &&
          checkForDuplicateDate[0].bankHolidayDate !== toRemoveArr[0]
        ) {
          showAlertError('Only one holiday allowed for each date', 'editing existing holiday')
        } else if (fromTime.getTime() >= toTime.getTime()) {
          showAlertError(`'To' time must be later than 'From' time`, 'editing existing holiday')
        } else {
          const newHoliday = {
            bankHolidayDate: dateTimeValuesArr[0],
            bankHolidayDesc: editedRemarks,
            bankHolidayFrom: dateTimeValuesArr[1],
            bankHolidayTo: dateTimeValuesArr[3],
          }

          const newBankHolidays = [...bankHolidays].filter(
            rec => rec.bankHolidayDate !== toRemoveArr[0],
          )
          newBankHolidays.push(newHoliday)

          setBankHolidays(newBankHolidays)
          setHolidaysChanged(true)
        }
        //call api again to refresh

        gridApi.refreshCells(params)
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

  const onGridReady = params => {
    setGridApi(params.api)
    setGridColumnApi(params.columnApi)
  }

  const handleDate = dateString => {
    chFormik.setFieldValue('chDate', dateString, true)
    chFormik.setSubmitting(false)
  }

  const handleTime = (event, maxLength = 2, hourMin) => {
    const value = event.target.value.replace(regex.EXCEPT_NUMBER, '').substring(0, maxLength)

    let newDate = new Date(chFormik.values[event.target.name])
    if (hourMin === 'hour') {
      newDate.setHours(value)
    } else if (hourMin === 'min') {
      newDate.setMinutes(value)
    }

    chFormik.setFieldValue(event.target.name, newDate, true)

    chFormik.setSubmitting(false)
  }

  const handleAlphaNumeric = (event, maxLength = 30) => {
    chFormik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_ALPHANUMERIC, '').substring(0, maxLength),
    )
    chFormik.setSubmitting(false)
  }

  const handleCancel = () => {
    chFormik.setFieldValue('chDate', '', false)
    chFormik.setFieldValue('chRemarks', '', false)
    chFormik.setFieldValue(
      'chFrom',
      new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
      false,
    )
    chFormik.setFieldValue(
      'chTo',
      new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
      false,
    )
  }

  return (
    <React.Fragment>
      <h2 className='text-primary mb-3'>3. {t('Bank_Holidays_label')}</h2>
      <div className='box1 ml-0 p-4'>
        <div className='row mb-2'>
          <div className='col-12 h3'>{t('Create_Holiday_label')}</div>
        </div>

        <div className='row mb-4'>
          <div className='col-4'>
            <label className='form-label'>
              {t('Date_label')}
              <span className='text-danger'> *</span>
            </label>
            <div>
              <DatePicker
                id='chDate'
                name='chDate'
                onBlur={chFormik.handleBlur}
                className='form-control'
                autoComplete='off'
                placeholderText={t('TEXT_DATE_FORMAT_label')}
                selected={chFormik.values.chDate}
                dateFormat='yyyy-MM-dd'
                minDate={calcDate()}
                onSelect={handleDate}
                disabledKeyboardNavigation
                disabled={disabled}
              />
            </div>
            {chFormik.touched.chDate && chFormik.errors.chDate ? (
              <span className='h5 text-danger'>{chFormik.errors.chDate}</span>
            ) : null}
          </div>
          <div className='col-4'>
            <label className='form-label'>
              {t('Remarks_label')}
              <span className='text-danger'> *</span>
            </label>
            <input
              id='chRemarks'
              name='chRemarks'
              type='text'
              placeholder={t('TEXT_HOLIDAY_TYPE_label')}
              onChange={handleAlphaNumeric}
              onBlur={chFormik.handleBlur}
              value={chFormik.values.chRemarks}
              className='form-control'
              disabled={disabled}
            />
            {chFormik.touched.chRemarks && chFormik.errors.chRemarks ? (
              <span className='h5 text-danger'>{chFormik.errors.chRemarks}</span>
            ) : null}
          </div>
        </div>
        <div className='row mt-0 mb-0'>
          <div className='col-2 h6'>{t('FROM_HOURS_label')}</div>
          <div className='col-2 h6'></div>
          <div className='col-2 h6'>{t('TO_HOURS_label')}</div>
          <div className='col-2 h6'></div>
        </div>
        <div className='row'>
          <div className='col-2'>
            <label className='form-label'>
              {t('Hours_label')}
              <span className='text-danger'> *</span>
            </label>
            <input
              id='chFrom'
              name='chFrom'
              type='number'
              className='form-control'
              placeholder='0'
              onChange={e => handleTime(e, 2, 'hour')}
              onBlur={chFormik.handleBlur}
              value={chFormik.values.chFrom.getHours()}
              min={0}
              max={23}
              disabled={disabled}
            />
          </div>
          <div className='col-2'>
            <label className='form-label'>
              {t('Minutes_label')}
              <span className='text-danger'> *</span>
            </label>
            <input
              id='chFrom'
              name='chFrom'
              type='number'
              className='form-control'
              placeholder={t('0_label')}
              onChange={e => handleTime(e, 2, 'min')}
              onBlur={chFormik.handleBlur}
              value={chFormik.values.chFrom.getMinutes()}
              min={0}
              max={59}
              disabled={disabled}
            />
          </div>
          <div className='col-2'>
            <label className='form-label'>
              {t('Hours_label')}
              <span className='text-danger'> *</span>
            </label>
            <input
              id='chTo'
              name='chTo'
              type='number'
              className='form-control'
              placeholder={t('0_label')}
              onChange={e => handleTime(e, 2, 'hour')}
              onBlur={chFormik.handleBlur}
              value={chFormik.values.chTo.getHours()}
              min={0}
              max={23}
              disabled={disabled}
            />
          </div>
          <div className='col-2'>
            <label className='form-label'>
              {t('Minutes_label')}
              <span className='text-danger'> *</span>
            </label>
            <input
              id='chTo'
              name='chTo'
              type='number'
              className='form-control'
              placeholder={t('0_label')}
              onChange={e => handleTime(e, 2, 'min')}
              onBlur={chFormik.handleBlur}
              value={chFormik.values.chTo.getMinutes()}
              min={0}
              max={59}
              disabled={disabled}
            />
          </div>
          <div className='ml-2 align-self-end'>
            <button
              type='button'
              className='btn btn-primary mr-3'
              onClick={handleSubmit}
              disabled={!(chFormik.isValid && chFormik.dirty) || chFormik.isSubmitting}
            >
              {t('Add_New_label')}
            </button>
            <button type='button' onClick={handleCancel} className=' btn btn-outline-secondary'>
              {t('Cancel_label')}
            </button>
          </div>
        </div>
        <div className='row mt-2'>
          <div className='col-12'>
            {(chFormik.touched.chTo || chFormik.touched.chFrom) && chFormik.errors.chFrom ? (
              <span className='h5 text-danger'>{chFormik.errors.chFrom}</span>
            ) : null}
          </div>
        </div>
        <div className='row mt-5'>
          <div className='col-12 h3'>{t('Maintain_Holidays_label')}</div>
        </div>
        <div className='row' style={{ height: '450px' }}>
          <div className='col-12'>
            <div className='ag-theme-alpine' style={{ height: 400, width: '100%' }}>
              <AgGridReact
                columnDefs={state.columnDefs}
                rowData={bankHolidaysFormatted}
                animateRows={true}
                rowHeight={50}
                headerHeight={55}
                defaultColDef={state.defaultColDef}
                frameworkComponents={state.frameworkComponents}
                pagination={true}
                paginationPageSize={10}
                context={props.context}
                modules={AllModules}
                onGridReady={onGridReady}
                onRowEditingStopped={onRowEditingStopped}
                onRowEditingStarted={onRowEditingStarted}
                onCellClicked={onCellClicked}
                editType='fullRow'
                suppressClickEdit={true}
                undoRedoCellEditing={true}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = state => ({
  bankHolidays: state.bankReducer.bankHolidays,
  bankHolidaysChanged: state.bankReducer.bankHolidaysChanged,

  bankHolidaysFormatted: state.bankReducer.bankHolidaysFormatted,
})

const mapDispatchToProps = dispatch => ({
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),

  setBankHolidays: data => dispatch(setBankHolidays(data)),
  setHolidaysChanged: data => dispatch(setHolidaysChanged(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(BankHolidays)
