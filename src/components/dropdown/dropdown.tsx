import { Component, PropFunction, QwikIntrinsicElements, component$, useContext, useSignal, $, QwikKeyboardEvent, useStore, useTask$ } from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { formContext } from '../../internal/contexts/form-context';
import classNames from 'classnames';
import _ from 'lodash';
import { ListBox } from '../list-box/list-box';
import { ListBoxMenu, ScrollPosition } from '../list-box/list-box-menu';
import { Checkmark, WarningAltFilled, WarningFilled } from 'carbon-icons-qwik';
import { ListBoxMenuIcon } from '../list-box/list-box-menu-icon';
import { ListBoxMenuItem } from '../list-box/list-box-menu-item';
import { uniqueId } from '../../internal/unique/unique-id';
import { KeyCodes } from '../../internal/key-codes';

/**
 * List item type
 */
export type Item = string | { label: string };

/**
 * Function that takes an item and returns a string representation of it
 */
export type ItemToString = (item: Item) => string;

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
  onSelect$?: PropFunction<(item: Item) => void>;
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
  type State = {
    isOpen: boolean;
  };
  const stateObj: State = { isOpen: false };
  const state = useStore(stateObj);
  const scrollPosition = useSignal(ScrollPosition.Top);
  const { disabled = false, id: stipulatedId, titleText, items, initialSelectedItem, selectedItem } = props;
  const {
    id: modifiedId,
    comboBox: comboBoxAttrs,
    items: itemAttrs,
    listBox: listBoxAttrs,
    selectedOption: modifiedSelectedItem,
  } = ariaNormalize(state.isOpen, disabled, stipulatedId, titleText, items, initialSelectedItem, selectedItem);
  const selectedOption = useSignal(modifiedSelectedItem);
  const highlightedOption = useSignal<Item>();
  const listBoxElement = useSignal<Element>();
  const comboboxElement = useSignal<Element>();
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

  type Keys = {
    typed: string[];
    reset: boolean;
    timer?: number;
  };
  const keysObj: Keys = { typed: [], reset: false };
  const keys = useStore(keysObj);
  useTask$(({ track }) => {
    track(() => keys.reset);
    keys.reset = false;
    if (keys.typed.length > 0) {
      if (keys.timer) {
        clearTimeout(keys.timer);
      }
      keys.timer = setTimeout(() => (keys.typed = []), 500) as unknown as number;
      return () => clearTimeout(keys.timer);
    }
  });

  useTask$(({ track }) => {
    track(() => state.isOpen);
    if (!state.isOpen && comboboxElement.value) {
      (comboboxElement.value as HTMLButtonElement).focus();
    }
  });

  const inline = type === 'inline';
  const showWarning = !invalid && warn;

  const classes = classNames(`${prefix}--dropdown`, {
    [`${prefix}--dropdown--invalid`]: invalid,
    [`${prefix}--dropdown--warning`]: showWarning,
    [`${prefix}--dropdown--open`]: state.isOpen,
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
    [`${prefix}--list-box__wrapper--fluid--focus`]: isFluid && isFocused && !state.isOpen,
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

  const labelId = titleText ? `${id}--label` : undefined;

  const handleKeyDown = $(async (event: QwikKeyboardEvent<HTMLDivElement>) => {
    switch (event.keyCode) {
      case KeyCodes.DownArrow: {
        keys.typed = [];
        keys.reset = true;
        if (highlightedOption.value && items) {
          const currentIndex = items.indexOf(highlightedOption.value);
          if (currentIndex < items.length - 1) {
            highlightedOption.value = items[currentIndex + 1];
          }
        } else if (items) {
          state.isOpen = true;
          if (event.getModifierState && !event.getModifierState('Alt')) {
            highlightedOption.value = items[0];
            scrollPosition.value = ScrollPosition.Unspecified;
          }
        }
        break;
      }
      case KeyCodes.UpArrow: {
        keys.typed = [];
        keys.reset = true;
        if (state.isOpen) {
          if (event.getModifierState && event.getModifierState('Alt')) {
            selectedOption.value = highlightedOption.value;
            state.isOpen = false;
            onSelect$ && onSelect$(selectedOption.value!);
          } else {
            if (highlightedOption.value && items) {
              const currentIndex = items.indexOf(highlightedOption.value);
              if (currentIndex > 0) {
                highlightedOption.value = items[currentIndex - 1];
              }
            }
          }
        } else if (items) {
          state.isOpen = true;
          if (event.getModifierState && !event.getModifierState('Alt')) {
            highlightedOption.value = items[0];
            scrollPosition.value = ScrollPosition.Unspecified;
          }
        }
        break;
      }
      case KeyCodes.Enter:
      case KeyCodes.Space:
      case KeyCodes.Tab: {
        if (state.isOpen) {
          selectedOption.value = highlightedOption.value;
          onSelect$ && onSelect$(selectedOption.value!);
          state.isOpen = false;
        } else if (event.keyCode !== KeyCodes.Tab) {
          state.isOpen = true;
        }
        break;
      }
      case KeyCodes.Home: {
        state.isOpen = true;
        keys.typed = [];
        keys.reset = true;
        if (event.getModifierState && !event.getModifierState('Alt')) {
          if (items) {
            highlightedOption.value = items[0];
          }
        }
        scrollPosition.value = event.keyCode === KeyCodes.Home ? ScrollPosition.Top : ScrollPosition.Unspecified;
        break;
      }
      case KeyCodes.End: {
        state.isOpen = true;
        keys.typed = [];
        keys.reset = true;
        if (items) {
          highlightedOption.value = items[items.length - 1];
          scrollPosition.value = ScrollPosition.Bottom;
        }
        break;
      }
      case KeyCodes.Escape: {
        state.isOpen = false;
        break;
      }
      default: {
        if (event.keyCode >= 65 && event.keyCode <= 90 && items) {
          state.isOpen = true;
          keys.reset = true;
          keys.typed.push(event.key);
          const repeatedKey = keys.typed.every((key) => key === event.key);
          const matchingItem = repeatedKey
            ? items?.filter((item) => defaultItemToString(item).substring(0, 1).toLowerCase() === event.key)?.[keys.typed.length - 1]
            : items?.find((item) => defaultItemToString(item).substring(0, keys.typed.length).toLowerCase() === keys.typed.join(''));
          highlightedOption.value = matchingItem;
          if (repeatedKey && items?.filter((item) => defaultItemToString(item).substring(0, 1).toLowerCase() === event.key)?.length === keys.typed.length) {
            keys.typed = [];
          }
        }
      }
    }
  });

  return (
    <div class={wrapperClasses} {...sanitizedProps}>
      {titleText && (
        <label id={labelId} class={titleClasses}>
          {titleText}
        </label>
      )}
      <ListBox
        aria-label={ariaLabel}
        size={size}
        class={classes}
        invalid={invalid}
        invalidText={invalidText}
        warn={warn}
        warnText={warnText}
        isOpen={state.isOpen}
        id={id}
      >
        {invalid && <WarningFilled class={`${prefix}--list-box__invalid-icon`} size={16} />}
        {showWarning && <WarningAltFilled class={`${prefix}--list-box__invalid-icon ${prefix}--list-box__invalid-icon--warning`} size={16} />}
        <button
          type="button"
          class={`${prefix}--list-box__field`}
          title={selectedOption.value ? itemToString(selectedOption.value) : label}
          {...comboBoxAttrs}
          ref={comboboxElement}
          onClick$={$(() => {
            state.isOpen = !state.isOpen;
          })}
          onKeyDown$={handleKeyDown}
          preventdefault:click
          preventdefault:keydown
        >
          <span class={`${prefix}--list-box__label`}>
            {(selectedOption.value && (RenderSelectedItem ? <RenderSelectedItem item={selectedOption.value} /> : itemToString(selectedOption.value))) || label}
          </span>
          <ListBoxMenuIcon isOpen={state.isOpen} />
        </button>
        <ListBoxMenu {...listBoxAttrs} ref={listBoxElement} scrollPosition={scrollPosition.value} onKeyDown$={handleKeyDown}>
          {state.isOpen &&
            items?.map((item: Item, index: number) => {
              const title = itemToString(item);
              const itemSelected = selectedOption.value === item;
              return (
                <ListBoxMenuItem
                  key={itemAttrs?.[index].id}
                  isActive={selectedOption.value === item}
                  isHighlighted={highlightedOption.value === item}
                  title={title}
                  {...itemAttrs?.[index]}
                  onClick$={$(() => {
                    selectedOption.value = item;
                    state.isOpen = false;
                    onSelect$ && onSelect$(item);
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
