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
import { ComboboxState, qombobox } from '../../internal/qombobox/qombobox';
import { Keys, handleKeyDown } from '../../internal/qombobox/handle-keydown';
import './multi-select.scss';
import { removeProps } from '../../internal/objects/remove-props';
import { itemsEqual } from '../../internal/qombobox/items-equal';
import { Item, ItemAsString, ItemProps, defaultItemToString, defaultItemToString$ } from '../dropdown/dropdown';
import { CompareItems, SortItems, SortOptions, defaultCompareItems$, defaultSortItems$ } from './sorting';
import { ListBoxSelection } from '../list-box/list-box-selection';
import { MultiSelectMenuItem } from './multi-select-menu-item';
import { toggleItemSelected$ } from './toggle-item-selected';

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
    sortItems$ = defaultSortItems$,
    compareItems$ = defaultCompareItems$,
  } = props;

  const stateObj: ComboboxState = {
    isOpen: false,
    selectedItems: declaredSelectedItems,
    highlightedItem: undefined,
    highlightSelectedItem: false,
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
    clearSelectionDescription = 'Total items selected:',
    clearSelectionText = 'To clear selection, press Delete or Backspace',
    direction = 'bottom',
    helperText,
    hideLabel = false,
    id = modifiedId,
    invalid = false,
    invalidText,
    itemToElement: ItemToElement,
    itemToString$ = defaultItemToString$,
    placeholder,
    onChange$,
    onMenuChange$,
    readOnly,
    renderSelectedItem: RenderSelectedItem,
    selectionFeedback = 'top-after-reopen',
    size = 'md',
    type = 'default',
    useTitleInItem,
    warn = false,
    warnText,
  } = props;

  const sortOptions: SortOptions = { itemToString$, compareItems$, locale: 'en' };

  const sortedObj = {
    items,
    changed: false,
    initialized: false,
  };
  const sorted = useStore(sortedObj);

  useTask$(async () => {
    if (!sorted.initialized) {
      sorted.initialized = true;
      sorted.items = await sortItems$(items, state.selectedItems, selectionFeedback === 'fixed', sortOptions);
    }
  });

  useTask$(async ({ track }) => {
    track(sorted);
    if (!sorted.initialized) {
      sorted.items = await sortItems$(items, state.selectedItems, selectionFeedback === 'fixed', sortOptions);
      sorted.initialized = true;
    }
  });

  useTask$(({ track }) => {
    track(() => items || declaredSelectedItems);
    state.selectedItems = declaredSelectedItems;
    if (!declaredSelectedItems) {
      state.highlightedItem = undefined;
    } else if (
      items &&
      declaredSelectedItems &&
      !declaredSelectedItems.every(selectedItem => items.some(item => itemsEqual(item, selectedItem)))
    ) {
      state.selectedItems = declaredSelectedItems.filter(selectedItem =>
        items.some(item => itemsEqual(item, selectedItem))
      );
      state.highlightedItem = undefined;
    }
  });

  useTask$(({ track }) => {
    track(() => declaredSelectedItems);
    state.selectedItems = declaredSelectedItems;
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

  useTask$(async ({ track }) => {
    track(() => state.isOpen);
    if (!state.isOpen && comboboxElement.value) {
      sorted.items = await sortItems$(items, state.selectedItems, selectionFeedback === 'fixed', sortOptions);
      (comboboxElement.value as HTMLButtonElement).focus();
    }
  });

  const inline = type === 'inline';
  const showWarning = !invalid && warn;

  const classes = classNames(`${prefix}--multi-select`, [!disabled ? customClass : null], {
    [`${prefix}--multi-select--disabled`]: disabled,
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
    'compareItems$',
    'direction',
    'disabled',
    'helperText',
    'hideLabel',
    'id',
    'invalid',
    'invalidText',
    'items',
    'itemToElement',
    'itemToString$',
    'label',
    'onChange$',
    'onMenuChange$',
    'placeholder',
    'readOnly',
    'renderSelectedItem',
    'selectedItems',
    'selectionFeedback',
    'size',
    'sortItems$',
    'translateWithId$',
    'type',
    'useTitleInItem',
    'warn',
    'warnText'
  );

  const labelId = titleText ? `${id}--label` : undefined;

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
        <div class={`${prefix}--list-box__field--wrapper`}>
          {state.selectedItems && state.selectedItems.length > 0 && (
            <ListBoxSelection
              readOnly={readOnly}
              clearSelection$={clearSelection$}
              clearSelectionDescription={clearSelectionDescription}
              selectionCount={state.selectedItems?.length}
              disabled={disabled}
            />
          )}
          <div
            class={[`${prefix}--list-box__field`, readOnly ? `${prefix}--list-box__readonly` : undefined]}
            {...comboBoxAttrs}
            ref={comboboxElement}
            tabIndex={0}
            onClick$={$(() => {
              if (!readOnly) {
                state.isOpen = !state.isOpen;
                sorted.changed = true;
                if (!state.isOpen) {
                  state.highlightedItem = undefined;
                }
                onMenuChange$ && onMenuChange$(state.isOpen);
              }
            })}
            onKeyDown$={$((event: KeyboardEvent) =>
              handleKeyDown(
                event,
                keys,
                items,
                state,
                $((item: Item) => onChange$ && onChange$(state.selectedItems ?? [], item)),
                toggleItemSelected$,
                listBoxDimensions,
                defaultItemToString,
                comboboxElement
              )
            )}
            document:onClick$={$((event: MouseEvent) => {
              const element = event.target as HTMLElement;
              if (
                !element?.className?.endsWith('--checkbox-label') &&
                !element?.className?.endsWith('--checkbox-wrapper') &&
                element.getAttribute('aria-controls') !== listBoxAttrs.id &&
                !element?.classList.contains(`${prefix}--list-box__menu-item__option`) &&
                state.isOpen
              ) {
                state.isOpen = false;
                if (selectionFeedback === 'top') {
                  sorted.initialized = false;
                }
                state.highlightedItem = undefined;
              }
            })}
          >
            <span class={`${prefix}--list-box__label`}>
              {state.selectedItems?.length && state.selectedItems?.length > 0 && RenderSelectedItem ? (
                <RenderSelectedItem item={state.selectedItems[0]} />
              ) : (
                placeholder
              )}
            </span>
            {!readOnly && <ListBoxMenuIcon isOpen={state.isOpen} />}
          </div>
        </div>
        <ListBoxMenu
          {...listBoxAttrs}
          ref={listBoxElement}
          items={items}
          highlightedItem={state.highlightedItem}
          selectedItems={state.selectedItems}
          onKeyDown$={$((event: KeyboardEvent) =>
            handleKeyDown(
              event,
              keys,
              items,
              state,
              $((item: Item) => onChange$ && onChange$(state.selectedItems ?? [], item)),
              toggleItemSelected$,
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
            sorted.items?.map(async (item: Item, index: number) => {
              const itemSelected = !!state.selectedItems?.some(selectedItem => itemsEqual(item, selectedItem));
              return (
                <MultiSelectMenuItem
                  title={await itemToString$(item)}
                  item={item}
                  state={state}
                  itemSelected={itemSelected}
                  itemAttrs={itemAttrs}
                  useTitleInItem={useTitleInItem}
                  key={itemAttrs?.[index]?.id}
                  itemToElement={ItemToElement}
                  index={index}
                  onToggle$={$(() => {
                    const selectedItemIndex = state.selectedItems?.findIndex(selectedItem =>
                      itemsEqual(selectedItem, item)
                    );
                    if (selectedItemIndex !== undefined && selectedItemIndex > -1) {
                      state.selectedItems = state.selectedItems?.filter(
                        selectedItem => !itemsEqual(selectedItem, item)
                      );
                    } else {
                      const selection = state.selectedItems ?? [];
                      selection.push(item);
                      state.selectedItems = selection;
                    }
                    onChange$ && onChange$(state.selectedItems ?? [], item);
                    sorted.changed = true;
                    if (selectionFeedback === 'top') {
                      sorted.initialized = false;
                    }
                  })}
                  prefix={prefix}
                />
              );
            })}
        </ListBoxMenu>
      </ListBox>
      {!inline && !invalid && !warn && helperText && !isFluid && <div class={helperTextClasses}>{helperText}</div>}
    </div>
  );
});

/**
 * Multi-select props
 */
export type MultiSelectProps = QwikIntrinsicElements['div'] & {
  ariaLabel?: string;
  class?: string;
  clearSelectionDescription?: string;
  clearSelectionText?: string;
  compareItems$?: CompareItems;
  direction?: 'top' | 'bottom';
  disabled?: boolean;
  helperText?: string;
  hideLabel?: boolean;
  id?: string;
  invalid?: boolean;
  invalidText?: string;
  items?: Item[];
  itemToElement?: Component<ItemProps>;
  itemToString$?: ItemAsString;
  label?: string;
  onChange$?: QRL<(selectedItems: Item[], item: Item) => void>;
  onMenuChange$?: QRL<(open: boolean) => void>;
  placeholder?: string;
  readOnly?: boolean;
  renderSelectedItem?: Component<ItemProps>;
  selectedItems?: Item[];
  selectionFeedback?: 'top' | 'fixed' | 'top-after-reopen';
  size?: 'sm' | 'md' | 'lg';
  sortItems$?: SortItems;
  translateWithId$?: QRL<(id: string) => string>;
  type?: 'default' | 'inline';
  useTitleInItem?: boolean;
  warn?: boolean;
  warnText?: string;
};
