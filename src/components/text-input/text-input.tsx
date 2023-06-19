import { $, PropFunction, QwikChangeEvent, QwikMouseEvent, component$, useSignal, QwikIntrinsicElements, useContext, Component } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { useNormalizedInputProps } from '../../internal/hooks/use-normalized-input-props';
import classNames from 'classnames';
import _ from 'lodash';
import { formContext } from '../../internal/contexts/form-context';
import { IconProps, WarningAltFilled, WarningFilled } from 'carbon-icons-qwik';
import { uniqueId } from '../../internal/unique/unique-id';

/**
 * Text input component size
 */
export type TextInputSize = 'sm' | 'md' | 'lg';

/**
 * Text input component props
 * @property {string} class - Custom CSS class name
 * @property {boolean} disabled - Whether component is disabled
 * @property {string} helperText - Helper text to display beneath component
 * @property {boolean} hideLabel - Whether to hide the label
 * @property {boolean} inline - Whether to render the component with an inline label
 * @property {boolean} invalid - Whether the component is in an invalid state
 * @property {string} invalidText - Invalid message text to display beneath component
 * @property {string} labelText = Label text
 * @property {boolean} readOnly - Whether the component should be rendered as read-only (as opposed to disabled)
 * @property {TextInputSize} renderSize - Render size of the component
 * @property {string} type - Input type
 * @property {boolean} warn - Whether the component is in warning state
 * @property {string} warnText - Warning message text to display beneath component
 * @property {boolean} enableCounter - Whether to render a character length counter horizontally opposite the label
 * @property {number} maxCount - Max. length to render along with the counter if enableCounter is true
 * @property {string} value - Text input box value
 * @property {string} defaultValue - Default value
 * @property {PropFunction} onChange$ - onChange event callback
 * @property {PropFunction} onClick$ - onClick event callback
 */
export type TextInputProps = QwikIntrinsicElements['input'] & {
  class?: string;
  disabled?: boolean;
  helperText?: string;
  hideLabel?: boolean;
  inline?: boolean;
  invalid?: boolean;
  invalidText?: string;
  labelText?: string;
  readOnly?: boolean;
  renderSize?: TextInputSize;
  type?: string;
  warn?: boolean;
  warnText?: string;
  enableCounter?: boolean;
  maxCount?: number;
  value?: string;
  defaultValue?: string;
  onChange$?: PropFunction<(event: TextInputChangeEvent, element: HTMLInputElement) => void>;
  onClick$?: PropFunction<(event: QwikMouseEvent<HTMLInputElement, MouseEvent>, element: HTMLInputElement) => void>;
};

/**
 * Text input component change event
 * @property {string} value Value
 */
export type TextInputChangeEvent = {
  value: string;
};

/**
 * Text input component
 */
