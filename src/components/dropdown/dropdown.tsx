import { Component, PropFunction, /*QwikFocusEvent, */ QwikIntrinsicElements, component$, useContext, useSignal, $ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { formContext } from '../../internal/contexts/form-context';
import classNames from 'classnames';
import _ from 'lodash';
import { ListBox } from '../list-box/list-box';
import { ListBoxMenu } from '../list-box/list-box-menu';
import { Checkmark, WarningAltFilled, WarningFilled } from 'carbon-icons-qwik';
import { ListBoxMenuIcon } from '../list-box/list-box-menu-icon';
import { ListBoxMenuItem } from '../list-box/list-box-menu-item';
import { uniqueId } from '../../internal/unique/unique-id';

/**
 * List item type
 */
export type Item = string | { label: string };

/**
 * Function that takes an item and returns a string representation of it
 */
export type ItemToString = (item: Item) => string;

/**
 * Dropdown select event
 * @property {Item} selectedItem - Selected item
 */
export type DropdownSelectEvent = {
  selectedItem: Item;
};

/**
 * Returns the string representation of an item (either the label or the item itself if it is a string)
 * @param {Item} item - Item to render
 * @returns {string} String representation
 */
export const defaultItemToString: ItemToString = (item: Item) => {
  if (typeof item === 'string') {
    return item;
  }
  return item?.label;
};

const ariaNormalize = (
  isOpen: boolean,
  disabled: boolean,
  id?: string,
  titleText?: string,
  items?: Item[],
  initialSelectedItem?: Item | Item[],
  selectedItem?: Item
) => {
  const actualId = id ?? uniqueId();
  const listBoxId = `listbox-${actualId}`;
  const labelId = titleText ? `${actualId}--label` : undefined;
  const hasPopup: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | undefined = 'listbox';
  const itemIds = items ? items.map((item) => getItemId(item)) : undefined;
  let selectedIndex: number | undefined;
  let selectedId: string | undefined;
  let selectedOption: Item | undefined;
  if (items && selectedItem) {
    selectedIndex = items.findIndex((item) => item === selectedItem);
    selectedOption = selectedItem;
  } else if (items && initialSelectedItem) {
    const initialItems = Array.isArray(initialSelectedItem) ? initialSelectedItem : [initialSelectedItem];
    selectedIndex = items.findIndex((item) => item === initialItems[0]);
    selectedOption = initialItems[0];
  }
  if (selectedIndex !== undefined) {
    selectedId = selectedIndex > -1 ? itemIds?.[selectedIndex] : undefined;
    if (selectedIndex == -1) {
      selectedOption = undefined;
    }
  }
  return {
    id: actualId,
    label: { id: labelId },
    listBox: { id: listBoxId, role: 'listbox', tabIndex: -1, 'aria-labelled-by': labelId },
    comboBox: {
      role: 'combobox',
      'aria-controls': listBoxId,
      'aria-expanded': isOpen,
      'aria-haspopup': hasPopup,
      'aria-labelledby': labelId,
      'aria-disabled': disabled,
      'aria-activedescendant': selectedId,
      disabled,
      tabIndex: 0,
    },
    items: itemIds?.map((itemId) => ({ id: itemId, role: 'option', 'aria-selected': itemId === selectedId })),
    selectedOption,
  };
};

const getItemId = (item: Item) => {
  const attributes = Object.getOwnPropertyNames(item);
  if (attributes.includes('id')) {
    return (item as unknown as { id: string }).id;
  }
  if (attributes.includes('key')) {
    return (item as unknown as { key: string }).key;
  }
  return uniqueId();
};

/**
 * Props for a component to render an item
 * @property {Item} item - Item to render
 */
export type ItemProps = {
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
  initialSelectedItem?: Item | Item[];
  invalid?: boolean;
  invalidText?: string;
  itemToElement?: Component<ItemProps>;
  itemToString?: ItemToString;
  items?: Item[];
  label?: string;
  onSelect$?: PropFunction<(event: DropdownSelectEvent) => void>;
  renderSelectedItem?: Component<ItemProps>;
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
  const { disabled = false, id: stipulatedId, titleText, items, initialSelectedItem, selectedItem } = props;
  const {
    id: modifiedId,
    comboBox: comboBoxAttrs,
    items: itemAttrs,
    listBox: listBoxAttrs,
    selectedOption: modifiedSelectedItem,
  } = ariaNormalize(isOpen.value, disabled, stipulatedId, titleText, items, initialSelectedItem, selectedItem);
  const selectedOption = useSignal(modifiedSelectedItem);
  const {
    ariaLabel,
    class: customClass,
    direction = 'bottom',
    helperText,
    hideLabel = false,
    id = modifiedId,
    invalid = false,
    invalidText,
    itemToElement: ItemToElement,
    itemToString = defaultItemToString,
    label,
    onSelect$,
    renderSelectedItem: RenderSelectedItem,
    size = 'md',
    type = 'default',
    warn = false,
    warnText,
  } = props;

  const inline = type === 'inline';
  const showWarning = !invalid && warn;

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
    'itemToElement',
    'itemToString',
    'items',
    'label',
    'onChange$',
    'renderSelectedItem',
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
        <button
          type="button"
          class={`${prefix}--list-box__field`}
          title={selectedOption.value ? itemToString(selectedOption.value) : label}
          {...comboBoxAttrs}
          onClick$={$(() => (isOpen.value = !isOpen.value))}
        >
          <span class={`${prefix}--list-box__label`}>
            {(selectedOption.value && (RenderSelectedItem ? <RenderSelectedItem item={selectedOption.value} /> : itemToString(selectedOption.value))) || label}
          </span>
          <ListBoxMenuIcon isOpen={isOpen.value} />
        </button>
        <ListBoxMenu {...listBoxAttrs}>
          {isOpen.value &&
            items?.map((item: Item, index: number) => {
              const title = itemToString(item);
              const itemSelected = selectedOption.value === item;
              return (
                <ListBoxMenuItem
                  key={itemAttrs?.[index].id}
                  isActive={selectedOption.value === item}
                  isHighlighted={selectedOption.value === item}
                  title={title}
                  {...itemAttrs?.[index]}
                  onClick$={$(() => {
                    selectedOption.value = item;
                    isOpen.value = false;
                    onSelect$ && onSelect$({ selectedItem: item });
                  })}
                >
                  {ItemToElement && <ItemToElement item={item} />}
                  {!ItemToElement && itemToString(item)}
                  {itemSelected && !ItemToElement && <Checkmark class={`${prefix}--list-box__menu-item__selected-icon`} size={16} />}
                </ListBoxMenuItem>
              );
            })}
        </ListBoxMenu>
      </ListBox>
      {!inline && !invalid && !warn && helperText && !isFluid && <div class={helperTextClasses}>{helperText}</div>}
    </div>
  );
});
