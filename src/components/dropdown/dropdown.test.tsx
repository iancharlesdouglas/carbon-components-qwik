import { describe, expect, it } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Form } from '../form/form';
import { Dropdown, Item, ItemProps, Labelled, defaultItemToString } from './dropdown';
import { component$, $, useSignal } from '@builder.io/qwik';
import { KeyCodes } from '../../internal/key-codes';

describe('Dropdown', () => {
  it('renders expected CSS classes per attributes', async () => {
    const { screen, render } = await createDOM();
    const customClass = 'custom-class';

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown class={customClass} invalid type="inline" disabled direction="top" />
        </Form>
      </CarbonRoot>
    );

    const listboxDiv = screen.querySelector('div.cds--dropdown__wrapper > div') as HTMLDivElement;
    expect(listboxDiv.classList.contains('cds--dropdown')).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--dropdown--invalid')).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--dropdown--warning')).toBeFalsy();
    expect(listboxDiv.classList.contains('cds--dropdown--inline')).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--dropdown--disabled')).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--list-box--up')).toBeTruthy();

    const wrapperDiv = screen.querySelector('div.cds--dropdown__wrapper') as HTMLDivElement;
    expect(wrapperDiv.classList.contains(customClass)).toBeTruthy();
  });

  it('renders warning CSS class if in warning state', async () => {
    const { screen, render } = await createDOM();
    const dropdownId = 'dropdown-id';

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown id={dropdownId} warn />
        </Form>
      </CarbonRoot>
    );

    const listboxDiv = screen.querySelector(`div#${dropdownId}`) as HTMLDivElement;
    expect(listboxDiv.classList.contains('cds--dropdown--warning')).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--dropdown--invalid')).toBeFalsy();
  });

  it('omits non-standard properties from the rendered div element', async () => {
    const { screen, render } = await createDOM();
    const dropdownId = 'dropdown-id';

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown
            id={dropdownId}
            class="some-class"
            direction="bottom"
            disabled
            helperText="Enter a name"
            hideLabel={false}
            invalid
            invalidText="Invalid!"
            label="Name"
            size="md"
            titleText="Name input"
            type="default"
            warn
            warnText="Ugly name"
          />
        </Form>
      </CarbonRoot>
    );

    const listboxDiv = screen.querySelector(`div#${dropdownId}`) as HTMLDivElement;
    const illegalAttrs = [
      'ariaLabel',
      'direction',
      'disabled',
      'helperText',
      'hideLabel',
      'initialSelectedItem',
      'invalid',
      'invalidText',
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
      'warnText',
    ];
    illegalAttrs.forEach((attr) => expect(listboxDiv.hasAttribute(attr), `Attribute: ${attr} unexpected`).toBeFalsy());
  });

  it('renders a label with appropriate CSS classes if titleText is stipulated', async () => {
    const { screen, render } = await createDOM();
    const dropdownIdTitle = 'labelled-dropdown-id';
    const dropdownIdNoTitle = 'unlabelled-dropdown-id';
    const titleText = 'Title';

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown id={dropdownIdTitle} titleText={titleText} disabled hideLabel />
          <Dropdown id={dropdownIdNoTitle} />
        </Form>
      </CarbonRoot>
    );

    const labelledDropdownLabel = screen.querySelector('div.cds--dropdown__wrapper label') as HTMLLabelElement;
    expect(labelledDropdownLabel).toBeTruthy();
    expect(labelledDropdownLabel.classList.contains('cds--label')).toBeTruthy();
    expect(labelledDropdownLabel.classList.contains('cds--label--disabled')).toBeTruthy();
    expect(labelledDropdownLabel.classList.contains('cds--visually-hidden')).toBeTruthy();

    const unlabelledDropdownLabel = screen.querySelector(`div#${dropdownIdNoTitle} label`) as HTMLLabelElement;
    expect(unlabelledDropdownLabel).toBeFalsy();
  });

  it('renders a ListBox with appropriate attributes', async () => {
    const { screen, render } = await createDOM();
    const dropdownId = 'dropdown-id';
    const ariaLabel = 'Aria label';
    const size = 'sm';

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown id={dropdownId} ariaLabel={ariaLabel} size={size} invalid warn disabled />
        </Form>
      </CarbonRoot>
    );

    const listboxDiv = screen.querySelector('div.cds--dropdown.cds--list-box') as HTMLDivElement;
    expect(listboxDiv.getAttribute('aria-label')).toEqual(ariaLabel);
    expect(listboxDiv.classList.contains(`cds--list-box--${size}`)).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--list-box--invalid')).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--list-box--warning')).toBeFalsy();
    expect(listboxDiv.getAttribute('id')).toEqual(dropdownId);
  });

  it('renders selected item label', async () => {
    const { screen, render } = await createDOM();
    const label = 'Selected item';
    const selectedItem = { label };

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown selectedItem={selectedItem} items={[selectedItem]} />
        </Form>
      </CarbonRoot>
    );

    const selectedItemSpan = screen.querySelector('div.cds--dropdown div.cds--list-box__field span') as HTMLSpanElement;
    expect(selectedItemSpan.textContent).toEqual(label);
  });

  it('renders selected item label using a custom component function', async () => {
    const { screen, render } = await createDOM();
    const label = 'Selected item';
    const selectedObjectItem = { label };
    const selectedStringItem = label;
    const selectedItemClass = 'selected-item';
    const objectItemsDropdown = 'dropdown-object-items';
    const stringItemsDropdown = 'dropdown-string-items';

    const SelectedItemRenderComp = component$((props: ItemProps) => (
      <span class={selectedItemClass}>{typeof props.item === 'string' ? props.item : props.item.label}</span>
    ));

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown id={objectItemsDropdown} selectedItem={selectedObjectItem} renderSelectedItem={SelectedItemRenderComp} items={[selectedObjectItem]} />
          <Dropdown id={stringItemsDropdown} selectedItem={selectedStringItem} renderSelectedItem={SelectedItemRenderComp} items={[selectedStringItem]} />
        </Form>
      </CarbonRoot>
    );

    const selectedObjectItemSpan = screen.querySelector(`div.cds--dropdown#${objectItemsDropdown} div.cds--list-box__field span`) as HTMLSpanElement;
    expect(selectedObjectItemSpan.textContent).toEqual(label);
    const selectedStringItemSpan = screen.querySelector(`div.cds--dropdown#${stringItemsDropdown} div.cds--list-box__field span`) as HTMLSpanElement;
    expect(selectedStringItemSpan.textContent).toEqual(label);
  });

  it('renders initially selected item', async () => {
    const { screen, render } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];
    const selectedItem = items.find((item) => item === 'Banana');

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown initialSelectedItem={selectedItem} items={items} />
          <Dropdown initialSelectedItem={'Nonesuch'} items={items} id="invalid-selected-item" />
        </Form>
      </CarbonRoot>
    );

    const selectedItemSpan = screen.querySelector('div.cds--dropdown div.cds--list-box__field span') as HTMLSpanElement;
    expect(selectedItemSpan.textContent).toEqual(selectedItem);
    const invalidSelectedItemSpan = screen.querySelector('#invalid-selected-item div.cds--list-box__field span') as HTMLSpanElement;
    expect(invalidSelectedItemSpan.textContent).toEqual('');
  });

  it('renders first of a set of initially selected items', async () => {
    const { screen, render } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];
    const selectedItems = items.filter((item) => item === 'Banana' || item === 'Cherry');

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown initialSelectedItem={selectedItems} items={items} />
        </Form>
      </CarbonRoot>
    );

    const selectedItemSpan = screen.querySelector('div.cds--dropdown div.cds--list-box__field span') as HTMLSpanElement;
    expect(selectedItemSpan.textContent).toEqual(selectedItems.find((item) => item === 'Banana'));
  });
  it('renders helper text if supplied and the state allows it', async () => {
    const { screen, render } = await createDOM();
    const helperText = 'Optional';
    const helperDropdownId = 'helper-dropdown';
    const noHelperDropdownId = 'no-helper-dropdown';

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown helperText={helperText} id={helperDropdownId} />
          <Dropdown helperText={helperText} id={noHelperDropdownId} invalid />
        </Form>
      </CarbonRoot>
    );

    const helperTextDiv = screen.querySelector(`div.cds--dropdown#${helperDropdownId} ~ div.cds--form__helper-text`) as HTMLDivElement;
    expect(helperTextDiv.textContent).toEqual(helperText);

    const noHelperTextDiv = screen.querySelector(`div.cds--dropdown#${noHelperDropdownId} ~ div.cds--form__helper-text`) as HTMLDivElement;
    expect(noHelperTextDiv).toBeUndefined();
  });

  it('renders list box menu item objects as supplied', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'].map((label) => ({ label }));
    const selectedItem = items.find((item) => (item as { label: string }).label === 'Banana');

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} selectedItem={selectedItem} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'click');
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    expect(listBoxDiv.childElementCount).toEqual(items.length);
    const menuItems = Array.from(screen.querySelectorAll('div.cds--list-box__menu div.cds--list-box__menu-item'));
    items.forEach((item, index) => expect(menuItems[index].textContent).toEqual((item as { label: string }).label));
    expect(menuItems[1].classList.contains('cds--list-box__menu-item--active')).toBeTruthy();
  });

  it('renders list box menu item strings as supplied', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];
    const selectedItem = items.find((item) => item === 'Banana');

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} selectedItem={selectedItem} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'click');
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    expect(listBoxDiv.childElementCount).toEqual(items.length);
    const menuItems = Array.from(screen.querySelectorAll('div.cds--list-box__menu div.cds--list-box__menu-item'));
    items.forEach((item, index) => expect(menuItems[index].textContent).toEqual(item));
    expect(menuItems[1].classList.contains('cds--list-box__menu-item--active')).toBeTruthy();
  });

  it('invokes onChange callback when an item is selected with the mouse', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];
    const initialItem = items.find((item) => item === 'Banana');
    type Selected = {
      item?: Item;
    };
    const selected: Selected = {};

    const Wrapper = component$(() => {
      const selectedOption = useSignal<Item | undefined>(initialItem);
      return (
        <>
          <Form>
            <Dropdown
              items={items}
              selectedItem={selectedOption.value}
              onSelect$={async (item: Item) => {
                console.log('here', item);
                selectedOption.value = item;
                selected.item = item;
                expect(item).toEqual('Apple');
              }}
            />
          </Form>
          <span id="result">{(selectedOption.value as string) ?? '-'}</span>
        </>
      );
    });
    await render(
      <CarbonRoot>
        <Wrapper />
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'click');
    const options = screen.querySelectorAll('div.cds--list-box__menu-item');
    const resultSpan = screen.querySelector('#result');
    await userEvent(options[0], 'click');
    expect(resultSpan?.textContent).toEqual('Apple');
  });

  it('renders items with a custom itemToElement function', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    const itemClass = 'item-component';
    const ItemComponent = component$(({ item }: ItemProps) => <span class={itemClass}>{defaultItemToString(item)}</span>);

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} itemToElement={ItemComponent} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'click');
    const itemElements = Array.from(screen.querySelectorAll(`span.${itemClass}`)) as HTMLSpanElement[];
    expect(itemElements.length).toEqual(items.length);
    items.forEach((item, index) => expect(itemElements[index]?.textContent).toEqual(item));
  });

  it('renders items with supplied IDs or keys', async () => {
    const { screen, render, userEvent } = await createDOM();
    const itemsWithIds: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'].map((label) => ({ label, id: label }));
    const itemsWithKeys: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'].map((label) => ({ label, key: label }));

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={itemsWithIds} id="dropdown-with-ids" />
          <Dropdown items={itemsWithKeys} id="dropdown-with-keys" />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'click');
    const itemsWithIdsElements = Array.from(screen.querySelectorAll('#dropdown-with-ids div.cds--list-box__menu-item')) as HTMLDivElement[];
    itemsWithIds.forEach((item, index) => expect(itemsWithIdsElements[index].getAttribute('id')).toEqual((item as unknown as { id: string }).id));
    const itemsWithKeysElements = Array.from(screen.querySelectorAll('#dropdown-with-keys div.cds--list-box__menu-item')) as HTMLDivElement[];
    itemsWithKeys.forEach((item, index) => expect(itemsWithKeysElements[index].getAttribute('id')).toEqual((item as unknown as { key: string }).key));
  });

  it('opens the items menu when the Down Arrow key is pressed with the combobox having the focus', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { keyCode: KeyCodes.DownArrow, getModifierState: () => '' });
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    expect(listBoxDiv.childElementCount).toEqual(items.length);
  });
  it('opens the items menu when the Up Arrow key is pressed with the combobox having the focus', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { keyCode: KeyCodes.UpArrow, getModifierState: () => '' });
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    expect(listBoxDiv.childElementCount).toEqual(items.length);
  });

  it('opens the items menu when the Down Arrow key is pressed with the Alt modifier with the combobox having the focus', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { keyCode: KeyCodes.UpArrow, getModifierState: () => 'Alt' });
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    expect(listBoxDiv.childElementCount).toEqual(items.length);
  });

  it('opens the items menu when the Home key is pressed with the combobox having the focus, and selects the first item', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { keyCode: KeyCodes.Home, getModifierState: () => '' });
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    const first = listBoxDiv.children.item(0);
    expect(first?.classList.contains('cds--list-box__menu-item--highlighted')).toBeTruthy();
  });

  it('opens the items menu when the End key is pressed with the combobox having the focus, and selects the last item', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { keyCode: KeyCodes.End });
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    const last = listBoxDiv.children.item(listBoxDiv.childElementCount - 1);
    expect(last?.classList.contains('cds--list-box__menu-item--highlighted')).toBeTruthy();
  });

  it('opens the items menu and selects the first item that starts with a typed character', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} />
        </Form>
      </CarbonRoot>
    );

    const oldSetTimeout = setTimeout;
    //@ts-ignore
    // eslint-disable-next-line no-global-assign
    setTimeout = () => {};
    await userEvent('div.cds--list-box__field', 'keydown', { key: 'b', keyCode: 66 });
    await userEvent('div.cds--list-box__field', 'keydown', { key: 'a', keyCode: 65 });
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    const expectedItem = listBoxDiv.children.item(1);
    expect(expectedItem?.classList.contains('cds--list-box__menu-item--highlighted')).toBeTruthy();

    //@ts-ignore
    // eslint-disable-next-line no-global-assign
    setTimeout = oldSetTimeout;
  });

  it('selects the second item from the menu if the down arrow key is pressed twice', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { keyCode: KeyCodes.DownArrow, getModifierState: () => false });
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    await userEvent(listBoxDiv, 'keydown', { keyCode: KeyCodes.DownArrow, getModifierState: () => false });
    const secondItem = screen.querySelectorAll('div.cds--list-box__menu-item')?.[1];
    expect(secondItem?.classList.contains('cds--list-box__menu-item--highlighted')).toBeTruthy();
  });

  it('selects the first item from the menu if the up arrow key is pressed twice', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { keyCode: KeyCodes.UpArrow, getModifierState: () => false });
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    await userEvent(listBoxDiv, 'keydown', { keyCode: KeyCodes.UpArrow, getModifierState: () => false });
    const secondItem = screen.querySelectorAll('div.cds--list-box__menu-item')?.[0];
    expect(secondItem?.classList.contains('cds--list-box__menu-item--highlighted')).toBeTruthy();
  });

  it('selects the current option if [Alt]+[Up Arrow] is selected', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];
    type Selected = {
      item?: Item;
    };
    const selected: Selected = {};

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown
            items={items}
            onSelect$={$((item: Item) => {
              selected.item = item;
            })}
          />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { keyCode: KeyCodes.DownArrow, getModifierState: () => false });
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    await userEvent(listBoxDiv, 'keydown', { keyCode: KeyCodes.UpArrow, getModifierState: () => true });
    await userEvent(listBoxDiv, 'keydown', { keyCode: KeyCodes.UpArrow, getModifierState: () => false }); // dummy event cycle to give handler a chance to run
    const secondItem = screen.querySelectorAll('div.cds--list-box__menu-item')?.[0];
    expect(secondItem?.classList.contains('cds--list-box__menu-item--highlighted')).toBeTruthy();
  });

  it('opens the items menu and scrolls down when Page Down is pressed', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = [
      'Apple',
      'Banana',
      'Blackberry',
      'Blueberry',
      'Cherry',
      'Dragonfruit',
      'Durian',
      'Elderberry',
      'Fig',
      'Guava',
      'Huckleberry',
      'Ichigo',
      'Jackfruit',
    ].map((item) => ({ label: item }));

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} selectedItem={items.find((item) => (item as Labelled).label === 'Guava')} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { key: 'a', keyCode: 66 });
    await userEvent('div.cds--list-box__field', 'keydown', { keyCode: KeyCodes.PageDown });
    await userEvent('div.cds--list-box__field', 'keydown', { keyCode: KeyCodes.PageUp });
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    expect(listBoxDiv.childElementCount).toEqual(items.length);
  });

  it('closes the items menu when Esc is pressed', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blackberry'];

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { key: 'a', keyCode: 66 });
    await userEvent('div.cds--list-box__field', 'keydown', { keyCode: KeyCodes.Escape });
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    expect(listBoxDiv.childElementCount).toEqual(0);
  });

  it('selects the first item from the menu if Enter is pressed', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { keyCode: KeyCodes.UpArrow, getModifierState: () => false });
    const listBoxDiv = screen.querySelector('div.cds--list-box__menu') as HTMLDivElement;
    await userEvent(listBoxDiv, 'keydown', { keyCode: KeyCodes.UpArrow, getModifierState: () => false });
    await userEvent(listBoxDiv, 'keydown', { keyCode: KeyCodes.Enter });
    expect(listBoxDiv.childElementCount).toEqual(0);
  });
});
