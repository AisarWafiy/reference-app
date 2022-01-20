import React from 'react'
import * as labels from 'constants/labels'
import { useTranslation } from 'react-i18next';

const SecurityAccount = props => {
  const { t } = useTranslation();
  const {
    formik,
    onChangeAN14,
    onChangeAN30,
    onBlur,
    flightAccNo,
    flightAccDesc,
    vesselAccNo,
    vesselAccDesc,
    disabled,
  } = props
  return (
    <React.Fragment>
      <h2 className='text-primary mb-3'>4. {t('Security_Account_label')}</h2>
      <div className='box1 ml-0 p-4'>
        <div className='row mb-4'>
          <div className='col-4'>
            <label className='form-label'>
              {t('Flight_Account_Number_label')}
              <span className='text-danger'> *</span>
            </label>
            <input
              id='flightAccNo'
              name='flightAccNo'
              type='text'
              placeholder={t('TEXT_ACC_NO_label')}
              onChange={onChangeAN14}
              onBlur={onBlur}
              value={flightAccNo}
              className='form-control'
              disabled={disabled}
            />
            {formik.touched.flightAccNo && formik.errors.flightAccNo ? (
              <span className='h5 text-danger'>{formik.errors.flightAccNo}</span>
            ) : null}
          </div>

          <div className='col-4'>
            <label className='form-label'>{t('Flight_Account_Description_label')}</label>
            <input
              id='flightAccDesc'
              name='flightAccDesc'
              type='text'
              placeholder={t('TEXT_ACC_NO_label')}
              onChange={onChangeAN30}
              onBlur={onBlur}
              value={flightAccDesc}
              className='form-control'
              disabled={disabled}
            />
            {formik.touched.flightAccDesc && formik.errors.flightAccDesc ? (
              <span className='h5 text-danger'>{formik.errors.flightAccDesc}</span>
            ) : null}
          </div>
        </div>

        <div className='row'>
          <div className='col-4'>
            <label className='form-label'>
              {t('Vessel_Account_Number_label')}
              <span className='text-danger'> *</span>
            </label>
            <input
              id='vesselAccNo'
              name='vesselAccNo'
              type='text'
              placeholder={t('TEXT_ACC_NO_label')}
              onChange={onChangeAN14}
              onBlur={onBlur}
              value={vesselAccNo}
              className='form-control'
              disabled={disabled}
            />
            {formik.touched.vesselAccNo && formik.errors.vesselAccNo ? (
              <span className='h5 text-danger'>{formik.errors.vesselAccNo}</span>
            ) : null}
          </div>

          <div className='col-4'>
            <label className='form-label'>{labels.LABEL_VESSEL_ACC_DESC}</label>
            <input
              id='vesselAccDesc'
              name='vesselAccDesc'
              type='text'
              placeholder={t('TEXT_ACC_NO_label')}
              onChange={onChangeAN30}
              onBlur={onBlur}
              value={vesselAccDesc}
              className='form-control'
              disabled={disabled}
            />
            {formik.touched.vesselAccDesc && formik.errors.vesselAccDesc ? (
              <span className='h5 text-danger'>{formik.errors.vesselAccDesc}</span>
            ) : null}
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SecurityAccount
