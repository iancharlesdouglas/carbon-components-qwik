import { Component, PropFunction, QwikIntrinsicElements, component$, useContext, useSignal } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { formContext } from '../../internal/contexts/form-context';
import classNames from 'classnames';

/**
 * Dropdown props
 */
export type DropdownProps = QwikIntrinsicElements['select'] & {
  // class?: string; - LEFT OUT Of v11
  direction?: 'top' | 'bottom';
  disabled?: boolean;
  // downshiftProps: ??
  helperText?: string;
  hideLabel?: boolean;
  id?: string;
  initialSelectedItem?: object | object[] | string | string[] | number | number[];
  invalid?: boolean;
  invalidText?: string;
  itemToElement$?: Component<any>;
  itemToString?: any; // function to return 'label' attribute by default but to return string from item
  items?: any[];
  label?: string;
  onChange$?: PropFunction;
  renderSelectedItem$?: Component<any>;
  selectedItem?: object | string | number;
  size?: 'sm' | 'md' | 'lg';
  titleText?: string;
  translateWithId?: () => string;
  type?: 'default' | 'inline';
  warn?: boolean;
  warnText?: string;
};

/**
 * Dropdown
 */
export const Dropdown = component$((props: DropdownProps) => {
  const prefix = usePrefix();
  const { isFluid } = useContext(formContext);

  // TODO - selectprops?

  const { type = 'default', invalid = false } = props;
  const inline = type === 'inline';
  const showWarning = !invalid && warn;

  const isFocused = useSignal(false);

  const classes = classNames(`${prefix}--dropdown`, {
    [`${prefix}--dropdown--invalid`]: invalid,
    [`${prefix}--dropdown--warning`]: showWarning,
    [`${prefix}--dropdown--open`]: isOpen,
  });
});
