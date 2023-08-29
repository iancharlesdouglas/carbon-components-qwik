import {
  Component,
  PropFunction,
  QwikIntrinsicElements,
  component$,
  useContext,
  useSignal,
  $,
  QwikKeyboardEvent,
  useStore,
  useTask$,
  QwikMouseEvent,
} from '@builder.io/qwik';
import { usePrefix } from '../../internal/hooks/use-prefix';
import { formContext } from '../../internal/contexts/form-context';
import classNames from 'classnames';
import _ from 'lodash';
import { ListBox } from '../list-box/list-box';
import { ListBoxDimensions, ListBoxMenu } from '../list-box/list-box-menu';
import { Checkmark, WarningAltFilled, WarningFilled } from 'carbon-icons-qwik';
import { ListBoxMenuIcon } from '../list-box/list-box-menu-icon';
import { ListBoxMenuItem } from '../list-box/list-box-menu-item';
import { qombobox } from '../../internal/qombobox/qombobox';
import { Keys, State, handleKeyDown } from '../../internal/qombobox/handle-keydown';

/**
 * Item with a label property
 */
export type Labelled = {
  label: string;
};

/**
 * List item type
 */
export type Item = string | Labelled;

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

const itemsEqual = (item1: Item, item2: Item) => {
  if (typeof item1 === 'string' && typeof item2 === 'string') {
    return item1 === item2;
  }
  const labelledItem1 = item1 as Labelled;
  const labelledItem2 = item2 as Labelled;
  return labelledItem1.label === labelledItem2.label;
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
  const stateObj: State = { isOpen: false };
  const state = useStore(stateObj);
  const { disabled = false, id: stipulatedId, titleText, items, initialSelectedItem, selectedItem } = props;
  const {
    id: modifiedId,
    comboBox: comboBoxAttrs,
    items: itemAttrs,
    listBox: listBoxAttrs,
    selectedOption: modifiedSelectedItem,
  } = qombobox(state.isOpen, disabled, stipulatedId, titleText, items, initialSelectedItem, selectedItem);
  const selectedOption = useSignal(modifiedSelectedItem);
  const highlightedOption = useSignal<Item>();
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
    label,
    onSelect$,
    renderSelectedItem: RenderSelectedItem,
    size = 'md',
    type = 'default',
    warn = false,
    warnText,
  } = props;

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
        <div
          class={`${prefix}--list-box__field`}
          title={selectedOption.value ? itemToString(selectedOption.value) : label}
          {...comboBoxAttrs}
          ref={comboboxElement}
          tabIndex={0}
          onClick$={$(() => {
            state.isOpen = !state.isOpen;
          })}
          onKeyDown$={$((event: QwikKeyboardEvent<HTMLDivElement>) =>
            handleKeyDown(event, keys, highlightedOption, items, state, selectedOption, onSelect$, listBoxDimensions, defaultItemToString, comboboxElement)
          )}
          document:onClick$={$((event: QwikMouseEvent) => {
            const element = event.target as HTMLElement;
            if (element.getAttribute('aria-controls') !== listBoxAttrs.id && state.isOpen) {
              state.isOpen = false;
            }
          })}
        >
          <span class={`${prefix}--list-box__label`}>
            {(selectedOption.value && (RenderSelectedItem ? <RenderSelectedItem item={selectedOption.value} /> : itemToString(selectedOption.value))) || label}
          </span>
          <ListBoxMenuIcon isOpen={state.isOpen} />
        </div>
        <ListBoxMenu
          {...listBoxAttrs}
          ref={listBoxElement}
          items={items}
          highlightedItem={highlightedOption.value}
          onKeyDown$={$((event: QwikKeyboardEvent<HTMLDivElement>) =>
            handleKeyDown(event, keys, highlightedOption, items, state, selectedOption, onSelect$, listBoxDimensions, defaultItemToString, comboboxElement)
          )}
          onMeasure$={$((dimensions: ListBoxDimensions) => {
            listBoxDimensions.visibleRows = dimensions.visibleRows;
          })}
          preventdefault:keydown
        >
          {state.isOpen &&
            items?.map((item: Item, index: number) => {
              const title = itemToString(item);
              const itemSelected = selectedOption.value ? itemsEqual(selectedOption.value, item) : undefined;
              return (
                <ListBoxMenuItem
                  key={itemAttrs?.[index].id}
                  isActive={!!itemSelected}
                  isHighlighted={highlightedOption.value ? itemsEqual(highlightedOption.value, item) : false}
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
