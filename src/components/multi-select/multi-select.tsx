import {
  Component,
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
import { WarningAltFilled, WarningFilled } from 'carbon-icons-qwik';
import { ListBoxMenuIcon } from '../list-box/list-box-menu-icon';
import { ListBoxMenuItem } from '../list-box/list-box-menu-item';
import { ComboboxState, qombobox } from '../../internal/qombobox/qombobox';
import { Keys, Selector, handleKeyDown } from '../../internal/qombobox/handle-keydown';
import './multi-select.scss';
import { removeProps } from '../../internal/objects/remove-props';
import { itemsEqual } from '../../internal/qombobox/items-equal';
import { itemDisabled } from '../../internal/qombobox/item-disabled';
import { Item, ItemProps, ItemToString, defaultItemToString } from '../dropdown/dropdown';
import { CompareItems, SortItems, SortOptions, defaultCompareItems, defaultSortItems } from './sorting';
import { ListBoxSelection } from '../list-box/list-box-selection';

/**
 * Multi-select props
 */
export type MultiSelectProps = QwikIntrinsicElements['div'] & {
  ariaLabel?: string;
  class?: string;
  clearSelectionDescription?: string;
  clearSelectionText?: string;
  compareItems?: CompareItems;
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
  onSelect$?: QRL<(item: Item) => void>;
  placeholder?: string;
  readOnly?: boolean;
  renderSelectedItem?: Component<ItemProps>;
  selectedItems?: Item[];
  size?: 'sm' | 'md' | 'lg';
  sortItems?: SortItems;
  translateWithId?: () => string;
  type?: 'default' | 'inline';
  useTitleInItem?: boolean;
  warn?: boolean;
  warnText?: string;
};

/**
 * Multi-select listbox popup state
 */
export type MultiSelectState = ComboboxState & {
  selectedItems: Item[] | undefined;
};

/**
 * Multi-select, a select-only combobox with multiple selection via checkboxes
 */
export const MultiSelect = component$((props: MultiSelectProps) => {
  const prefix = usePrefix();
  const { isFluid } = useContext(formContext);
  const isFocused = useSignal(false);
  const {
    disabled = false,
    id: stipulatedId,
    label: titleText,
    items,
    selectedItems: declaredSelectedItems,
    sortItems = defaultSortItems,
    compareItems = defaultCompareItems,
  } = props;
  const stateObj: MultiSelectState = {
    isOpen: false,
    selectedItems: declaredSelectedItems,
    highlightedItem: declaredSelectedItems?.[0],
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
    clearSelectionDescription,
    clearSelectionText,
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
    // renderSelectedItem: RenderSelectedItem,
    size = 'md',
    type = 'default',
    useTitleInItem,
    warn = false,
    warnText,
  } = props;

  const sortOptions: SortOptions = { selectedItems: declaredSelectedItems, itemToString, compareItems, locale: 'en' };

  useTask$(({ track }) => {
    track(() => declaredSelectedItems);
    state.selectedItems = declaredSelectedItems;
    if (!declaredSelectedItems) {
      state.highlightedItem = undefined;
    } else if (
      items &&
      !items.some(item => declaredSelectedItems.some(selectedItem => itemsEqual(item, selectedItem)))
    ) {
      state.selectedItems = undefined;
      state.highlightedItem = undefined;
    }
  });

  useTask$(({ track }) => {
    track(() => items);
    if (
      state.selectedItems &&
      !items?.some(item => state.selectedItems?.some(selectedItem => itemsEqual(item, selectedItem)))
    ) {
      state.selectedItems = undefined;
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

  const classes = classNames(`${prefix}--multi-select`, [!disabled ? customClass : null], {
    [`${prefix}--multi-select--invalid`]: invalid,
    [`${prefix}--multi-select--warning`]: showWarning,
    [`${prefix}--multi-select--inline`]: inline,
    [`${prefix}--multi-select--selected`]: state.selectedItems && state.selectedItems.length > 0,
    [`${prefix}--list-box--up`]: direction === 'top',
    [`${prefix}--multi-select--readonly`]: readOnly,
  });

  const titleClasses = classNames(`${prefix}--label`, {
    [`${prefix}--label--disabled`]: disabled,
    [`${prefix}--visually-hidden`]: hideLabel,
  });

  const helperTextClasses = classNames(`${prefix}--form__helper-text`, {
    [`${prefix}--form__helper-text--disabled`]: disabled,
  });

  const wrapperClasses = classNames(
    `${prefix}--multi-select__wrapper`,
    `${prefix}--list-box__wrapper`,
    [!disabled ? customClass : null],
    {
      [`${prefix}--multi-select--inline`]: inline,
      [`${prefix}--list-box__wrapper--inline`]: inline,
      [`${prefix}--multi-select--inline--invalid`]: inline && invalid,
      [`${prefix}--list-box__wrapper--inline--invalid`]: inline && invalid,
      [`${prefix}--list-box__wrapper--fluid--invalid`]: isFluid && invalid,
      [`${prefix}--list-box__wrapper--fluid--focus`]: isFluid && isFocused && !state.isOpen,
    }
  );

  const sanitizedProps = removeProps(
    props,
    'ariaLabel',
    'class',
    'clearSelectionDescription',
    'clearSelectionText',
    'compareItems',
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
    'sortItems',
    'titleText',
    'translateWithId',
    'type',
    'warn',
    'warnText'
  );

  const labelId = titleText ? `${id}--label` : undefined;

  const toggleItemSelected$ = $(
    (state: MultiSelectState, item: Item | undefined, onSelect$?: QRL<(item: Item) => void>) => {
      const selectedItemIndex = state.selectedItems?.findIndex(selectedItem => itemsEqual(selectedItem, item));
      if (selectedItemIndex && selectedItemIndex > -1) {
        state.selectedItems = state.selectedItems?.splice(selectedItemIndex, 1);
      } else if (item) {
        const selection = state.selectedItems ?? [];
        selection.push(item);
        state.selectedItems = selection;
      }
      if (item) {
        onSelect$ && onSelect$(item);
      }
    }
  );

  const selector$: Selector = $((state: ComboboxState, onSelect$?: QRL<(item: Item) => void>) => {
    const multiSelectState = state as unknown as MultiSelectState;
    toggleItemSelected$(multiSelectState, state.highlightedItem, onSelect$);
  });

  const clearSelection$ = $(() => {
    if (disabled || readOnly) {
      return;
    }
    state.selectedItems = [];
  });

  return (
    <div class={wrapperClasses} {...sanitizedProps}>
      <label class={titleClasses} id={labelId}>
        {titleText && titleText}
        {state.selectedItems?.length && state.selectedItems.length > 0 && (
          <span class={`${prefix}--visually-hidden`}>
            {clearSelectionDescription} {state.selectedItems!.length}
            {clearSelectionText}
          </span>
        )}
      </label>
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
          {state.selectedItems && state.selectedItems.length > 0 && (
            <ListBoxSelection
              readOnly={readOnly}
              clearSelection$={clearSelection$}
              clearSelectionDescription={clearSelectionDescription}
              selectionCount={state.selectedItems?.length}
              disabled={disabled}
            />
          )}
          <span class={`${prefix}--list-box__label`}>{placeholder}</span>
          {!readOnly && <ListBoxMenuIcon isOpen={state.isOpen} />}
        </div>
        <ListBoxMenu
          {...listBoxAttrs}
          ref={listBoxElement}
          items={items}
          highlightedItem={state.highlightedItem}
          selectedItems={state.selectedItems}
          style="width: 200px"
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
            sortItems(items, sortOptions)?.map((item: Item, index: number) => {
              const title = itemToString(item);
              const itemSelected = state.selectedItems?.some(selectedItem => itemsEqual(item, selectedItem));
              return (
                <ListBoxMenuItem
                  key={itemAttrs?.[index].id}
                  isActive={!!itemSelected}
                  aria-label={title}
                  isHighlighted={state.highlightedItem ? itemsEqual(state.highlightedItem, item) : false}
                  title={title}
                  disabled={itemDisabled(item)}
                  {...itemAttrs?.[index]}
                  onClick$={$(() => toggleItemSelected$(state, item, onSelect$))}
                >
                  <div class={`${prefix}--checkbox-wrapper`}>
                    <span
                      title={useTitleInItem ? title : undefined}
                      class={`${prefix}--checkbox-label`}
                      data-contained-checkbox-state={itemSelected}
                      id={`${itemAttrs?.[index].id}__checkbox`}
                    >
                      {ItemToElement && <ItemToElement item={item} />}
                      {!ItemToElement && itemToString(item)}
                    </span>
                  </div>
                </ListBoxMenuItem>
              );
            })}
        </ListBoxMenu>
      </ListBox>
      {!inline && !invalid && !warn && helperText && !isFluid && <div class={helperTextClasses}>{helperText}</div>}
    </div>
  );
});
