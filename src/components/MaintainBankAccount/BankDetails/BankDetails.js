import React from 'react'
import * as labels from 'constants/labels'
import { mockDate } from 'constants/dateTime'
import { useTranslation } from 'react-i18next';

const BankDetails = ({
  formik,
  onChangeHour,
  onChangeMin,
  onBlur,
  disabled,
  mondayFrom = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  mondayTo = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  mondayCheck,

  tuesdayFrom = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  tuesdayTo = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  tuesdayCheck,

  wednesdayFrom = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  wednesdayTo = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  wednesdayCheck,

  thursdayFrom = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  thursdayTo = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  thursdayCheck,

  fridayFrom = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  fridayTo = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  fridayCheck,

  saturdayFrom = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  saturdayTo = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  saturdayCheck,

  sundayFrom = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  sundayTo = new Date(mockDate.getFullYear(), mockDate.getMonth(), mockDate.getDate(), 0, 0),
  sundayCheck,
}) => {
  // const showError = (fromTouched, fromErrors, toTouched, toErrors) => {
  //   if()
  //   {fromTouched && fromErrors ? (
  //     <span className='h5 text-danger'>{fromErrors}</span>
  //   ) : null}
  //   {formik.touched.mondayTo && formik.errors.mondayTo ? (
  //     <span className='h5 text-danger'>{formik.errors.mondayTo}</span>
  //   ) : null}

  //   return
  // }
  const { t } = useTranslation();

  return (
    <React.Fragment>
      <h2 className='text-primary mb-3 font-weight-bold'>2. {t('Bank_Details_label')}</h2>
      <div className='box1 ml-0 p-4'>
        <div className='row mb-3'>
          <div className='col-12'>
            <ul className='list-group '>
              <li className='list-group-item border-0'>
                <div className='row'>
                  <div className='col-2 font-weight-bold h3'>{t('DAYS_label')}</div>
                  <div className='col-2 font-weight-bold h3'>{t('Non_Working_label')}</div>
                  <div className='col-4 font-weight-bold h3'>{t('Working_Hours_(Start)_label')}</div>
                  <div className='col-4 font-weight-bold h3'>{t('Working_Hours_(End)_label')}</div>
                </div>
              </li>

              <li className='list-group-item border-0 pt-0 pb-0'>
                <div className='row mt-0 mb-0'>
                  <div className='col-2'></div>
                  <div className='col-2'></div>
                  <div className='col-2 h6'>{t('Hours_label')}</div>
                  <div className='col-2 h6'>{t('Minutes_label')}</div>
                  <div className='col-2 h6'>{t('Hours_label')}</div>
                  <div className='col-2 h6'>{t('Minutes_label')}</div>
                </div>
              </li>

              <li className='list-group-item bg-light border-0'>
                <div className='row'>
                  <div className='col-2 h5'>{t('Monday_label')}</div>
                  <div className='col-2'>
                    <div className='form-group'>
                      <div className='custom-control custom-checkbox'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          id='mondayCheck'
                          name='mondayCheck'
                          checked={mondayCheck}
                          onChange={event =>
                            formik.setFieldValue('mondayCheck', event.target.checked)
                          }
                          onBlur={onBlur}
                          disabled={disabled}
                        />
                        <label className='custom-control-label' htmlFor='mondayCheck' />
                      </div>
                    </div>
                  </div>
                  <div className='col-2'>
                    <input
                      id='mondayFrom'
                      name='mondayFrom'
                      type='number'
                      className='form-control'
                      placeholder='00'
                      value={mondayFrom.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='mondayFrom'
                      name='mondayFrom'
                      type='number'
                      className='form-control'
                      placeholder='00'
                      value={mondayFrom.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='mondayTo'
                      name='mondayTo'
                      type='number'
                      className='form-control'
                      placeholder='00'
                      value={mondayTo.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='mondayTo'
                      name='mondayTo'
                      type='number'
                      className='form-control'
                      placeholder='00'
                      value={mondayTo.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                </div>
                {(formik.touched.mondayFrom || formik.touched.mondayTo) &&
                formik.errors.mondayFrom ? (
                  <span className='h5 text-danger'>{formik.errors.mondayFrom}</span>
                ) : null}
              </li>

              <li className='list-group-item border-0'>
                <div className='row'>
                  <div className='col-2 h5'>{t('Tuesday_label')}</div>
                  <div className='col-2'>
                    <div className='form-group'>
                      <div className='custom-control custom-checkbox'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          id='tuesdayCheck'
                          name='tuesdayCheck'
                          checked={tuesdayCheck}
                          onChange={event =>
                            formik.setFieldValue('tuesdayCheck', event.target.checked)
                          }
                          onBlur={onBlur}
                          disabled={disabled}
                        />
                        <label className='custom-control-label' htmlFor='tuesdayCheck' />
                      </div>
                    </div>
                  </div>
                  <div className='col-2'>
                    <input
                      id='tuesdayFrom'
                      name='tuesdayFrom'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={tuesdayFrom.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='tuesdayFrom'
                      name='tuesdayFrom'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={tuesdayFrom.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='tuesdayTo'
                      name='tuesdayTo'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={tuesdayTo.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='tuesdayTo'
                      name='tuesdayTo'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={tuesdayTo.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                </div>
                {(formik.touched.tuesdayTo || formik.touched.tuesdayFrom) &&
                formik.errors.tuesdayFrom ? (
                  <span className='h5 text-danger'>{formik.errors.tuesdayFrom}</span>
                ) : null}
              </li>

              <li className='list-group-item bg-light border-0'>
                <div className='row'>
                  <div className='col-2 h5'>{t('Wednesday_label')}</div>
                  <div className='col-2'>
                    <div className='form-group'>
                      <div className='custom-control custom-checkbox'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          id='wednesdayCheck'
                          name='wednesdayCheck'
                          checked={wednesdayCheck}
                          onChange={event =>
                            formik.setFieldValue('wednesdayCheck', event.target.checked)
                          }
                          onBlur={onBlur}
                          disabled={disabled}
                        />
                        <label className='custom-control-label' htmlFor='wednesdayCheck' />
                      </div>
                    </div>
                  </div>
                  <div className='col-2'>
                    <input
                      id='wednesdayFrom'
                      name='wednesdayFrom'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={wednesdayFrom.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='wednesdayFrom'
                      name='wednesdayFrom'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={wednesdayFrom.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='wednesdayTo'
                      name='wednesdayTo'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={wednesdayTo.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='wednesdayTo'
                      name='wednesdayTo'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={wednesdayTo.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                </div>
                {(formik.touched.wednesdayTo || formik.touched.wednesdayFrom) &&
                formik.errors.wednesdayFrom ? (
                  <span className='h5 text-danger'>{formik.errors.wednesdayFrom}</span>
                ) : null}
              </li>

              <li className='list-group-item border-0'>
                <div className='row'>
                  <div className='col-2 h5'>{t('Thursday_label')}</div>
                  <div className='col-2'>
                    <div className='form-group'>
                      <div className='custom-control custom-checkbox'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          id='thursdayCheck'
                          name='thursdayCheck'
                          checked={thursdayCheck}
                          onChange={event =>
                            formik.setFieldValue('thursdayCheck', event.target.checked)
                          }
                          onBlur={onBlur}
                          disabled={disabled}
                        />
                        <label className='custom-control-label' htmlFor='thursdayCheck' />
                      </div>
                    </div>
                  </div>
                  <div className='col-2'>
                    <input
                      id='thursdayFrom'
                      name='thursdayFrom'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={thursdayFrom.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='thursdayFrom'
                      name='thursdayFrom'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={thursdayFrom.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='thursdayTo'
                      name='thursdayTo'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={thursdayTo.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='thursdayTo'
                      name='thursdayTo'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={thursdayTo.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                </div>
                {(formik.touched.thursdayTo || formik.touched.thursdayFrom) &&
                formik.errors.thursdayFrom ? (
                  <span className='h5 text-danger'>{formik.errors.thursdayFrom}</span>
                ) : null}
              </li>

              <li className='list-group-item bg-light border-0'>
                <div className='row'>
                  <div className='col-2 h5'>{t('Friday_label')}</div>
                  <div className='col-2'>
                    <div className='form-group'>
                      <div className='custom-control custom-checkbox'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          id='fridayCheck'
                          name='fridayCheck'
                          checked={fridayCheck}
                          onChange={event =>
                            formik.setFieldValue('fridayCheck', event.target.checked)
                          }
                          onBlur={onBlur}
                          disabled={disabled}
                        />
                        <label className='custom-control-label' htmlFor='fridayCheck' />
                      </div>
                    </div>
                  </div>
                  <div className='col-2'>
                    <input
                      id='fridayFrom'
                      name='fridayFrom'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={fridayFrom.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='fridayFrom'
                      name='fridayFrom'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={fridayFrom.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='fridayTo'
                      name='fridayTo'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={fridayTo.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='fridayTo'
                      name='fridayTo'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={fridayTo.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                </div>
                {(formik.touched.fridayTo || formik.touched.fridayFrom) &&
                formik.errors.fridayFrom ? (
                  <span className='h5 text-danger'>{formik.errors.fridayFrom}</span>
                ) : null}
              </li>

              <li className='list-group-item border-0'>
                <div className='row'>
                  <div className='col-2 h5'>{t('Saturday_label')}</div>
                  <div className='col-2'>
                    <div className='form-group'>
                      <div className='custom-control custom-checkbox'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          id='saturdayCheck'
                          name='saturdayCheck'
                          checked={saturdayCheck}
                          onChange={event =>
                            formik.setFieldValue('saturdayCheck', event.target.checked)
                          }
                          onBlur={onBlur}
                          disabled={disabled}
                        />
                        <label className='custom-control-label' htmlFor='saturdayCheck' />
                      </div>
                    </div>
                  </div>
                  <div className='col-2'>
                    <input
                      id='saturdayFrom'
                      name='saturdayFrom'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={saturdayFrom.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='saturdayFrom'
                      name='saturdayFrom'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={saturdayFrom.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='saturdayTo'
                      name='saturdayTo'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={saturdayTo.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='saturdayTo'
                      name='saturdayTo'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={saturdayTo.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                </div>
                {(formik.touched.saturdayTo || formik.touched.saturdayFrom) &&
                formik.errors.saturdayFrom ? (
                  <span className='h5 text-danger'>{formik.errors.saturdayFrom}</span>
                ) : null}
              </li>

              <li className='list-group-item bg-light border-0'>
                <div className='row'>
                  <div className='col-2 h5'>{t('Sunday_label')}</div>
                  <div className='col-2'>
                    <div className='form-group'>
                      <div className='custom-control custom-checkbox'>
                        <input
                          type='checkbox'
                          className='custom-control-input'
                          id='sundayCheck'
                          name='sundayCheck'
                          checked={sundayCheck}
                          onChange={event =>
                            formik.setFieldValue('sundayCheck', event.target.checked)
                          }
                          onBlur={onBlur}
                          disabled={disabled}
                        />
                        <label className='custom-control-label' htmlFor='sundayCheck' />
                      </div>
                    </div>
                  </div>
                  <div className='col-2'>
                    <input
                      id='sundayFrom'
                      name='sundayFrom'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={sundayFrom.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='sundayFrom'
                      name='sundayFrom'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={sundayFrom.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='sundayTo'
                      name='sundayTo'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={sundayTo.getHours()}
                      onChange={onChangeHour}
                      onBlur={onBlur}
                      min={0}
                      max={23}
                      disabled={disabled}
                    />
                  </div>
                  <div className='col-2'>
                    <input
                      id='sundayTo'
                      name='sundayTo'
                      type='number'
                      className='form-control'
                      placeholder={t('00_label')}
                      value={sundayTo.getMinutes()}
                      onChange={onChangeMin}
                      onBlur={onBlur}
                      min={0}
                      max={59}
                      disabled={disabled}
                    />
                  </div>
                </div>
                {(formik.touched.sundayTo || formik.touched.sundayFrom) &&
                formik.errors.sundayFrom ? (
                  <span className='h5 text-danger'>{formik.errors.sundayFrom}</span>
                ) : null}
              </li>
            </ul>
          </div>
        </div>
        {formik.errors.checkBoxTest ? (
          <span className='h5 text-danger'>{formik.errors.checkBoxTest}</span>
        ) : null}
      </div>
    </React.Fragment>
  )
}

export default BankDetails
