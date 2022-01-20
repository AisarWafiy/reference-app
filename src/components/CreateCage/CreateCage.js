import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Row, Col } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { useTranslation } from 'react-i18next'
import Loader from 'react-loader-spinner'
import { cageActions } from 'actions/cage.actions'
import { EXCEPT_ALPHANUMERIC, EXCEPT_NUMBER } from 'constants/regex'

function createCage(props) {
  const [loading, setLoading] = useState(false)
  const [cageError, setCageError] = useState('')
  const [disable, setDisable] = useState(false)
  const [save, setSave] = useState(false)
  const [cageNumber, setCageNumber] = useState('')
  const [cartons, setCartons] = useState('')
  const [remark, setRemark] = useState('')
  const [description, setDescription] = useState('')
  const { t } = useTranslation()
  const onChangeCageNumber = object => {
    const { value } = object.target
    const maxLength = 3

    setCageNumber(value.replace(EXCEPT_NUMBER, '').substring(0, maxLength))
    // for showing the email confirmation text
  }
  const onChangeCartons = object => {
    const { value } = object.target
    const maxLength = 3

    setCartons(value.replace(EXCEPT_NUMBER, '').substring(0, maxLength))
    // for showing the email confirmation text
  }
  const onChangeRemark = object => {
    const { value } = object.target

    setRemark(value.replace(EXCEPT_ALPHANUMERIC, ''))

    // for showing the email confirmation text
  }
  const onChangeDescription = object => {
    const { value } = object.target

    setDescription(value.replace(EXCEPT_ALPHANUMERIC, ''))
    // for showing the email confirmation text
  }

  const handleSave = () => {
    let data = {}
    data.cageNumber = cageNumber
    data.maxNumCartons = cartons
    data.cageRemarks = remark
    data.cageDesc = description

    props.newCage(data)
    setSave(true)
    setDisable(true)
    setLoading(true)
  }

  useEffect(() => {
    if (cageNumber.length < 3 && cageNumber !== '') {
      setCageError(t('Cage_Number_should_be_3_character_long_label'))
    } else {
      setCageError('')
    }
  }, [cageNumber])
  useEffect(() => {
    if (props.getStatus && props.getStatus.result) {
      setLoading(false)
    } else if (props.getStatus && !props.getStatus.result) {
      setLoading(false)
    }
  }, [props.getStatus])

  const onCancel = () => {
    window.location.reload()
  }

  useEffect(() => {
    if (
      cageNumber === '' ||
      cartons === '' ||
      cageNumber < 1 ||
      cageNumber > 999 ||
      cageError !== ''
    ) {
      setDisable(true)
    } else {
      setDisable(false)
    }
  }, [cageNumber, description, remark, cartons, cageError])

  return (
    <div>
      {loading === true ? (
        <div style={{ textAlign: 'center' }} className='mt-5'>
          <Loader type='ThreeDots' color='#bf2e1a' height={60} visible={loading} width={60} />
        </div>
      ) : (
        <div className='container bg-white'>
          <div>
            <h1 className='mb-4 mt-5'>{t('Create_Cage_label')}</h1>
          </div>
          <div>
            <Row>
              <Col xs='4'>
                <label className='form-label'>{t('Cage_Number_label')}</label>
                <span className='astrick'>*</span>
                <br />

                <input
                  name='cageNumber'
                  value={cageNumber}
                  autoComplete='off'
                  type='text'
                  onChange={onChangeCageNumber}
                  disabled={save}
                  placeholder={t('Cage_Number_label')}
                  className='form-control'
                ></input>
                {cageError !== '' ? (
                  <span className='form-label' style={{ color: '#B13C27' }}>
                    {cageError}
                  </span>
                ) : null}
              </Col>
              <Col xs='4'>
                <label className='form-label'>{t('Maximum_no._of_Cartons_per_Cage_label')}</label>
                <span className='astrick'>*</span>
                <br />
                <input
                  type='text'
                  autoComplete='off'
                  name='cartons'
                  disabled={save}
                  value={cartons}
                  onChange={onChangeCartons}
                  placeholder={t('Cartons_label')}
                  className='form-control'
                ></input>
              </Col>
            </Row>
            <Row className='mt-4'>
              <Col xs='8'>
                <label className='form-label'>{t('Remarks_label')}</label>
                <br />{' '}
                <input
                  type='text'
                  disabled={save}
                  autoComplete='off'
                  onChange={onChangeRemark}
                  name='Remarks'
                  value={remark}
                  maxLength={25}
                  placeholder={t('Remarks_label')}
                  className='form-control'
                ></input>
                {remark !== '' ? (
                  <span className='form-label' style={{ color: '#B13C27' }}>
                    Maximum length 25
                  </span>
                ) : null}
              </Col>{' '}
            </Row>
            <Row className='mt-4'>
              <Col xs='8'>
                <label className='form-label'>{t('Description_label')}</label>
                <br />{' '}
                <input
                  type='text'
                  name='description'
                  disabled={save}
                  autoComplete='off'
                  onChange={onChangeDescription}
                  value={description}
                  maxLength={25}
                  placeholder={t('Description_label')}
                  className='form-control'
                ></input>
                {description !== '' ? (
                  <span className='form-label' style={{ color: '#B13C27' }}>
                    Maximum length 25
                  </span>
                ) : null}
              </Col>{' '}
            </Row>
          </div>
          <div className='mt-5 row'>
            <div className='mt-5 col-8 text-right'>
              <button
                type='button'
                className='btn btn-primary mr-3'
                onClick={handleSave}
                disabled={disable || save}
              >
                {t('Save_label')}
              </button>

              <button type='button' onClick={onCancel} className=' btn btn-outline-secondary'>
                {t('Cancel_label')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function mapState(state) {
  return {
    getStatus: state.postCage.getData,
  }
}

const actionCreators = {
  newCage: cageActions.postCage,
}

export default connect(mapState, actionCreators)(createCage)
