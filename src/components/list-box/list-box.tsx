import { QwikIntrinsicElements, component$, useContext, $, Slot } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { formContext } from '../../internal/contexts/form-context';
import classNames from 'classnames';
import { removeProps } from '../../internal/objects/remove-props';
import { Key } from '../../internal/key';

/**
 * ListBox props
 * @property {string} class - Custom CSS class
 * @property {boolean} disabled - Whether list box is disabled
 * @property {boolean} invalid - Whether list box is in an invalid state
 * @property {string} invalidText - Invalid state message
 * @property {boolean} isOpen - Whether list box is currently open
 * @property {string} size - Size
 * @property {string} type - Either 'default' (the default) or 'inline'
 * @property {boolean} warn - Whether list box is in a warning state
 * @property {string} warnText - Warning state message
 */
export type ListBoxProps = QwikIntrinsicElements['div'] & {
  class?: string;
  disabled?: boolean;
  invalid?: boolean;
  invalidText?: string;
  isOpen?: boolean;
  size?: 'sm' | 'md' | 'lg';
  type?: 'default' | 'inline';
  warn?: boolean;
  warnText?: string;
};

/**
 * ListBox component
 */
export const ListBox = component$((props: ListBoxProps) => {
  const prefix = usePrefix();
  const { isFluid } = useContext(formContext);
  const {
    class: customClassName,
    size,
    type = 'default',
    disabled = false,
    isOpen = false,
    invalid = false,
    invalidText,
    warn,
    warnText,
  } = props;
  const showWarning = !invalid && warn;
  const classes = classNames(
    customClassName,
    `${prefix}--list-box`,
    { [`${prefix}--list-box--${size}`]: !!size },
    { [`${prefix}--list-box--inline`]: type === 'inline' },
    { [`${prefix}--list-box--disabled`]: disabled },
    { [`${prefix}--list-box--expanded`]: isOpen },
    { [`${prefix}--list-box--invalid`]: invalid },
    { [`${prefix}--list-box--warning`]: showWarning }
  );
  const sanitizedProps = removeProps(
    props,
    'class',
    'disabled',
    'invalid',
    'invalidText',
    'isOpen',
    'size',
    'type',
    'warn',
    'warnText'
  );
  return (
    <>
      <div
        {...sanitizedProps}
        class={classes}
        onKeyDown$={$((event: KeyboardEvent) => {
          if (event.key === Key.Escape) {
            event?.stopPropagation && event.stopPropagation();
          }
        })}
        preventdefault:click
        data-invalid={invalid}
      >
        <Slot />
      </div>
      {isFluid && <hr class={`${prefix}--list-box__divider`} />}
      {invalid && <div class={`${prefix}--form-requirement`}>{invalidText}</div>}
      {showWarning && <div class={`${prefix}--form-requirement`}>{warnText}</div>}
    </>
  );
});
