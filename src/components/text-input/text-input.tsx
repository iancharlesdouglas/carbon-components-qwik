import { PropFunction, QwikChangeEvent, QwikMouseEvent, component$, useSignal, $, QwikIntrinsicElements } from '@builder.io/qwik';
import { usePrefix } from '../../internal/use-prefix';
import { useNormalizedInputProps } from '../../internal/use-normalized-input-props';
import classNames from 'classnames';
import _ from 'lodash';

/**
 * Text input component size
 */
export type TextInputSize = 'sm' | 'md' | 'lg';

/**
 * Text input component props
 */
export type TextInputProps = QwikIntrinsicElements['input'] & {
  class?: string;
  disabled?: boolean;
  helperText?: string;
  hideLabsel?: boolean;
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
  onChange$?: PropFunction<(event: QwikChangeEvent<HTMLInputElement>, element: HTMLInputElement) => void>;
  onClick$?: PropFunction<(event: QwikMouseEvent<HTMLInputElement, MouseEvent>, element: HTMLInputElement) => void>;
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
    id,
    inline = false,
    invalid = false,
    invalidText,
    labelText,
    onChange$,
    onClick$,
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
        if (onChange$) {
          onChange$(event, element);
        }
      }
    }),
    onClick$: $((event: QwikMouseEvent<HTMLInputElement, MouseEvent>, element: HTMLInputElement) => {
      if (!normalizedProps.disabled && onClick$) {
        onClick$(event, element);
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

  const Counter = component$(() => (enableCounter && maxCount ? <div class={counterClasses}>{`${textCount}/${maxCount}`}</div> : null));

  const LabelWrapper = component$(() => (
    <div class={`${prefix}--text-input__label-wrapper`}>
      <label for={id} class={labelClasses}>
        {labelText}
        <Counter />
      </label>
    </div>
  ));

  // helper text component
  // validation message component
  // isFluid from FormContext

  const sanitisedProps = _.omit(
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

  // return <div class={inputWrapperClasses}>
  //   {!inline ? (
  //     <LabelWrapper />
  //   ) : (
  //     <div class={`${prefix}--text-input__label-helper-wrapper`}
  //   )}
  // </div>;

  return <input {...sanitisedProps} class={classes} {...sharedTextInputProps} />;
});