export const TextInput = component$((props: TextInputProps) => {
  const {
    class: className,
    disabled = false,
    helperText,
    hideLabel,
    id = `text-input-${uniqueId()}`,
    inline = false,
    invalid = false,
    invalidText,
    labelText,
    placeholder,
    readOnly,
    renderSize = 'md',
    type = 'text',
    warn = false,
    warnText,
    enableCounter = false,
    maxCount,
    value,
    defaultValue,
  } = props;
  const prefix = usePrefix();
  const textCount = useSignal(defaultValue?.length || value?.length || 0);
  const normalizedProps = useNormalizedInputProps({
    id,
    readOnly,
    disabled,
    invalid,
    invalidText,
    warn,
    warnText,
  });

  const classes = classNames(
    `${prefix}--text-input`,
    className,
    { [`${prefix}--text-input--invalid`]: normalizedProps.invalid },
    { [`${prefix}--text-input--warning`]: normalizedProps.warn },
    `${prefix}--text-input--${renderSize}`
  );

  const maxLength = enableCounter ? maxCount : undefined;

  const sharedTextInputProps = {
    id,
    onChange$: $((event: QwikChangeEvent<HTMLInputElement>, element: HTMLInputElement) => {
      if (!normalizedProps.disabled) {
        textCount.value = event.target.value?.length;
        props.onChange$ && props.onChange$({ value: event.target.value }, element);
      }
    }),
    onInput$: $((event: Event, element: HTMLInputElement) => {
      if (!normalizedProps.disabled) {
        const value = (event.target as HTMLInputElement).value;
        textCount.value = value?.length;
        props.onChange$ && props.onChange$({ value }, element);
      }
    }),
    onClick$: $((event: QwikMouseEvent<HTMLInputElement, MouseEvent>, element: HTMLInputElement) => {
      if (!normalizedProps.disabled && props.onClick$) {
        props.onClick$!(event, element);
      }
    }),
    placeholder,
    type,
    title: placeholder,
    disabled: normalizedProps.disabled,
    readOnly: !!readOnly,
    ['aria-describedby']: helperText && normalizedProps.helperId,
    value,
    maxLength,
  };

  const invalidProps = {
    invalid: normalizedProps.invalid,
    invalidId: normalizedProps.invalidId,
    'data-invalid': normalizedProps.invalid,
    'aria-invalid': normalizedProps.invalid,
    'aria-describedby': normalizedProps.invalidId,
  };

  const warnProps = {
    warn: normalizedProps.warn,
    warnId: normalizedProps.warnId,
    'aria-describedby': normalizedProps.warnId,
  };

  const invalidOrWarnProps = normalizedProps.invalid ? invalidProps : warnProps;

  const inputWrapperClasses = classNames(`${prefix}--form-item`, `${prefix}--text-input-wrapper`, {
    [`${prefix}--text-input-wrapper--readonly`]: readOnly,
    [`${prefix}--text-input-wrapper--inline`]: inline,
    [`${prefix}--text-input-wrapper--inline--invalid`]: inline && normalizedProps.invalid,
  });

  const labelClasses = classNames(`${prefix}--label`, {
    [`${prefix}--visually-hidden`]: hideLabel,
    [`${prefix}--label--disabled`]: normalizedProps.disabled,
    [`${prefix}--label--inline`]: inline,
    [`${prefix}--label--inline--${renderSize}`]: inline && !!renderSize,
  });

  const helperTextClasses = classNames(`${prefix}--form__helper-text`, {
    [`${prefix}--form__helper-text--disabled`]: normalizedProps.disabled,
    [`${prefix}--form__helper-text--inline`]: inline,
  });

  const fieldOuterWrapperClasses = classNames(`${prefix}--text-input__field-outer-wrapper`, {
    [`${prefix}--text-input__field-outer-wrapper--inline`]: inline,
  });

  const fieldWrapperClasses = classNames(`${prefix}--text-input__field-wrapper`, {
    [`${prefix}--text-input__field-wrapper--warning`]: normalizedProps.warn,
  });

  const iconClasses = classNames({
    [`${prefix}--text-input__invalid-icon`]: normalizedProps.invalid || normalizedProps.warn,
    [`${prefix}--text-input__invalid-icon--warning`]: normalizedProps.warn,
  });

  const counterClasses = classNames(`${prefix}--label`, {
    [`${prefix}--label--disabled`]: disabled,
    [`${prefix}--text-input__label-counter`]: true,
  });

  const LabelWrapper = component$(() => (
    <div class={`${prefix}--text-input__label-wrapper`}>
      <label for={id} class={labelClasses}>
        {labelText}
      </label>
      {enableCounter && maxCount ? <div class={counterClasses}>{`${textCount.value}/${maxCount}`}</div> : null}
    </div>
  ));

  const HelperText = component$(() =>
    helperText ? (
      <div id={normalizedProps.helperId} class={helperTextClasses}>
        {helperText}
      </div>
    ) : null
  );

  const ValidationMessage = component$(() => (
    <div class={`${prefix}--form-requirement`} id={normalizedProps.invalid ? normalizedProps.invalidId : normalizedProps.warnId}>
      {normalizedProps.invalid ? invalidText : warnText}
    </div>
  ));

  const { isFluid } = useContext(formContext);

  let hint: { Icon: Component<IconProps> } | undefined = undefined;
  let renderIcon = false;
  if (normalizedProps.invalid) {
    hint = { Icon: WarningFilled };
    renderIcon = true;
  } else {
    hint = { Icon: WarningAltFilled };
    renderIcon = true;
  }

  const sanitizedProps = _.omit(
    props,
    'renderSize',
    'labelText',
    'hideLabel',
    'helperText',
    'inline',
    'invalid',
    'invalidText',
    'warn',
    'warnText',
    'enableCounter',
    'maxCount'
  );

  const sanitizedInvalidOrWarnProps = _.omit(invalidOrWarnProps, 'invalid', 'warn', 'invalidId', 'warnId');

  return (
    <div class={inputWrapperClasses}>
      {!inline ? (
        <LabelWrapper />
      ) : (
        <div class={`${prefix}--text-input__label-helper-wrapper`}>
          <LabelWrapper />
          {!isFluid && (normalizedProps.invalid || normalizedProps.warn) && <ValidationMessage />}
          {!isFluid && !normalizedProps.invalid && !normalizedProps.warn && <HelperText />}
        </div>
      )}
      <div class={fieldOuterWrapperClasses}>
        <div class={fieldWrapperClasses} data-invalid={normalizedProps.invalid || null}>
          {renderIcon && (normalizedProps.invalid || normalizedProps.warn) && <hint.Icon class={iconClasses} size={16} />}
          <input {...sanitizedProps} class={classes} {...sharedTextInputProps} {...sanitizedInvalidOrWarnProps} />
          {isFluid && <hr class={`${prefix}--text-input__divider`} />}
          {isFluid && !inline && (normalizedProps.invalid || normalizedProps.warn) && <ValidationMessage />}
        </div>
        {!isFluid && !inline && (normalizedProps.invalid || normalizedProps.warn) && <ValidationMessage />}
        {!isFluid && !inline && !normalizedProps.invalid && !normalizedProps.warn && <HelperText />}
      </div>
    </div>
  );
});
