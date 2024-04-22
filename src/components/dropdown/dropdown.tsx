import {
  Component,
  PropFunction,
  QwikIntrinsicElements,
  component$,
  useContext,
  useSignal,
  $,
  useStore,
  useTask$,
  QRL,
} from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { formContext } from '../../internal/contexts/form-context';
import classNames from 'classnames';
import { ListBox } from '../list-box/list-box';
import { ListBoxDimensions, ListBoxMenu } from '../list-box/list-box-menu';
import { Checkmark, WarningAltFilled, WarningFilled } from 'carbon-icons-qwik';
import { ListBoxMenuIcon } from '../list-box/list-box-menu-icon';
import { ListBoxMenuItem } from '../list-box/list-box-menu-item';
import { ComboboxState, qombobox } from '../../internal/qombobox/qombobox';
import { Keys, Selector, handleKeyDown } from '../../internal/qombobox/handle-keydown';
import './dropdown.scss';
import { removeProps } from '../../internal/objects/remove-props';
import { itemsEqual } from '../../internal/qombobox/items-equal';
import { itemDisabled } from '../../internal/qombobox/item-disabled';

/**
 * Listbox item that has a label
 * @property label - Item label
 */
export type Labelled = {
  label: string;
};

/**
 * Listbox item that is an object and could be disabled if necessary
 * @property disabled - Whether disabled
 */
export type ObjectItem = Labelled & { disabled?: boolean };

/**
 * Listbox item
 */
export type Item = string | ObjectItem;

/**
 * Function that takes an item and returns a string representation of it
 */
export type ItemToString = (item: Item | undefined) => string | undefined;

export type ItemAsString = QRL<(item: Item | undefined) => string | undefined>;

/**
 * Returns the string representation of an item (either the label or the item itself if it is a string)
 * @param {Item} item - Item to render
 * @returns {string} String representation
 */
export const defaultItemToString: ItemToString = (item: Item | undefined) => {
  if (typeof item === 'string') {
    return item;
  }
  return item?.label;
};

export const defaultItemToString$ = $((item: Item | undefined) => {
  if (typeof item === 'string') {
    return item;
  }
  return item?.label;
});

/**
 * Props for a component to render an item
 * @property {Item} item - Item to render
 * @property {number} index - Index in list
 */
