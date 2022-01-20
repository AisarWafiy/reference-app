import React from 'react'
import Select from 'react-select'

const DropdownInput = ({
  isMulti = false,
  closeMenuOnSelect = false,
  hideSelectedOptions = false,
  name,
  id,
  value,
  options,
  onChange,
  onBlur,
  placeholder,
  optionLabel,
  optionValue,
  isDisabled = false,
  isClearable = false,
}) => {
  const selectTheme = theme => ({
    ...theme,
    colors: {
      ...theme.colors,
      primary: '#3C9AFF',
      primary25: '#E4F3FF',
    },
  })

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

    multiValue: (styles, state) => ({
      ...styles,
      borderRadius: '0.25rem',
      backgroundColor: '#E1F0FF',
      border: '1px solid #C3E1FF',
    }),

    menu: (styles, state) => ({
      ...styles,
      border: state.isFocused ? '1px solid #3C9AFF' : '1px solid #e5e5e5',
      boxShadow: 'none',
      margin: '0',
      zIndex: '999',
    }),

    menuList: (styles, state) => ({
      ...styles,

      margin: '0',
      boxShadow: 'none',
      zIndex: '999',
    }),
  }

  return (
    <Select
      isMulti={isMulti}
      closeMenuOnSelect={closeMenuOnSelect}
      hideSelectedOptions={hideSelectedOptions}
      name={name}
      id={id}
      value={value}
      options={options}
      getOptionLabel={option => option[optionLabel]}
      getOptionValue={option => option[optionValue]}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      theme={selectTheme}
      styles={selectStyles}
      isDisabled={isDisabled}
      isClearable={isClearable}
    />
  )
}

export default DropdownInput
