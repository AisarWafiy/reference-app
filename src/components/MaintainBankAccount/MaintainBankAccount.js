import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { alertActions } from 'actions/alert.actions'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import Loader from 'react-loader-spinner'
import * as regex from 'constants/regex'
import * as labels from 'constants/labels'
import { mockDate } from 'constants/dateTime'

import SavingAccountNumber from 'components/MaintainBankAccount/SavingAccountNumber/SavingAccountNumber'
import BankDetails from 'components/MaintainBankAccount/BankDetails/BankDetails'
import BankHolidays from 'components/MaintainBankAccount/BankHolidays/BankHolidays'
import SecurityAccount from 'components/MaintainBankAccount/SecurityAccount/SecurityAccount'
import {
  setSavingsAcc,
  setFlightAcc,
  setVesselAcc,
  setBankHolidays,
  setBankNonWorkings,
  setHolidaysChanged,
} from 'actions/action-bank'

const MaintainBankAccount = props => {
  const {
    showAlertSuccess,
    showAlertError,
    showAlertWarn,
    setSavingsAcc,
    setFlightAcc,
    setVesselAcc,
    setBankHolidays,
    setBankNonWorkings,

    setHolidaysChanged,

    savingsAcc,
    flightAcc,
    vesselAcc,
    bankHolidays,
    bankHolidaysChanged,

    mondayDetails,
    tuesdayDetails,
    wednesdayDetails,
    thursdayDetails,
    fridayDetails,
    saturdayDetails,
    sundayDetails,
  } = props
  const [loading, setLoading] = useState(true)
  const [initVal, setInitVal] = useState({})
  const { t } = useTranslation()

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + '/api/bac/listAcc')
      .then(response => {
        setSavingsAcc(
          Object.assign(
            ...response.data.result.bankAccounts.filter(res => {
              return res.bankAccountTypeName === 'Savings'
            }),
          ),
        )
        setFlightAcc(
          Object.assign(
            ...response.data.result.bankAccounts.filter(res => {
              return res.bankAccountTypeName === 'Flight'
            }),
          ),
        )
        setVesselAcc(
          Object.assign(
            ...response.data.result.bankAccounts.filter(res => {
              return res.bankAccountTypeName === 'Vessel'
            }),
          ),
        )
        setBankHolidays(response.data.result.bankHolidays)
        setBankNonWorkings(response.data.result.bankNonWorkings)
        setLoading(false)
      })
      .catch(err => {
        if (err.response.data.error && !err.response.data.record)
          showAlertError(err.response.data.error, 'retrieving bank account details')
        else if (err.response.data.error && err.response.data.record)
          showAlertError(err.response.data.record, 'retrieving bank account details')
        else if (err.response.data.warning)
          showAlertWarn(err.response.data.warning, 'retrieving bank account details')
        else showAlertError('Internal Server Error')
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    setInitVal(prevState => ({
      ...prevState,
      acctNo: savingsAcc.bankAccountNo,
      bankName: savingsAcc.bankName,
      branchName: savingsAcc.bankBranch,
      postalCode: savingsAcc.bankPostCode,
      address1: savingsAcc.bankAddressLine1,
      address2: savingsAcc.bankAddressLine2,
      city: savingsAcc.bankCity,
      country: savingsAcc.bankCountry,

      flightAccNo: flightAcc.bankAccountNo,
      flightAccDesc: flightAcc.bankDesc,

      vesselAccNo: vesselAcc.bankAccountNo,
      vesselAccDesc: vesselAcc.bankDesc,
    }))
  }, [savingsAcc, flightAcc, vesselAcc])

  useEffect(() => {
    setInitVal(prevState => ({
      ...prevState,
      mondayCheck: mondayDetails ? mondayDetails.bankNonWorkFlag === 'Y' : false,
      mondayFrom: mondayDetails ? getTimefromStr(mondayDetails.bankFromTime) : getTimefromStr(null),
      mondayTo: mondayDetails ? getTimefromStr(mondayDetails.bankToTime) : getTimefromStr(null),
    }))
  }, [mondayDetails])

  useEffect(() => {
    setInitVal(prevState => ({
      ...prevState,
      tuesdayCheck: tuesdayDetails ? tuesdayDetails.bankNonWorkFlag === 'Y' : false,
      tuesdayFrom: tuesdayDetails
        ? getTimefromStr(tuesdayDetails.bankFromTime)
        : getTimefromStr(null),
      tuesdayTo: tuesdayDetails ? getTimefromStr(tuesdayDetails.bankToTime) : getTimefromStr(null),
    }))
  }, [tuesdayDetails])

  useEffect(() => {
    setInitVal(prevState => ({
      ...prevState,
      wednesdayCheck: wednesdayDetails ? wednesdayDetails.bankNonWorkFlag === 'Y' : false,
      wednesdayFrom: wednesdayDetails
        ? getTimefromStr(wednesdayDetails.bankFromTime)
        : getTimefromStr(null),
      wednesdayTo: wednesdayDetails
        ? getTimefromStr(wednesdayDetails.bankToTime)
        : getTimefromStr(null),
    }))
  }, [wednesdayDetails])

  useEffect(() => {
    setInitVal(prevState => ({
      ...prevState,
      thursdayCheck: thursdayDetails ? thursdayDetails.bankNonWorkFlag === 'Y' : false,
      thursdayFrom: thursdayDetails
        ? getTimefromStr(thursdayDetails.bankFromTime)
        : getTimefromStr(null),
      thursdayTo: thursdayDetails
        ? getTimefromStr(thursdayDetails.bankToTime)
        : getTimefromStr(null),
    }))
  }, [thursdayDetails])

  useEffect(() => {
    setInitVal(prevState => ({
      ...prevState,
      fridayCheck: fridayDetails ? fridayDetails.bankNonWorkFlag === 'Y' : false,
      fridayFrom: fridayDetails ? getTimefromStr(fridayDetails.bankFromTime) : getTimefromStr(null),
      fridayTo: fridayDetails ? getTimefromStr(fridayDetails.bankToTime) : getTimefromStr(null),
    }))
  }, [fridayDetails])

  useEffect(() => {
    setInitVal(prevState => ({
      ...prevState,
      saturdayCheck: saturdayDetails ? saturdayDetails.bankNonWorkFlag === 'Y' : false,
      saturdayFrom: saturdayDetails
        ? getTimefromStr(saturdayDetails.bankFromTime)
        : getTimefromStr(null),
      saturdayTo: saturdayDetails
        ? getTimefromStr(saturdayDetails.bankToTime)
        : getTimefromStr(null),
    }))
  }, [saturdayDetails])

  useEffect(() => {
    setInitVal(prevState => ({
      ...prevState,
      sundayCheck: sundayDetails ? sundayDetails.bankNonWorkFlag === 'Y' : false,
      sundayFrom: sundayDetails ? getTimefromStr(sundayDetails.bankFromTime) : getTimefromStr(null),
      sundayTo: sundayDetails ? getTimefromStr(sundayDetails.bankToTime) : getTimefromStr(null),
    }))
  }, [sundayDetails])

  const getTimefromStr = time => {
    if (time) {
      const timeArr = time.split(':')

      return new Date(
        mockDate.getFullYear(),
        mockDate.getMonth(),
        mockDate.getDate(),
        Number(timeArr[0]),
        Number(timeArr[1]),
      )
    } else {
      return new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0)
    }
  }

  const getHHMMFromDate = date => {
    return date.toTimeString().split(' ')[0].slice(0, 5)
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initVal,
    validationSchema: Yup.object({
      acctNo: Yup.string()
        .max(14, t('Cannot_Exceed_14_Characters_Validation_Msg_label'))
        .matches(
          regex.ALPHANUMERIC_NO_SC,
          t('Special_Characters_Are_Not_Accepted_Validation_Msg_label'),
        )
        .required(t('Please_Enter_A_Valid_Bank_Account_Number_Validation_Msg_label')),
      bankName: Yup.string()
        .max(25, t('Cannot_Exceed_25_Characters_Validation_Msg_label'))
        .matches(
          regex.ALPHANUMERIC_NO_SC,
          t('Special_Characters_Are_Not_Accepted_Validation_Msg_label'),
        )
        .nullable(),
      branchName: Yup.string()
        .max(25, t('Cannot_Exceed_25_Characters_Validation_Msg_label'))
        .matches(
          regex.ALPHANUMERIC_NO_SC,
          t('Special_Characters_Are_Not_Accepted_Validation_Msg_label'),
        )
        .nullable(),
      postalCode: Yup.string()
        .max(7, t('Cannot_Exceed_7_Characters_Validation_Msg_label'))
        .matches(regex.NUMBER_NO_SC, t('Must_Be_Only_Digits_Validation_Msg_label'))
        .nullable(),
      address1: Yup.string()
        .max(25, t('Cannot_Exceed_25_Characters_Validation_Msg_label'))

        .required(t('Please_Enter_An_Address_Validation_Msg_label')),
      address2: Yup.string()
        .max(25, t('Cannot_Exceed_25_Characters_Validation_Msg_label'))

        .nullable(),
      city: Yup.string()
        .max(25, t('Cannot_Exceed_25_Characters_Validation_Msg_label'))

        .required(t('Please_Enter_An_Address_Validation_Msg_label')),
      country: Yup.string()
        .max(18, t('Cannot_Exceed_18_Characters_Validation_Msg_label'))
        .nullable(),

      flightAccNo: Yup.string()
        .max(14, t('Cannot_Exceed_14_Characters_Validation_Msg_label'))
        .matches(
          regex.ALPHANUMERIC_NO_SC,
          t('Special_Characters_Are_Not_Accepted_Validation_Msg_label'),
        )
        .required(t('Please_Enter_A_Flight_Account_Number_Validation_Msg_label')),
      flightAccDesc: Yup.string()
        .max(30, t('Cannot_Exceed_30_Characters_Validation_Msg_label'))
        .matches(
          regex.ALPHANUMERIC_NO_SC,
          t('Special_Characters_Are_Not_Accepted_Validation_Msg_label'),
        )
        .nullable(),
      vesselAccNo: Yup.string()
        .max(14, t('Cannot_Exceed_14_Characters_Validation_Msg_label'))
        .matches(
          regex.ALPHANUMERIC_NO_SC,
          t('Special_Characters_Are_Not_Accepted_Validation_Msg_label'),
        )
        .required(t('Please_Enter_A_Vessel_Account_Number_Validation_Msg_label')),
      vesselAccDesc: Yup.string()
        .max(30, t('Cannot_Exceed_30_Characters_Validation_Msg_label'))
        .matches(
          regex.ALPHANUMERIC_NO_SC,
          t('Special_Characters_Are_Not_Accepted_Validation_Msg_label'),
        )
        .nullable(),

      mondayCheck: Yup.bool(),
      tuesdayCheck: Yup.bool(),
      wednesdayCheck: Yup.bool(),
      thursdayCheck: Yup.bool(),
      fridayCheck: Yup.bool(),
      saturdayCheck: Yup.bool(),
      sundayCheck: Yup.bool(),

      mondayFrom: Yup.date()
        .required(t('Please_Enter_A_Valid_Time_Validation_Msg_label'))
        .when('mondayCheck', {
          is: false,
          then: Yup.date().when(
            'mondayTo',
            (mondayTo, schema) =>
              mondayTo &&
              schema.max(
                new Date(
                  mockDate.getFullYear(),
                  mockDate.getMonth(),
                  mockDate.getDate(),
                  mondayTo.getHours(),
                  mondayTo.getMinutes() - 1,
                ),
                t('Start_Time_Must_Be_Later_Than_End_Time_Validation_Msg_label'),
              ),
          ),
        }),
      mondayTo: Yup.date()
        .required(t('Please_Enter_A_Valid_Time_Validation_Msg_label'))
        .when('mondayCheck', {
          is: false,
          then: Yup.date().when(
            'mondayFrom',
            (mondayFrom, schema) =>
              mondayFrom &&
              schema.min(
                new Date(
                  mockDate.getFullYear(),
                  mockDate.getMonth(),
                  mockDate.getDate(),
                  mondayFrom.getHours(),
                  mondayFrom.getMinutes() + 1,
                ),
                t('Start_Time_Must_Be_Later_Than_End_Time_Validation_Msg_label'),
              ),
          ),
        }),

      tuesdayFrom: Yup.date()
        .required(t('Please_Enter_A_Valid_Time_Validation_Msg_label'))
        .when('tuesdayCheck', {
          is: false,
          then: Yup.date().when(
            'tuesdayTo',
            (tuesdayTo, schema) =>
              tuesdayTo &&
              schema.max(
                new Date(
                  mockDate.getFullYear(),
                  mockDate.getMonth(),
                  mockDate.getDate(),
                  tuesdayTo.getHours(),
                  tuesdayTo.getMinutes() - 1,
                ),
                t('Start_Time_Must_Be_Later_Than_End_Time_Validation_Msg_label'),
              ),
          ),
        }),
      tuesdayTo: Yup.date().required(t('Please_Enter_A_Valid_Time_Validation_Msg_label')),

      wednesdayFrom: Yup.date()
        .required(t('Please_Enter_A_Valid_Time_Validation_Msg_label'))
        .when('wednesdayCheck', {
          is: false,
          then: Yup.date().when(
            'wednesdayTo',
            (wednesdayTo, schema) =>
              wednesdayTo &&
              schema.max(
                new Date(
                  mockDate.getFullYear(),
                  mockDate.getMonth(),
                  mockDate.getDate(),
                  wednesdayTo.getHours(),
                  wednesdayTo.getMinutes() - 1,
                ),
                t('Start_Time_Must_Be_Later_Than_End_Time_Validation_Msg_label'),
              ),
          ),
        }),
      wednesdayTo: Yup.date().required(t('Please_Enter_A_Valid_Time_Validation_Msg_label')),

      thursdayFrom: Yup.date()
        .required(t('Please_Enter_A_Valid_Time_Validation_Msg_label'))
        .when('thursdayCheck', {
          is: false,
          then: Yup.date().when(
            'thursdayTo',
            (thursdayTo, schema) =>
              thursdayTo &&
              schema.max(
                new Date(
                  mockDate.getFullYear(),
                  mockDate.getMonth(),
                  mockDate.getDate(),
                  thursdayTo.getHours(),
                  thursdayTo.getMinutes() - 1,
                ),
                t('Start_Time_Must_Be_Later_Than_End_Time_Validation_Msg_label'),
              ),
          ),
        }),
      thursdayTo: Yup.date().required('Please enter a valid time'),

      fridayFrom: Yup.date()
        .required(t('Please_Enter_A_Valid_Time_Validation_Msg_label'))
        .when('fridayCheck', {
          is: false,
          then: Yup.date().when(
            'fridayTo',
            (fridayTo, schema) =>
              fridayTo &&
              schema.max(
                new Date(
                  mockDate.getFullYear(),
                  mockDate.getMonth(),
                  mockDate.getDate(),
                  fridayTo.getHours(),
                  fridayTo.getMinutes() - 1,
                ),
                t('Start_Time_Must_Be_Later_Than_End_Time_Validation_Msg_label'),
              ),
          ),
        }),
      fridayTo: Yup.date().required(t('Please_Enter_A_Valid_Time_Validation_Msg_label')),

      saturdayFrom: Yup.date()
        .required(t('Please_Enter_A_Valid_Time_Validation_Msg_label'))
        .when('saturdayCheck', {
          is: false,
          then: Yup.date().when(
            'saturdayTo',
            (saturdayTo, schema) =>
              saturdayTo &&
              schema.max(
                new Date(
                  mockDate.getFullYear(),
                  mockDate.getMonth(),
                  mockDate.getDate(),
                  saturdayTo.getHours(),
                  saturdayTo.getMinutes() - 1,
                ),
                t('Start_Time_Must_Be_Later_Than_End_Time_Validation_Msg_label'),
              ),
          ),
        }),
      saturdayTo: Yup.date().required('Please enter a valid time'),

      sundayFrom: Yup.date()
        .required(t('Please_Enter_A_Valid_Time_Validation_Msg_label'))
        .when('sundayCheck', {
          is: false,
          then: Yup.date().when(
            'sundayTo',
            (sundayTo, schema) =>
              sundayTo &&
              schema.max(
                new Date(
                  mockDate.getFullYear(),
                  mockDate.getMonth(),
                  mockDate.getDate(),
                  sundayTo.getHours(),
                  sundayTo.getMinutes() - 1,
                ),
                t('Start_Time_Must_Be_Later_Than_End_Time_Validation_Msg_label'),
              ),
          ),
        }),
      sundayTo: Yup.date().required(t('Please_Enter_A_Valid_Time_Validation_Msg_label')),
    }).test('checkBoxTest', null, validationSchema => {
      if (
        validationSchema.mondayCheck &&
        validationSchema.tuesdayCheck &&
        validationSchema.wednesdayCheck &&
        validationSchema.thursdayCheck &&
        validationSchema.fridayCheck &&
        validationSchema.saturdayCheck &&
        validationSchema.sundayCheck
      ) {
        return new Yup.ValidationError(
          t('Select_At_Least_One_Working_Day_Validation_Msg_label'),
          null,
          'checkBoxTest',
        )
      }
      return true
    }),
    onSubmit: values => {
      const postData = {
        bankAccounts: [
          {
            bankAccountTypeName: 'Savings',
            bankAccountNo: values.acctNo,
            bankName: values.bankName,
            bankBranch: values.branchName,
            bankPostCode: values.postalCode,
            bankAddressLine1: values.address1,
            bankAddressLine2: values.address2,
            bankCity: values.city,
            bankCountry: values.country,
            bankAccountType: 1,
          },
          {
            bankAccountTypeName: 'Flight',
            bankAccountNo: values.flightAccNo,
            bankDesc: values.flightAccDesc,
            bankAccountType: 2,
          },
          {
            bankAccountTypeName: 'Vessel',
            bankAccountNo: values.vesselAccNo,
            bankDesc: values.vesselAccDesc,
            bankAccountType: 3,
          },
        ],

        bankNonWorkings: [
          {
            bankDay: 1,
            bankNonWorkFlag: values.sundayCheck ? 'Y' : 'N',
            bankFromTime: getHHMMFromDate(values.sundayFrom),
            bankToTime: getHHMMFromDate(values.sundayTo),
          },
          {
            bankDay: 2,
            bankNonWorkFlag: values.mondayCheck ? 'Y' : 'N',
            bankFromTime: getHHMMFromDate(values.mondayFrom),
            bankToTime: getHHMMFromDate(values.mondayTo),
          },
          {
            bankDay: 3,
            bankNonWorkFlag: values.tuesdayCheck ? 'Y' : 'N',
            bankFromTime: getHHMMFromDate(values.tuesdayFrom),
            bankToTime: getHHMMFromDate(values.tuesdayTo),
          },
          {
            bankDay: 4,
            bankNonWorkFlag: values.wednesdayCheck ? 'Y' : 'N',
            bankFromTime: getHHMMFromDate(values.wednesdayFrom),
            bankToTime: getHHMMFromDate(values.wednesdayTo),
          },
          {
            bankDay: 5,
            bankNonWorkFlag: values.thursdayCheck ? 'Y' : 'N',
            bankFromTime: getHHMMFromDate(values.thursdayFrom),
            bankToTime: getHHMMFromDate(values.thursdayTo),
          },
          {
            bankDay: 6,
            bankNonWorkFlag: values.fridayCheck ? 'Y' : 'N',
            bankFromTime: getHHMMFromDate(values.fridayFrom),
            bankToTime: getHHMMFromDate(values.fridayTo),
          },
          {
            bankDay: 7,
            bankNonWorkFlag: values.saturdayCheck ? 'Y' : 'N',
            bankFromTime: getHHMMFromDate(values.sundayFrom),
            bankToTime: getHHMMFromDate(values.sundayTo),
          },
        ],

        bankHolidays: [...bankHolidays],
      }
      setLoading(true)
      axios
        .post(process.env.REACT_APP_SERVER_URI + '/api/bac/editAcc', postData)
        .then(response => {
          showAlertSuccess(response.data.message, 'edit bank account')
          setHolidaysChanged(false)
          setLoading(false)
        })
        .catch(err => {
          if (err.response.data.error && !err.response.data.record)
            showAlertError(err.response.data.error, 'edit bank account')
          else if (err.response.data.error && err.response.data.record)
            showAlertError(err.response.data.record, 'edit bank account')
          else if (err.response.data.warning)
            showAlertWarn(err.response.data.warning, 'edit bank account')
          else showAlertError('Internal Server Error')
          setLoading(false)
        })
    },
  })

  const handleTime = (event, maxLength = 2, hourMin) => {
    const value = event.target.value.replace(regex.EXCEPT_NUMBER, '').substring(0, maxLength)

    let newDate = new Date(formik.values[event.target.name])
    if (hourMin === 'hour') {
      newDate.setHours(value)
    } else if (hourMin === 'min') {
      newDate.setMinutes(value)
    }

    formik.setFieldValue(event.target.name, newDate, true)

    formik.setSubmitting(false)
  }

  const handleNumeric = (event, maxLength = 10) => {
    formik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_NUMBER, '').substring(0, maxLength),
    )
    formik.setSubmitting(false)
  }

  const handleAlphaNumeric = (event, maxLength = 25) => {
    formik.setFieldValue(
      event.target.name,
      event.target.value.replace(regex.EXCEPT_ALPHANUMERIC, '').substring(0, maxLength),
    )
    formik.setSubmitting(false)
  }

  const handleAlpha = (event, maxLength = 25) => {
    formik.setFieldValue(event.target.name, event.target.value.substring(0, maxLength))
    formik.setSubmitting(false)
  }

  const handleCancel = () => {
    // formik.resetForm(initVal)
    formik.setSubmitting(false)
  }

  const formIsDisabled = () => {
    if (formik.isSubmitting && !bankHolidaysChanged) {
      return true
    } else if (formik.isValid && bankHolidaysChanged) {
      return false
    } else if (formik.isValid && formik.dirty) {
      return false
    } else {
      return true
    }
  }

  return (
    <div>
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div className='container bg-white'>
          <h1 className='mb-5 mt-5'>{t('Maintain_Bank_Account_label')}</h1>
          <form onSubmit={formik.handleSave}>
            <div className='row mb-4 pb-5'>
              <div className='col-12'>
                <SavingAccountNumber
                  formik={formik}
                  acctNo={formik.values.acctNo}
                  bankName={formik.values.bankName}
                  branchName={formik.values.branchName}
                  postalCode={formik.values.postalCode}
                  address1={formik.values.address1}
                  address2={formik.values.address2}
                  city={formik.values.city}
                  country={formik.values.country}
                  onChangeAN14={e => handleAlphaNumeric(e, 14)}
                  onChangeAN25={e => handleAlphaNumeric(e, 25)}
                  onChangeAlpha={e => handleAlpha(e, 25)}
                  onChangeNum={e => handleNumeric(e, 7)}
                  onBlur={formik.handleBlur}
                  disabled={formik.isSubmitting}
                />
              </div>
            </div>
            <div className='row mb-4 pb-5'>
              <div className='col-12'>
                <BankDetails
                  formik={formik}
                  onChangeHour={e => handleTime(e, 2, 'hour')}
                  onChangeMin={e => handleTime(e, 2, 'min')}
                  onBlur={formik.handleBlur}
                  mondayCheck={formik.values.mondayCheck}
                  mondayFrom={formik.values.mondayFrom}
                  mondayTo={formik.values.mondayTo}
                  tuesdayCheck={formik.values.tuesdayCheck}
                  tuesdayFrom={formik.values.tuesdayFrom}
                  tuesdayTo={formik.values.tuesdayTo}
                  wednesdayCheck={formik.values.wednesdayCheck}
                  wednesdayFrom={formik.values.wednesdayFrom}
                  wednesdayTo={formik.values.wednesdayTo}
                  thursdayCheck={formik.values.thursdayCheck}
                  thursdayFrom={formik.values.thursdayFrom}
                  thursdayTo={formik.values.thursdayTo}
                  fridayCheck={formik.values.fridayCheck}
                  fridayFrom={formik.values.fridayFrom}
                  fridayTo={formik.values.fridayTo}
                  saturdayCheck={formik.values.saturdayCheck}
                  saturdayFrom={formik.values.saturdayFrom}
                  saturdayTo={formik.values.saturdayTo}
                  sundayCheck={formik.values.sundayCheck}
                  sundayFrom={formik.values.sundayFrom}
                  sundayTo={formik.values.sundayTo}
                  disabled={formik.isSubmitting}
                />
              </div>
            </div>
          </form>
          <div className='row mb-4 pb-5'>
            <div className='col-12'>
              <BankHolidays disabled={formik.isSubmitting} />
            </div>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className='row mb-4 pb-5'>
              <div className='col-12'>
                <SecurityAccount
                  formik={formik}
                  onChangeAN14={e => handleAlphaNumeric(e, 14)}
                  onChangeAN30={e => handleAlphaNumeric(e, 30)}
                  onBlur={formik.handleBlur}
                  flightAccNo={formik.values.flightAccNo}
                  flightAccDesc={formik.values.flightAccDesc}
                  vesselAccNo={formik.values.vesselAccNo}
                  vesselAccDesc={formik.values.vesselAccDesc}
                  disabled={formik.isSubmitting}
                />
              </div>
            </div>
            <div className='row'>
              <div className='col-12 text-right mb-5'>
                <button type='submit' className='btn btn-primary mr-3' disabled={formIsDisabled()}>
                  {t('Save_label')}
                </button>

                <button type='button' onClick={handleCancel} className=' btn btn-outline-secondary'>
                  {t('Cancel_label')}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  savingsAcc: state.bankReducer.savingsAcc,
  flightAcc: state.bankReducer.flightAcc,
  vesselAcc: state.bankReducer.vesselAcc,

  bankHolidays: state.bankReducer.bankHolidays,
  bankHolidaysChanged: state.bankReducer.bankHolidaysChanged,

  mondayDetails: state.bankReducer.mondayDetails,
  tuesdayDetails: state.bankReducer.tuesdayDetails,
  wednesdayDetails: state.bankReducer.wednesdayDetails,
  thursdayDetails: state.bankReducer.thursdayDetails,
  fridayDetails: state.bankReducer.fridayDetails,
  saturdayDetails: state.bankReducer.saturdayDetails,
  sundayDetails: state.bankReducer.sundayDetails,
})

const mapDispatchToProps = dispatch => ({
  showAlertSuccess: (message, status) => dispatch(alertActions.success(message, status)),
  showAlertError: (message, status) => dispatch(alertActions.error(message, status)),
  showAlertWarn: (message, status) => dispatch(alertActions.warning(message, status)),

  setSavingsAcc: data => dispatch(setSavingsAcc(data)),
  setFlightAcc: data => dispatch(setFlightAcc(data)),
  setVesselAcc: data => dispatch(setVesselAcc(data)),
  setBankHolidays: data => dispatch(setBankHolidays(data)),
  setBankNonWorkings: data => dispatch(setBankNonWorkings(data)),
  setHolidaysChanged: data => dispatch(setHolidaysChanged(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(MaintainBankAccount)
