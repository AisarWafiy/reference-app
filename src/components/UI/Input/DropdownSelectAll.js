import React, { useRef } from 'react'
import Select from 'react-select'

const selectTheme = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary: '#3C9AFF',
    primary25: '#E4F3FF',
  },
})

const selectStylesOpen = {
  control: (styles, state) => ({
    ...styles,
    borderRadius: '0.25rem 0.25rem 0 0',
    border: state.isFocused ? '1px solid #3C9AFF' : '1px solid #e5e5e5',
    minHeight: 35,
    boxShadow: 'none',
  }),
  option: (styles, state) => ({
    ...styles,
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
  }),

  menu: (styles, state) => ({
    ...styles,
    border: 0,
    borderRadius: '0 0 0.25rem 0.25rem',
    maxHeight: '25vh',
    margin: '0',
    boxShadow: 'none',
    position: 'relative',
  }),

  menuList: (styles, state) => ({
    ...styles,
    border: state.isFocused ? '1px solid #3C9AFF' : '1px solid #e5e5e5',
    borderRadius: '0 0 0.25rem 0.25rem',
    borderTop: 'none',
    maxHeight: '25vh',
    margin: '0',
    boxShadow: 'none',
    position: 'relative',
  }),

  dropdownIndicator: (styles, state) => ({
    ...styles,
    display: 'none',
  }),

  indicatorSeparator: (styles, state) => ({
    ...styles,
    display: 'none',
  }),

  multiValue: (styles, state) => ({
    ...styles,
    borderRadius: '0.25rem',
    backgroundColor: '#E1F0FF',
    border: '1px solid #C3E1FF',
  }),
}

const selectStyles = {
  control: (styles, state) => ({
    ...styles,
    borderRadius: '0.25rem',
    border: state.isFocused ? '1px solid #3C9AFF' : '1px solid #e5e5e5',
    minHeight: 35,
    boxShadow: 'none',
  }),
  option: (styles, state) => ({
    ...styles,
    cursor: state.isDisabled ? 'not-allowed' : 'pointer',
  }),

  menu: (styles, state) => ({
    ...styles,
    border: state.isFocused ? '1px solid #3C9AFF' : '1px solid #e5e5e5',
    boxShadow: 'none',
    position: 'relative',
    margin: '0',
  }),

  menuList: (styles, state) => ({
    ...styles,
    boxShadow: 'none',
    position: 'relative',
    margin: '0',
  }),

  multiValue: (styles, state) => ({
    ...styles,
    borderRadius: '0.25rem',
    backgroundColor: '#E1F0FF',
    border: '1px solid #C3E1FF',
  }),
}

const MultiSelect = props => {
  // isOptionSelected sees previous props.value after onChange
  const valueRef = useRef(props.value)
  valueRef.current = props.value

  const selectAllOption = {
    [props.optionValue]: '<SELECT_ALL>',
    [props.optionLabel]: props.selectAllText,
  }

  const isSelectAllSelected = () =>
    props.value ? valueRef.current.length === props.options.length : null

  //   const isOptionSelected = option =>
  //     valueRef.current.some(({ value }) => value === option[props.optionValue]) ||
  //     isSelectAllSelected()

  const getOptions = () => [selectAllOption, ...props.options]

  const getValue = () => (isSelectAllSelected() ? [selectAllOption] : props.value)

  const onChange = (newValue, actionMeta) => {
    const { action, option, removedValue } = actionMeta
    // console.log(actionMeta)
    if (
      action === 'select-option' &&
      option[props.optionValue] === selectAllOption[props.optionValue]
    ) {
      props.onChange(props.options, actionMeta)
    } else if (
      (action === 'deselect-option' &&
        option[props.optionValue] === selectAllOption[props.optionValue]) ||
      (action === 'remove-value' &&
        removedValue[props.optionValue] === selectAllOption[props.optionValue])
    ) {
      props.onChange([], actionMeta)
    } else if (actionMeta.action === 'select-option' && isSelectAllSelected()) {
      props.onChange(
        props.options.filter(({ value }) => value !== option[props.optionValue]),
        actionMeta,
      )
    } else {
      props.onChange(newValue || [], actionMeta)
    }
  }

  return (
    <Select
      {...props}
      options={getOptions()}
      value={getValue()}
      onChange={onChange}
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      theme={selectTheme}
      styles={props.menuIsOpen ? selectStylesOpen : selectStyles}
      getOptionLabel={option => option[props.optionLabel]}
      getOptionValue={option => option[props.optionValue]}
      //   isOptionSelected={isOptionSelected}
    />
  )
}

export default MultiSelect
