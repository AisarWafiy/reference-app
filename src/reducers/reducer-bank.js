import {
  SET_SAVINGS_ACC,
  SET_FLIGHT_ACC,
  SET_VESSEL_ACC,
  SET_BANK_HOLIDAYS,
  SET_BANK_NON_WORKINGS,
  SET_INIT_VAL,
  SET_HOLIDAYS_CHANGED,
} from 'actions/action-bank'

const initialState = {
  initVal: {},

  savingsAcc: {},
  flightAcc: {},
  vesselAcc: {},

  bankHolidays: [],
  bankHolidaysFormatted: [],
  bankHolidaysChanged: false,

  mondayDetails: {},
  tuesdayDetails: {},
  wednesdayDetails: {},
  thursdayDetails: {},
  fridayDetails: {},
  saturdayDetails: {},
  sundayDetails: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_INIT_VAL:
      return {
        ...state,
        initVal: action.payload,
      }

    case SET_SAVINGS_ACC:
      return {
        ...state,
        savingsAcc: action.payload,
      }

    case SET_FLIGHT_ACC:
      return {
        ...state,
        flightAcc: action.payload,
      }

    case SET_VESSEL_ACC:
      return {
        ...state,
        vesselAcc: action.payload,
      }

    case SET_HOLIDAYS_CHANGED:
      return {
        ...state,
        bankHolidaysChanged: action.payload,
      }

    case SET_BANK_HOLIDAYS:
      return {
        ...state,
        bankHolidays: action.payload,

        bankHolidaysFormatted: action.payload.map(rec => ({
          ...rec,
          bankHolidayDateFormatted:
            rec.bankHolidayDate + ' ' + rec.bankHolidayFrom + ' - ' + rec.bankHolidayTo,
        })),
      }

    case SET_BANK_NON_WORKINGS: {
      const sunday = action.payload.filter(res => {
        return res.bankDay === 1
      })

      const monday = action.payload.filter(res => {
        return res.bankDay === 2
      })

      const tuesday = action.payload.filter(res => {
        return res.bankDay === 3
      })

      const wednesday = action.payload.filter(res => {
        return res.bankDay === 4
      })

      const thursday = action.payload.filter(res => {
        return res.bankDay === 5
      })

      const friday = action.payload.filter(res => {
        return res.bankDay === 6
      })

      const saturday = action.payload.filter(res => {
        return res.bankDay === 7
      })

      return {
        ...state,
        sundayDetails: sunday.length !== 0 ? Object.assign(...sunday) : null,
        mondayDetails: monday.length !== 0 ? Object.assign(...monday) : null,
        tuesdayDetails: tuesday.length !== 0 ? Object.assign(...tuesday) : null,
        wednesdayDetails: wednesday.length !== 0 ? Object.assign(...wednesday) : null,
        thursdayDetails: thursday.length !== 0 ? Object.assign(...thursday) : null,
        fridayDetails: friday.length !== 0 ? Object.assign(...friday) : null,
        saturdayDetails: saturday.length !== 0 ? Object.assign(...saturday) : null,
      }
    }

    default:
      return state
  }
}
