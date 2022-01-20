import React from 'react'
import * as labels from 'constants/labels'
import { useTranslation } from 'react-i18next';

const SavingAccountNumber = props => {
  const { t } = useTranslation();
  const {
    formik,
    onChangeAN14,
    onChangeAN25,
    onChangeAlpha,
    onChangeNum,
    onBlur,
    acctNo,
    bankName,
    branchName,
    postalCode,
    address1,
    address2,
    city,
    country,
    disabled,
  } = props
  return (
    <React.Fragment>
      <h2 className='text-primary mb-3'>1. {t('Saving_Account_Number_label')}</h2>
      <div className='box1 ml-0 p-4'>
        <div className='row'>
          <div className='col-6'>
            <label className='form-label'>
              {t('Account_Number_label')}
              <span className='text-danger'> *</span>
            </label>

            <input
              id='acctNo'
              name='acctNo'
              type='text'
              placeholder={t('TEXT_ACC_NO_label')}
              onChange={onChangeAN14}
              onBlur={onBlur}
              value={acctNo}
              className='form-control'
              disabled={disabled}
            />
            {formik.touched.acctNo && formik.errors.acctNo ? (
              <span className='h5 text-danger'>{formik.errors.acctNo}</span>
            ) : null}
          </div>
        </div>
        <div className='row mt-4'>
          <div className='col-4'>
            <label className='form-label'>{t('Bank_Name_label')}</label>

            <input
              id='bankName'
              name='bankName'
              type='text'
              placeholder={t('TEXT_BANK_NAME_label')}
              onChange={onChangeAN25}
              onBlur={onBlur}
              value={bankName}
              className='form-control'
              disabled={disabled}
            />
          </div>

          <div className='col-4'>
            <label className='form-label'>{t('Branch_label')}</label>

            <input
              id='branchName'
              name='branchName'
              type='text'
              placeholder={t('TEXT_BRANCH_label')}
              onChange={onChangeAN25}
              onBlur={onBlur}
              value={branchName}
              className='form-control'
              disabled={disabled}
            />
          </div>

          <div className='col-4'>
            <label className='form-label'>{t('Japan_Postal_Code_label')}</label>

            <input
              id='postalCode'
              name='postalCode'
              type='text'
              placeholder={t('TEXT_POSTAL_CODE_label')}
              onChange={onChangeNum}
              onBlur={onBlur}
              value={postalCode}
              className='form-control'
              disabled={disabled}
            />
          </div>
        </div>
        <div className='row mt-4'>
          <div className='col-4'>
            <label className='form-label'>
              {t('Address_Line_1_label')}
              <span className='text-danger'> *</span>
            </label>

            <input
              id='address1'
              name='address1'
              type='text'
              placeholder={t('TEXT_ADDRESS_label')}
              onChange={onChangeAlpha}
              onBlur={onBlur}
              value={address1}
              className='form-control'
              disabled={disabled}
            />
            {formik.touched.address1 && formik.errors.address1 ? (
              <span className='h5 text-danger'>{formik.errors.address1}</span>
            ) : null}
          </div>

          <div className='col-4'>
            <label className='form-label'>{t('Address_Line_2_label')}</label>

            <input
              id='address2'
              name='address2'
              type='text'
              placeholder={t('TEXT_ADDRESS_label')}
              onChange={onChangeAlpha}
              onBlur={onBlur}
              value={address2}
              className='form-control'
              disabled={disabled}
            />
          </div>
        </div>

        <div className='row mt-4'>
          <div className='col-4'>
            <label className='form-label'>
              {t('City_label')}
              <span className='text-danger'> *</span>
            </label>

            <input
              id='city'
              name='city'
              type='text'
              placeholder={t('TEXT_CITY_label')}
              onChange={onChangeAlpha}
              onBlur={onBlur}
              value={city}
              className='form-control'
              disabled={disabled}
            />
            {formik.touched.city && formik.errors.city ? (
              <span className='h5 text-danger'>{formik.errors.city}</span>
            ) : null}
          </div>

          <div className='col-4'>
            <label className='form-label'>{t('Country_label')}</label>

            <input
              id='country'
              name='country'
              type='text'
              placeholder={t('TEXT_COUNTRY_label')}
              onChange={onChangeAN25}
              onBlur={onBlur}
              value={country}
              className='form-control'
              disabled={disabled}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default SavingAccountNumber
