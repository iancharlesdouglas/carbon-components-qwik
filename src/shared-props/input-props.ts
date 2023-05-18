/**
 * Common input component props
 * @property {string} id - Input element ID
 * @property {boolean} readOnly - Whether the input is read-only
 * @property {boolean} disabled - Whether the input is disabled
 * @property {boolean} invalid - Whether the input is in an invalid state
 * @property {string} invalidText - Validation message to display if the input is in an invalid state
 * @property {boolean} warn - Whether the input is in a warning state
 * @property {string} warnText - Warning message to display if the input is in a warning state
 */
export type InputProps = {
  id?: string;
  readOnly?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  invalidText?: string;
  warn?: boolean;
  warnText?: string;
};

/**
 * Normalized input props
 * @property {boolean} disabled - Whether the input is disabled
 * @property {boolean} invalid - Whether the input is in an invalid state
 * @property {string} invalidId - Invalid message element ID
 * @property {boolean} warn - Whether the input is in a warning state
 * @property {string} warnId - Warning message element ID
 * @property {string} helperId - Helper text element ID
 */
export type NormalizedInputProps = {
  disabled: boolean;
  invalid: boolean;
  invalidId: string;
  warn: boolean;
  warnId: string;
  helperId: string;
};
