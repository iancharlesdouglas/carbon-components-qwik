import { Component, PropFunction, QwikIntrinsicElements, component$ /*, useContext, useSignal*/ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
// import { formContext } from '../../internal/contexts/form-context';
import classNames from 'classnames';
import _ from 'lodash';

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
 * Dropdown props
 */
export type DropdownProps = QwikIntrinsicElements['select'] & {
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
  renderSelectedItem$?: Component<any>;
  scale?: 'sm' | 'md' | 'lg';
  selectedItem?: object | string | number;
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
    warn = false,
    disabled = false,
    scale: size = 'md',
    direction = 'bottom' /*, itemToString = defaultItemToString */,
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

  const sanitizedProps = _.omit(
    props,
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
    'scale',
    'selectedItem',
    'titleText',
    'translateWithId',
    'type',
    'warn',
    'warnText'
  );

  return <div class={classes} {...sanitizedProps}></div>;
});
