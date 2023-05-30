import { Component, PropFunction, /*QwikFocusEvent, */ QwikIntrinsicElements, component$ /*useContext, useSignal, $*/ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
// import { formContext } from '../../internal/contexts/form-context';
import classNames from 'classnames';
import _ from 'lodash';
import { ListBox } from '../list-box/list-box';
import { WarningAltFilled, WarningFilled } from 'carbon-icons-qwik';

/**
 * List item type
 */
export type Item = string | { label: string };

/**
 * Function that takes an item and returns a string representation of it
 */
export type ItemToString = (item: Item) => string;

// const defaultItemToString: ItemToString = (item: Item) => {
//   if (typeof item === 'string') {
//     return item;
//   }
//   return item ? item.label : '';
// };

/**
 * Props for a custom component to render the selected item
 */
export type RenderSelectedItemProps = {
  item: ItemToString;
};

/**
 * Dropdown props
 */
export type DropdownProps = QwikIntrinsicElements['div'] & {
  ariaLabel?: string;
  class?: string;
  direction?: 'top' | 'bottom';
  disabled?: boolean;
  helperText?: string;
  hideLabel?: boolean;
  id?: string;
  initialSelectedItem?: object | object[] | string | string[] | number | number[];
  invalid?: boolean;
  invalidText?: string;
  itemToElement$?: Component<any>;
  itemToString?: ItemToString;
  items?: Item[];
  label?: string;
  onChange$?: PropFunction;
  renderSelectedItem$?: Component<RenderSelectedItemProps>;
  size?: 'sm' | 'md' | 'lg';
  selectedItem?: Item;
  titleText?: string;
  translateWithId?: () => string;
  type?: 'default' | 'inline';
  warn?: boolean;
  warnText?: string;
};

/**
 * Dropdown, a select-only combobox
 */
export const Dropdown = component$((props: DropdownProps) => {
  const prefix = usePrefix();
  // const { isFluid } = useContext(formContext);
  const {
    type = 'default',
    invalid = false,
    invalidText,
    warn = false,
    warnText,
    disabled = false,
    size = 'md',
    direction = 'bottom',
    // itemToString = defaultItemToString,
    hideLabel = false,
    // class: customClass,
    titleText,
    ariaLabel,
    label,
    id,
    selectedItem,
  } = props;

  const inline = type === 'inline';
  const showWarning = !invalid && warn;

  // const isFocused = useSignal(false);

  const isOpen = false;

  const classes = classNames(`${prefix}--dropdown`, {
    [`${prefix}--dropdown--invalid`]: invalid,
    [`${prefix}--dropdown--warning`]: showWarning,
    [`${prefix}--dropdown--open`]: isOpen,
    [`${prefix}--dropdown--inline`]: inline,
    [`${prefix}--dropdown--disabled`]: disabled,
    [`${prefix}--dropdown--${size}`]: size,
    [`${prefix}--list-box--up`]: direction === 'top',
  });

  const titleClasses = classNames(`${prefix}--label`, {
    [`${prefix}--label--disabled`]: disabled,
    [`${prefix}--visually-hidden`]: hideLabel,
  });

  // const helperTextClasses = classNames(`${prefix}--form__helper-text`, { [`${prefix}--form__helper-text--disabled`]: disabled });

  // const wrapperClasses = classNames(`${prefix}--dropdown__wrapper`, `${prefix}--list-box__wrapper`, customClass, {
  //   [`${prefix}--dropdown__wrapper--inline`]: inline,
  //   [`${prefix}--list-box__wrapper--inline`]: inline,
  //   [`${prefix}--dropdown__wrapper--inline--invalid`]: inline && invalid,
  //   [`${prefix}--list-box__wrapper--inline--invalid`]: inline && invalid,
  //   [`${prefix}--list-box__wrapper--fluid--invalid`]: isFluid && invalid,
  //   [`${prefix}--list-box__wrapper--fluid--focus`]: isFluid && isFocused && !isOpen,
  // });

  const sanitizedProps = _.omit(
    props,
    'ariaLabel',
    'class',
    'direction',
    'disabled',
    'helperText',
    'hideLabel',
    'initialSelectedItem',
    'invalid',
    'invalidText',
    'itemToElement$',
    'itemToString',
    'items',
    'label',
    'onChange$',
    'renderSelectedItem$',
    'selectedItem',
    'size',
    'titleText',
    'translateWithId',
    'type',
    'warn',
    'warnText'
  );

  // const handleFocus = $((event: QwikFocusEvent<HTMLDivElement>) => (isFocused.value = event.type === 'focus'));

  return (
    <div class={classes} {...sanitizedProps}>
      {/* TODO: set label attrs */}
      {titleText && <label class={titleClasses}>{titleText}</label>}
      <ListBox
        // onFocus$={handleFocus}
        // onBlur$={handleFocus}
        aria-label={ariaLabel}
        size={size}
        class={classes}
        invalid={invalid}
        invalidText={invalidText}
        warn={warn}
        warnText={warnText}
        isOpen={isOpen}
        id={id}
      >
        {invalid && <WarningFilled class={`${prefix}--list-box__invalid-icon`} />}
        {showWarning && <WarningAltFilled class={`${prefix}--list-box__invalid-icon ${prefix}--list-box__invalid-icon--warning`} />}
        {/* TODO - button attrs */}
        <button
          type="button"
          class={`${prefix}--list-box__field`}
          disabled={disabled}
          aria-disabled={disabled}
          // title={selectedItem ? itemToString(selectedItem) : label}
        >
          {/* TODO - render selected item using custom component function? */}
          {/* <span class={`${prefix}--list-box__label`}>{selectedItem ? itemToString(selectedItem) : label}</span> */}
          {/* TODO - listbox menu icon */}
        </button>
      </ListBox>
    </div>
  );
});
