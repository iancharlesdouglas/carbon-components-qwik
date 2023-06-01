import { Component, PropFunction, /*QwikFocusEvent, */ QwikIntrinsicElements, component$, useContext, useSignal, $, Signal } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { formContext } from '../../internal/contexts/form-context';
import classNames from 'classnames';
import _ from 'lodash';
import { ListBox } from '../list-box/list-box';
import { ListBoxMenu } from '../list-box/list-box-menu';
import { Checkmark, WarningAltFilled, WarningFilled } from 'carbon-icons-qwik';
import { ListBoxMenuIcon } from '../list-box/list-box-menu-icon';
import { ListBoxMenuItem } from '../list-box/list-box-menu-item';
import { v4 as uuid } from 'uuid';

/**
 * List item type
 */
export type Item = string | { label: string };

/**
 * Function that takes an item and returns a string representation of it
 */
export type ItemToString = (item: Item) => string;

const defaultItemToString: ItemToString = (item: Item) => {
  if (typeof item === 'string') {
    return item;
  }
  return item ? item.label : '';
};

const ariaNormalize = (isOpen: Signal<boolean>, id?: string, titleText?: string) => {
  const actualId = id ?? uuid();
  const listBoxId = `listbox-${actualId}`;
  const labelId = titleText ? `${actualId}--label` : undefined;
  const hasPopup: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | undefined = 'listbox';
  return {
    id: actualId,
    label: { id: labelId },
    listBox: { id: listBoxId, role: 'listbox', tabIndex: -1, 'aria-labelled-by': labelId },
    comboBox: {
      role: 'combobox',
      'aria-controls': listBoxId,
      'aria-expanded': isOpen.value,
      'aria-haspopup': hasPopup,
      'aria-labelledby': labelId,
      tabIndex: 0,
    },
  };
};

/**
 * Props for a custom component to render the selected item
 * @property {Item} item - Item to render
 */
export type RenderSelectedItemProps = {
  item: Item;
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
  renderSelectedItem?: Component<RenderSelectedItemProps>;
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
  const { isFluid } = useContext(formContext);
  const isFocused = useSignal(false);
  const isOpen = useSignal(false);
  const ariaInfo = ariaNormalize(isOpen, props.id, props.titleText);
  const {
    ariaLabel,
    class: customClass,
    direction = 'bottom',
    disabled = false,
    helperText,
    hideLabel = false,
    id = ariaInfo.id,
    invalid = false,
    invalidText,
    items,
    itemToString = defaultItemToString,
    label,
    renderSelectedItem: RenderSelectedItem,
    selectedItem,
    size = 'md',
    titleText,
    type = 'default',
    warn = false,
    warnText,
  } = props;

  const inline = type === 'inline';
  const showWarning = !invalid && warn;

  // TODO - compute highlightedIndex per useSelect
  const highlightedIndex = -1;

  const classes = classNames(`${prefix}--dropdown`, {
    [`${prefix}--dropdown--invalid`]: invalid,
    [`${prefix}--dropdown--warning`]: showWarning,
    [`${prefix}--dropdown--open`]: isOpen.value,
    [`${prefix}--dropdown--inline`]: inline,
    [`${prefix}--dropdown--disabled`]: disabled,
    [`${prefix}--dropdown--${size}`]: size,
    [`${prefix}--list-box--up`]: direction === 'top',
  });

  const titleClasses = classNames(`${prefix}--label`, {
    [`${prefix}--label--disabled`]: disabled,
    [`${prefix}--visually-hidden`]: hideLabel,
  });

  const helperTextClasses = classNames(`${prefix}--form__helper-text`, { [`${prefix}--form__helper-text--disabled`]: disabled });

  const wrapperClasses = classNames(`${prefix}--dropdown__wrapper`, `${prefix}--list-box__wrapper`, customClass, {
    [`${prefix}--dropdown__wrapper--inline`]: inline,
    [`${prefix}--list-box__wrapper--inline`]: inline,
    [`${prefix}--dropdown__wrapper--inline--invalid`]: inline && invalid,
    [`${prefix}--list-box__wrapper--inline--invalid`]: inline && invalid,
    [`${prefix}--list-box__wrapper--fluid--invalid`]: isFluid && invalid,
    [`${prefix}--list-box__wrapper--fluid--focus`]: isFluid && isFocused && !isOpen.value,
  });

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
    'id',
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
  const labelId = titleText ? `${id}--label` : undefined;

  return (
    <div class={wrapperClasses} {...sanitizedProps}>
      {titleText && (
        <label id={labelId} class={titleClasses}>
          {titleText}
        </label>
      )}
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
        isOpen={isOpen.value}
        id={id}
      >
        {invalid && <WarningFilled class={`${prefix}--list-box__invalid-icon`} size={16} />}
        {showWarning && <WarningAltFilled class={`${prefix}--list-box__invalid-icon ${prefix}--list-box__invalid-icon--warning`} size={16} />}
        {/* TODO - button aria attrs */}
        <button
          type="button"
          class={`${prefix}--list-box__field`}
          disabled={disabled}
          aria-disabled={disabled}
          title={selectedItem ? itemToString(selectedItem) : label}
          {...ariaInfo.comboBox}
          onClick$={$(() => (isOpen.value = !isOpen.value))}
        >
          <span class={`${prefix}--list-box__label`}>
            {(selectedItem && (RenderSelectedItem ? <RenderSelectedItem item={selectedItem} /> : itemToString(selectedItem!))) || label}
          </span>
          <ListBoxMenuIcon isOpen={isOpen.value} />
        </button>
        {/* TODO - listbox menu aria attrs */}
        {/* id={`listbox-${id}`} role="listbox" tabIndex={-1} aria-labelledby={labelId}> */}
        <ListBoxMenu {...ariaInfo.listBox}>
          {isOpen.value &&
            items?.map((item: Item, index: number) => {
              // TODO - title - itemToElement ? item.text...
              const title = itemToString(item);
              const itemSelected = selectedItem === item;
              // TODO - item aria attrs
              return (
                // TODO - derive key per useSelect
                <ListBoxMenuItem
                  key={item.toString()}
                  isActive={selectedItem === item}
                  isHighlighted={highlightedIndex === index || selectedItem === item}
                  title={title}
                >
                  {/* TODO - itemToElement if supplied... */}
                  {itemToString(item)}
                  {itemSelected && <Checkmark class={`${prefix}--list-box__menu-item__selected-icon`} size={16} />}
                </ListBoxMenuItem>
              );
            })}
        </ListBoxMenu>
      </ListBox>
      {!inline && !invalid && !warn && helperText && !isFluid && <div class={helperTextClasses}>{helperText}</div>}
    </div>
  );
});
