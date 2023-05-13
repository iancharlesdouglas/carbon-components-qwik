import { InputProps, NormalizedInputProps } from "./input-props";

/**
 * Normalizes input property values, so that disabled, invalid and warn are only set if readOnly is false, and warn only if valid
 * @param Input properties
 * @returns Normalized properties
 */
export const useNormalizedInputProps = ({id, readOnly, disabled, invalid, warn}: InputProps): NormalizedInputProps => (
  {
    disabled: !readOnly && !!disabled,
    invalid: !readOnly && !!invalid!,
    invalidId: `${id}-error-msg`,
    warn: !readOnly && !invalid && !!warn,
    warnId: `${id}-warn-msg`,
    helperId: `${id}-helper-text`
  });

