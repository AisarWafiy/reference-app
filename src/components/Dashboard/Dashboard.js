import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { months, calcDate } from 'constants/dateTime'
import { dataFromTypes } from 'constants/types'
import { setDataFrom } from 'actions/action-dashboard'
import { alertActions } from 'actions/alert.actions'
import { useDispatch } from 'react-redux'
import Loader from 'react-loader-spinner'
import FlightsPanel from 'components/Dashboard/FlightsPanel/FlightsPanel'
import FlightsGrid from 'components/Dashboard/FlightsGrid/FlightsGrid'
import { setDashBoardData } from 'actions/action-dashboard'

const Dashboard = props => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const { dataFrom, setDataFrom } = props

  const [date, setDate] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    const today = calcDate()
    setDate(today.getDate() + ' ' + months[today.getMonth()] + ', ' + today.getFullYear())
  }, [])

  const handleToggle = event => {
    setDataFrom(event.target.value)
  }

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_SERVER_URI + 'api/dashBoard/getDashBoard')
      .then(response => {
        const getData = response.data.result
        dispatch(setDashBoardData(getData))
        dispatch(alertActions.success(response.data.message, 'Dashboard'))
        setLoading(false)
      })
      .catch(err => {
        dispatch(setDashBoardData({}))
        if (err.response.data.error && !err.response.data.record)
          dispatch(alertActions.error(err.response.data.error, 'fetching dashboard details'))
        else if (err.response.data.error && err.response.data.record)
          dispatch(alertActions.error(err.response.data.record, 'fetching dashboard details'))
        else if (err.response.data.warning)
          dispatch(alertActions.warning(err.response.data.warning, 'fetching dashboard details'))
        else dispatch(alertActions.error('Internal Server Error'))
        // dispatch(alertActions.error(err.response.data?.errors, 'fetching dashboard details'))
        setLoading(false)
      })
  }, [])

  return (
    <div>
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div className='container'>
          <div className='mt-3 row'>
            <div className='col-3 border-right'>
              <div>
                <h3>{t('TEXT_VIEW_DATA_FROM_label')}</h3>
                <div className='mt-2 row '>
                  <div className='col-12'>
                    {/* <div className='custom-control custom-radio custom-control-inline'>
                  <input
                    type='radio'
                    value={dataFromTypes[0]}
                    id='customRadio1'
                    name='locationType'
                    className='custom-control-input'
                    onChange={handleToggle}
                    checked={dataFrom === dataFromTypes[0]}
                  />
                  <label className='custom-control-label radio-inline' htmlFor='customRadio1'>
                    {dataFromTypes[0]}
                  </label>
                </div> */}
                    <div className='custom-control custom-radio custom-control-inline'>
                      <input
                        type='radio'
                        value={dataFromTypes[1]}
                        id='customRadio2'
                        name='locationType'
                        className='custom-control-input'
                        onChange={handleToggle}
                        checked={dataFrom === dataFromTypes[1]}
                      />

                      <label className='custom-control-label radio-inline' htmlFor='customRadio2'>
                        {dataFromTypes[1]}
                      </label>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>

            <div className='col-6 border-right'>
              <FlightsPanel />
            </div>
            <div className='col-2 text-center '>
              <h2 className='mt-2'>{date}</h2>
            </div>
          </div>
          <hr />
          <div className='mt-2 row'>
            <div className='col-12' style={{ height: 'fit-content' }}>
              <FlightsGrid />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const mapStateToProps = state => ({
  dataFrom: state.dashboardReducer.dataFrom,
})

const mapDispatchToProps = dispatch => ({
  setDataFrom: data => dispatch(setDataFrom(data)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
