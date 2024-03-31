import { Signal } from '@builder.io/qwik';
import { Item } from '../../components/dropdown/dropdown';
import { uniqueId } from '../unique/unique-id';

/**
 * Combobox listbox popup state
 */
export type ComboboxState = {
  isOpen: boolean;
  highlightedItem: Item | undefined;
  selectedItem: Item | undefined;
};

/**
 * Return value of qombobox function
 * @property id - ID passed in or computed
 * @property label - Label sub-object containing its id attribute, if a label is present (determined by titleText)
 * @property listBox - Listbox sub-object containing attributes: id, role, tabIndex, 'aria-labelled-by' (if titleText present)
 * @property comboBox - Combobox sub-object containing attributes: role, 'aria-controls', 'aria-expanded', 'aria-haspopup', 'aria-label', 'aria-disabled', 'aria-activedescendant', disabled and tabIndex
 * @property items - List of item attributes (if items are available) containing attributes: id, role and 'aria-selected'
 * @property selectedOption - Selected item if one is selected
 */
export type QomboboxReturn = {
  id: string;
  label: { id?: string };
  listBox: { id: string; role: string; tabIndex: number; 'aria-labelled-by'?: string };
  comboBox: {
    role: string;
    'aria-controls': string;
    'aria-expanded': boolean;
    'aria-haspopup'?: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
    'aria-label': string;
    'aria-disabled': boolean;
    'aria-activedescendant'?: string;
    disabled: boolean;
    tabIndex: number;
  };
  items?: { id: string; role: string; 'aria-selected': boolean }[];
  selectedItem?: Signal<Item | undefined>;
};

/**
 * Derives combobox ARIA attributes
 * @param state State (whether open, selected item)
 * @param disabled Whether the combobox control is disabled
 * @param id ID of the control
 * @param titleText Title text for label
 * @param items Items in the listbox
 * @returns Aria information
 */
export const qombobox = (
  state: ComboboxState,
  disabled: boolean,
  id?: string,
  titleText?: string,
  items?: Item[]
): QomboboxReturn => {
  const actualId = id ?? `combobox-${uniqueId()}`;
  const listBoxId = `listbox-${actualId}`;
  const labelId = titleText ? `${actualId}--label` : undefined;
  const hasPopup: boolean | 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog' | undefined = 'listbox';
  const itemIds = items ? items.map(item => getItemId(item)) : undefined;
  let selectedId: string | undefined;
  return {
    id: actualId,
    label: { id: labelId },
    listBox: { id: listBoxId, role: 'listbox', tabIndex: -1, 'aria-labelled-by': labelId },
    comboBox: {
      role: 'combobox',
      'aria-controls': listBoxId,
      'aria-expanded': state.isOpen,
      'aria-haspopup': hasPopup,
      'aria-label': 'Open menu',
      'aria-disabled': disabled,
      'aria-activedescendant': state.isOpen ? selectedId : undefined,
      disabled,
      tabIndex: 0,
    },
    items: itemIds?.map(itemId => ({ id: itemId, role: 'option', 'aria-selected': itemId === selectedId })),
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
