export const EXCEPT_ALPHA = new RegExp(/[^a-zA-Z ]/, 'g')
export const EXCEPT_NUMBER = new RegExp(/[^0-9]/, 'g')
export const EXCEPT_NUMBER_DASH = new RegExp(/[^0-9-]/, 'g')
export const DATE_TIME = new RegExp(
  /[[0-9]{4}[-]{1}[0-9]{2}[-]{1}[0-9]{2}[ ]{1}[0-9]{2}[:]{1}[0-9]{2}]/,
  'g',
)
export const EXCEPT_ALPHANUMERIC = new RegExp(/[^a-zA-Z0-9 ]/, 'g')

export const NUMBER_NO_SC = new RegExp(/^\d+$/)
export const ALPHA_NO_SC = new RegExp(/^[a-zA-Z ]+$/)
export const ALPHANUMERIC_NO_SC = new RegExp(/^[a-zA-Z0-9 ]+$/)

export const FIVE_Digit_Number = new RegExp(/\d{6}/, 'g')
export const FIVE_Length_AlphaNum = new RegExp(/\w{6}/, 'g')
export const THREE_Digit_Number = new RegExp(/\d{4}]/, 'g')
export const TWO_Digit_Number = new RegExp(/\d{3}/, 'g')
export const A11A1 = new RegExp(/^[A-Z]{1}[0-9]{2}[A-Z]{1}[0-9]{1}/)
export const AA11 = new RegExp(/^[A-Z]{2}[0-9]{2}/)
export const DATE_YYYYMMDD = new RegExp(/^\d{4}[-]{1}\d{2}[-]{1}\d{2}$/)
export const EXCEPT_ALPHA_NO_SPACE = new RegExp(/[^a-zA-Z]/, 'g')