export type ItemProps = {
  item: Item;
  index?: number;
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
  invalid?: boolean;
  invalidText?: string;
  items?: Item[];
  itemToElement?: Component<ItemProps>;
  itemToString?: ItemToString;
  label?: string;
  onSelect$?: PropFunction<(item: Item) => void>;
  placeholder?: string;
  readOnly?: boolean;
  renderSelectedItem?: Component<ItemProps>;
  selectedItem?: Item;
  size?: 'sm' | 'md' | 'lg';
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
  const { disabled = false, id: stipulatedId, label: titleText, items, selectedItem: declaredSelectedItem } = props;
  const stateObj: ComboboxState = {
    isOpen: false,
    selectedItem: declaredSelectedItem,
    highlightedItem: declaredSelectedItem,
    highlightSelectedItem: true,
  };
  const state = useStore(stateObj);
  const {
    id: modifiedId,
    comboBox: comboBoxAttrs,
    items: itemAttrs,
    listBox: listBoxAttrs,
  } = qombobox(state, disabled, stipulatedId, titleText, items);
  const listBoxElement = useSignal<Element>();
  const listBoxDimensions = useStore<ListBoxDimensions>({ height: 0, itemHeight: 0, visibleRows: 0 });
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
    placeholder,
    onSelect$,
    readOnly,
    renderSelectedItem: RenderSelectedItem,
    size = 'md',
    type = 'default',
    warn = false,
    warnText,
  } = props;

  useTask$(({ track }) => {
    track(() => declaredSelectedItem);
    state.selectedItem = declaredSelectedItem;
    if (!declaredSelectedItem) {
      state.highlightedItem = undefined;
    } else if (items && !items.some(item => itemsEqual(item, declaredSelectedItem))) {
      state.selectedItem = undefined;
      state.highlightedItem = undefined;
    }
  });

  useTask$(({ track }) => {
    track(() => items);
    if (state.selectedItem && !items?.some(item => itemsEqual(item, state.selectedItem))) {
      state.selectedItem = undefined;
      state.highlightedItem = undefined;
    }
  });

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

  const helperTextClasses = classNames(`${prefix}--form__helper-text`, {
    [`${prefix}--form__helper-text--disabled`]: disabled,
  });

  const wrapperClasses = classNames(`${prefix}--dropdown__wrapper`, `${prefix}--list-box__wrapper`, customClass, {
    [`${prefix}--dropdown__wrapper--inline`]: inline,
    [`${prefix}--list-box__wrapper--inline`]: inline,
    [`${prefix}--dropdown__wrapper--inline--invalid`]: inline && invalid,
    [`${prefix}--list-box__wrapper--inline--invalid`]: inline && invalid,
    [`${prefix}--list-box__wrapper--fluid--invalid`]: isFluid && invalid,
    [`${prefix}--list-box__wrapper--fluid--focus`]: isFluid && isFocused && !state.isOpen,
  });

  const sanitizedProps = removeProps(
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
  const selector$: Selector = $((state: ComboboxState, onSelect$) => {
    state.selectedItem = state.highlightedItem;
    onSelect$ && onSelect$(state.selectedItem!);
    state.isOpen = false;
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
        {showWarning && (
          <WarningAltFilled
            class={`${prefix}--list-box__invalid-icon ${prefix}--list-box__invalid-icon--warning`}
            size={16}
          />
        )}
        <div
          class={[`${prefix}--list-box__field`, readOnly ? `${prefix}--list-box__readonly` : undefined]}
          title={
            !readOnly && state.selectedItem ? itemToString(state.selectedItem) : !readOnly ? placeholder : undefined
          }
          {...comboBoxAttrs}
          ref={comboboxElement}
          tabIndex={0}
          onClick$={$(() => {
            !readOnly && (state.isOpen = !state.isOpen);
          })}
          onKeyDown$={$((event: KeyboardEvent) =>
            handleKeyDown(
              event,
              keys,
              items,
              state,
              onSelect$,
              selector$,
              listBoxDimensions,
              defaultItemToString,
              comboboxElement
            )
          )}
          document:onClick$={$((event: MouseEvent) => {
            const element = event.target as HTMLElement;
            if (
              element.getAttribute('aria-controls') !== listBoxAttrs.id &&
              !element.classList.contains(`${prefix}--list-box__menu-item__option`) &&
              state.isOpen
            ) {
              state.isOpen = false;
            }
          })}
        >
          <span class={`${prefix}--list-box__label`}>
            {(state.selectedItem &&
              (RenderSelectedItem ? (
                <RenderSelectedItem item={state.selectedItem!} />
              ) : (
                itemToString(state.selectedItem)
              ))) ||
              placeholder}
          </span>
          {!readOnly && <ListBoxMenuIcon isOpen={state.isOpen} />}
        </div>
        <ListBoxMenu
          {...listBoxAttrs}
          ref={listBoxElement}
          items={items}
          highlightedItem={state.highlightedItem}
          selectedItems={state.selectedItem ? [state.selectedItem] : undefined}
          onKeyDown$={$((event: KeyboardEvent) =>
            handleKeyDown(
              event,
              keys,
              items,
              state,
              onSelect$,
              selector$,
              listBoxDimensions,
              defaultItemToString,
              comboboxElement
            )
          )}
          onMeasure$={$((dimensions: ListBoxDimensions) => {
            listBoxDimensions.visibleRows = dimensions.visibleRows;
          })}
          preventdefault:keydown
        >
          {state.isOpen &&
            items?.map((item: Item, index: number) => {
              const title = itemToString(item);
              const itemSelected = state.selectedItem ? itemsEqual(state.selectedItem, item) : undefined;
              return (
                <ListBoxMenuItem
                  key={itemAttrs?.[index].id}
                  isActive={!!itemSelected}
                  isHighlighted={state.highlightedItem ? itemsEqual(state.highlightedItem, item) : false}
                  title={title}
                  disabled={itemDisabled(item)}
                  {...itemAttrs?.[index]}
                  onClick$={$(() => {
                    if (!itemDisabled(item)) {
                      state.selectedItem = item;
                      state.highlightedItem = item;
                      state.isOpen = false;
                      onSelect$ && onSelect$(item);
                    }
                  })}
                >
                  {ItemToElement && <ItemToElement item={item} index={index} />}
                  {!ItemToElement && itemToString(item)}
                  {/* {itemSelected && !ItemToElement && (
                    <Checkmark class={`${prefix}--list-box__menu-item__selected-icon`} size={16} />
                  )} */}
                </ListBoxMenuItem>
              );
            })}
        </ListBoxMenu>
      </ListBox>
      {!inline && !invalid && !warn && helperText && !isFluid && <div class={helperTextClasses}>{helperText}</div>}
    </div>
  );
});
