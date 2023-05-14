import { InputProps, NormalizedInputProps } from './input-props';

/**
 * Normalizes input property values, so that disabled, invalid and warn are only set if readOnly is false, and warn only if valid
 * @param {InputProps} Input properties
 * @param {string} Input.id Component DOM element ID
 * @param {boolean} Input.readOnly Component is read-only
 * @param {boolean} Input.disabled Component is disabled
 * @param {boolean} Input.invalid Component is invalid
 * @param {boolean} Input.warn Component is in warning state
 * @returns {NormalizedInputProps} Normalized properties
 */
export const useNormalizedInputProps = ({ id, readOnly, disabled, invalid, warn }: InputProps): NormalizedInputProps => ({
  disabled: !readOnly && !!disabled,
  invalid: !readOnly && !!invalid!,
  invalidId: `${id}-error-msg`,
  warn: !readOnly && !invalid && !!warn,
  warnId: `${id}-warn-msg`,
  helperId: `${id}-helper-text`,
});
