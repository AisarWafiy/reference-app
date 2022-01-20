import React, { useState } from 'react'

import AsyncSelect from 'react-select/async'

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

const SearchDropdown = props => {
  const { searchOptions, disabled, searchValue, setSearchValue } = props

  const [inputValue, setInputValue] = useState('')

  const filterOptions = inputValue => {
    return searchOptions.filter(i => i.label.toLowerCase().includes(inputValue.toLowerCase()))
  }

  const loadOptions = (inputValue, callback) => {
    setTimeout(() => {
      callback(filterOptions(inputValue))
    }, 500)
  }

  const handleInputChange = newValue => {
    const value = newValue.replace(/\W/g, '')
    setInputValue({ value })
    return value
  }

  const handleSelect = selectedValue => {
    setSearchValue(selectedValue)
  }

  return (
    <AsyncSelect
      value={searchValue}
      cacheOptions
      loadOptions={loadOptions}
      defaultOptions={searchOptions}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      theme={selectTheme}
      styles={selectStyles}
      placeholder='Search'
      isClearable
      isDisabled={disabled}
    />
  )
}

export default SearchDropdown
