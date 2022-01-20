import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { calcDate } from 'constants/dateTime'
import DatePicker from 'react-datepicker'

const DateEditor = forwardRef((props, ref) => {
  const valueArr = props.value.split(' ')
  const dateArr = valueArr[0].split('-')
  const startTimeArr = valueArr[1].split(':')
  const endTimeArr = valueArr[3].split(':')

  const refInput = useRef(null)
  const [value, setValue] = useState(props.value)

  const [startTimeHour, setStartTimeHour] = useState(Number(startTimeArr[0]))
  const [startTimeMin, setStartTimeMin] = useState(Number(startTimeArr[1]))

  const [endTimeHour, setEndTimeHour] = useState(Number(endTimeArr[0]))
  const [endTimeMin, setEndTimeMin] = useState(Number(endTimeArr[1]))

  const [dateObj, setDateObj] = useState(
    new Date(Number(dateArr[0]), Number(dateArr[1] - 1), Number(dateArr[2]), 0, 0),
  )

  useEffect(() => {
    const tempDate = new Date(dateObj)

    const year = tempDate.getFullYear()
    const month = tempDate.getMonth() + 1
    const date = tempDate.getDate()

    setValue(
      year +
        '-' +
        (month < 10 ? '0' + month : month) +
        '-' +
        (date < 10 ? '0' + date : date) +
        ' ' +
        (startTimeHour < 10 ? '0' + startTimeHour : startTimeHour) +
        ':' +
        (startTimeMin < 10 ? '0' + startTimeMin : startTimeMin) +
        ' - ' +
        (endTimeHour < 10 ? '0' + endTimeHour : endTimeHour) +
        ':' +
        (endTimeMin < 10 ? '0' + endTimeMin : endTimeMin),
    )
  }, [dateObj, startTimeHour, startTimeMin, endTimeHour, endTimeMin])

  /* Component Editor Lifecycle methods */
  useImperativeHandle(ref, () => {
    return {
      // the final value to send to the grid, on completion of editing
      getValue() {
        const tempDate = new Date(dateObj)

        const year = tempDate.getFullYear()
        const month = tempDate.getMonth() + 1
        const date = tempDate.getDate()

        setValue(
          year +
            '-' +
            (month < 10 ? '0' + month : month) +
            '-' +
            (date < 10 ? '0' + date : date) +
            ' ' +
            (startTimeHour < 10 ? '0' + startTimeHour : startTimeHour) +
            ':' +
            (startTimeMin < 10 ? '0' + startTimeMin : startTimeMin) +
            ' - ' +
            (endTimeHour < 10 ? '0' + endTimeHour : endTimeHour) +
            ':' +
            (endTimeMin < 10 ? '0' + endTimeMin : endTimeMin),
        )

        return value
      },

      // Gets called once before editing starts, to give editor a chance to
      // cancel the editing before it even starts.
      isCancelBeforeStart() {
        return false
      },
      isPopup() {
        return true
      },

      // Gets called once when editing is finished (eg if enter is pressed).
      // If you return true, then the result of the edit will be ignored.
    }
  })

  const onChangeDate = date => {
    // console.log(date)
    setDateObj(new Date(date))
  }
  return (
    <DatePicker
      value={value}
      ref={refInput}
      className='form-control'
      selected={dateObj}
      onChange={onChangeDate}
      style={{ zIndex: '999', position: 'relative' }}
      minDate={calcDate()}
      disabledKeyboardNavigation
    >
      <div className='row mt-4'>
        <div className='row pl-4 pr-4 mt-3'>
          <div className='col-12 h6'>From Time</div>
        </div>
        <div className='row pl-4 pr-4'>
          <div className='col-5'>
            <input
              name='startTimeHour'
              type='number'
              max={23}
              min={0}
              onChange={e => setStartTimeHour(e.target.value.substring(0, 2))}
              value={startTimeHour}
              className='form-control'
              placeholder='HH'
            />
          </div>
          <div className='h1 col'>:</div>
          <div className='col-5'>
            <input
              name='startTimeMin'
              type='number'
              max={59}
              min={0}
              onChange={e => setStartTimeMin(e.target.value.substring(0, 2))}
              value={startTimeMin}
              className='form-control'
              placeholder='MM'
            />
          </div>
        </div>

        <div className='row pl-4 pr-4 mt-2'>
          <div className='col-12 h6'>To Time</div>
        </div>
        <div className='row pl-4 pr-4'>
          <div className='col-5'>
            <input
              name='endTimeHour'
              type='number'
              max={23}
              min={0}
              onChange={e => setEndTimeHour(e.target.value.substring(0, 2))}
              value={endTimeHour}
              className='form-control'
              placeholder='HH'
            />
          </div>
          <div className='h1 col'>:</div>
          <div className='col-5'>
            <input
              name='endTimeMin'
              type='number'
              max={59}
              min={0}
              onChange={e => setEndTimeMin(e.target.value.substring(0, 2))}
              value={endTimeMin}
              className='form-control'
              placeholder='MM'
            />
          </div>
        </div>
      </div>
    </DatePicker>
  )
})

export default DateEditor
