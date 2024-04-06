import { component$, useSignal, useVisibleTask$, QRL, Component } from '@builder.io/qwik';
import { itemDisabled } from '../../internal/qombobox/item-disabled';
import { itemsEqual } from '../../internal/qombobox/items-equal';
import { ListBoxMenuItem } from '../list-box/list-box-menu-item';
import { ComboboxState, ItemAttributes } from '../../internal/qombobox/qombobox';
import { Item, ItemProps } from '../dropdown/dropdown';

/**
 * Renders a popup menu item for a multi-select listbox
 */
export const MultiSelectMenuItem = component$(
  ({
    title,
    item,
    state,
    itemSelected,
    itemAttrs,
    useTitleInItem,
    itemToElement: ItemToElement,
    key,
    index,
    onToggle$,
    prefix,
  }: MultiSelectMenuItemProps) => {
    const spanElement = useSignal<HTMLSpanElement>();
    const isTruncated = useSignal(false);
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
      track(spanElement);
      isTruncated.value =
        !!spanElement.value?.offsetWidth && spanElement.value.offsetWidth < spanElement.value?.scrollWidth;
    });

    return (
      <ListBoxMenuItem
        key={key}
        isActive={itemSelected}
        aria-label={title}
        isHighlighted={state.highlightedItem ? itemsEqual(state.highlightedItem, item) : false}
        title={title}
        disabled={itemDisabled(item)}
        {...itemAttrs?.[index]}
      >
        <div class={`${prefix}--checkbox-wrapper`}>
          <span
            title={useTitleInItem || isTruncated.value ? title : undefined}
            class={`${prefix}--checkbox-label`}
            data-contained-checkbox-state={itemSelected ? 'true' : 'false'}
            id={`${itemAttrs?.[index].id}__checkbox`}
            ref={spanElement}
            onClick$={onToggle$}
          >
            {ItemToElement && <ItemToElement item={item} />}
            {!ItemToElement && title}
          </span>
        </div>
      </ListBoxMenuItem>
    );
  }
);

/**
 * MultiSelectMenuItem props
 */
export type MultiSelectMenuItemProps = {
  title?: string;
  item: Item;
  state: ComboboxState;
  itemSelected: boolean;
  itemAttrs: ItemAttributes[] | undefined;
  useTitleInItem: boolean | undefined;
  itemToElement: Component<ItemProps> | undefined;
  key: string | undefined;
  index: number;
  onToggle$: QRL<() => void>;
  prefix: string;
};
