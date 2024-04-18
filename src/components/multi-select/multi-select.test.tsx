import { describe, expect, it } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Form } from '../form/form';
import { component$, $, useSignal } from '@builder.io/qwik';
import { MultiSelect } from './multi-select';
import { defaultCompareItems$ } from './sorting';
import { Item, ItemProps, Labelled, defaultItemToString, defaultItemToString$ } from '../dropdown/dropdown';
import { Key } from '../../internal/key';
import { Button } from '../button/button';

describe('MultiSelect', () => {
  it('renders expected CSS classes per attributes', async () => {
    const { screen, render } = await createDOM();

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect invalid type="inline" disabled direction="top" />
        </Form>
      </CarbonRoot>
    );

    const listboxDiv = screen.querySelector('div.cds--multi-select__wrapper > div') as HTMLDivElement;
    expect(listboxDiv.classList.contains('cds--multi-select')).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--multi-select--invalid')).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--multi-select--warning')).toBeFalsy();
    expect(listboxDiv.classList.contains('cds--multi-select--inline')).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--multi-select--disabled')).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--list-box--up')).toBeTruthy();
  });

  it('renders custom CSS class if enabled', async () => {
    const { screen, render } = await createDOM();
    const customClass = 'custom-class';

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect class={customClass} invalid type="inline" direction="top" />
        </Form>
      </CarbonRoot>
    );

    const wrapperDiv = screen.querySelector('div.cds--multi-select__wrapper') as HTMLDivElement;
    expect(wrapperDiv.classList.contains(customClass)).toBeTruthy();
  });

  it('renders warning CSS class if in warning state', async () => {
    const { screen, render } = await createDOM();
    const multiSelectId = 'multi-select-id';

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect id={multiSelectId} warn />
        </Form>
      </CarbonRoot>
    );

    const listboxDiv = screen.querySelector(`div#${multiSelectId}`) as HTMLDivElement;
    expect(listboxDiv.classList.contains('cds--multi-select--warning')).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--multi-select--invalid')).toBeFalsy();
  });

  it('omits non-standard properties from the rendered div element', async () => {
    const { screen, render } = await createDOM();
    const multiSelectId = 'multi-select-id';
    const SelectedItemRenderComp = component$(() => <></>);
    const ItemToElementComp = component$(() => <></>);

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect
            ariaLabel="Name input"
            class="some-class"
            clearSelectionDescription="Click to clear"
            clearSelectionText="Clear items"
            compareItems$={defaultCompareItems$}
            direction="bottom"
            disabled
            helperText="Enter a name"
            hideLabel={false}
            id={multiSelectId}
            invalid
            invalidText="Invalid!"
            items={['One', 'Two']}
            itemToElement={ItemToElementComp}
            itemToString$={defaultItemToString$}
            label="Name input"
            onChange$={$(() => {})}
            onMenuChange$={$(() => {})}
            placeholder="Name"
            readOnly={false}
            renderSelectedItem={SelectedItemRenderComp}
            selectedItems={['One']}
            selectionFeedback="top"
            size="md"
            sortItems$={$(items => items)}
            translateWithId$={$((id: string) => id)}
            type="default"
            useTitleInItem={false}
            warn
            warnText="Ugly name"
            data-something="some data"
          />
        </Form>
      </CarbonRoot>
    );

    const listboxDiv = screen.querySelector(`div#${multiSelectId}`) as HTMLDivElement;
    const illegalAttrs = [
      'ariaLabel',
      'clearSelectionDescription',
      'clearSelectionText',
      'compareItems$',
      'direction',
      'disabled',
      'helperText',
      'hideLabel',
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
      'renderSelectedItem$',
      'selectedItems',
      'selectionFeedback',
      'size',
      'translateWithId$',
      'type',
      'useTitleInItem',
      'warn',
      'warnText',
    ];
    illegalAttrs.forEach(attr => expect(listboxDiv.hasAttribute(attr), `Attribute: ${attr} unexpected`).toBeFalsy());
  });

  it('renders a label with appropriate CSS classes if titleText is stipulated', async () => {
    const { screen, render } = await createDOM();
    const comboIdTitle = 'labelled-combo-id';
    const comboIdNoTitle = 'unlabelled-combo-id';
    const titleText = 'Title';

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect id={comboIdTitle} label={titleText} disabled hideLabel />
          <MultiSelect id={comboIdNoTitle} />
        </Form>
      </CarbonRoot>
    );

    const labelledDropdownLabel = screen.querySelector('div.cds--multi-select__wrapper label') as HTMLLabelElement;
    expect(labelledDropdownLabel).toBeTruthy();
    expect(labelledDropdownLabel.classList.contains('cds--label')).toBeTruthy();
    expect(labelledDropdownLabel.classList.contains('cds--label--disabled')).toBeTruthy();
    expect(labelledDropdownLabel.classList.contains('cds--visually-hidden')).toBeTruthy();

    const unlabelledDropdownLabel = screen.querySelector(`div#${comboIdNoTitle} label`) as HTMLLabelElement;
    expect(unlabelledDropdownLabel).toBeFalsy();
  });

  it('renders a ListBox with appropriate attributes', async () => {
    const { screen, render } = await createDOM();
    const comboId = 'combo-id';
    const ariaLabel = 'Aria label';
    const size = 'sm';

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect id={comboId} ariaLabel={ariaLabel} size={size} invalid warn disabled />
        </Form>
      </CarbonRoot>
    );

    const listboxDiv = screen.querySelector('div.cds--multi-select.cds--list-box') as HTMLDivElement;
    expect(listboxDiv.getAttribute('aria-label')).toEqual(ariaLabel);
    expect(listboxDiv.classList.contains(`cds--list-box--${size}`)).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--list-box--invalid')).toBeTruthy();
    expect(listboxDiv.classList.contains('cds--list-box--warning')).toBeFalsy();
    expect(listboxDiv.getAttribute('id')).toEqual(comboId);
  });

  it('renders count of selected items badge', async () => {
    const { screen, render } = await createDOM();
    const items = ['Selected item 1', 'Selected item 2', 'Item 3'].map(label => ({ label }));
    const selectedItems = [items[0], items[1]];

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect selectedItems={selectedItems} items={items} />
        </Form>
      </CarbonRoot>
    );

    const selectedItemSpan = screen.querySelector(
      'div.cds--multi-select div.cds--list-box__field--wrapper div.cds--tag--filter span.cds--tag__label'
    ) as HTMLSpanElement;
    expect(selectedItemSpan.textContent).toEqual(selectedItems.length.toString());
  });

  it('renders selected item label using a custom component function', async () => {
    const { screen, render } = await createDOM();
    const label = 'Selected item';
    const selectedObjectItem = { label };
    const selectedStringItem = label;
    const selectedItemClass = 'selected-item';
    const objectItemsCombo = 'combo-object-items';
    const stringItemsCombo = 'combo-string-items';

    const SelectedItemRenderComp = component$((props: ItemProps) => (
      <span class={selectedItemClass}>{typeof props.item === 'string' ? props.item : props.item.label}</span>
    ));

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect
            id={objectItemsCombo}
            selectedItems={[selectedObjectItem]}
            renderSelectedItem={SelectedItemRenderComp}
            items={[selectedObjectItem]}
          />
          <MultiSelect
            id={stringItemsCombo}
            selectedItems={[selectedStringItem]}
            renderSelectedItem={SelectedItemRenderComp}
            items={[selectedStringItem]}
          />
        </Form>
      </CarbonRoot>
    );

    const selectedObjectItemSpan = screen.querySelector(
      `div.cds--multi-select#${objectItemsCombo} div.cds--list-box__field span`
    ) as HTMLSpanElement;
    expect(selectedObjectItemSpan.textContent).toEqual(label);
    const selectedStringItemSpan = screen.querySelector(
      `div.cds--multi-select#${stringItemsCombo} div.cds--list-box__field span`
    ) as HTMLSpanElement;
    expect(selectedStringItemSpan.textContent).toEqual(label);
  });

  it('renders helper text if supplied and the state allows it', async () => {
    const { screen, render } = await createDOM();
    const helperText = 'Optional';
    const helperComboId = 'helper-combo';
    const noHelperComboId = 'no-helper-combo';

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect helperText={helperText} id={helperComboId} />
          <MultiSelect helperText={helperText} id={noHelperComboId} invalid />
        </Form>
      </CarbonRoot>
    );

    const helperTextDiv = screen.querySelector(
      `div.cds--multi-select#${helperComboId} ~ div.cds--form__helper-text`
    ) as HTMLDivElement;
    expect(helperTextDiv.textContent).toEqual(helperText);

    const noHelperTextDiv = screen.querySelector(
      `div.cds--multi-select#${noHelperComboId} ~ div.cds--form__helper-text`
    ) as HTMLDivElement;
    expect(noHelperTextDiv).toBeUndefined();
  });

  it('renders list box menu item objects as supplied', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'].map(label => ({
      label,
    }));
    const selectedItem = items.find(item => (item as { label: string }).label === 'Banana')!;

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} selectedItems={[selectedItem]} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'click');
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLDivElement;
    expect(listBoxDiv.childElementCount).toEqual(items.length);
    const menuItems = Array.from(screen.querySelectorAll('ul.cds--list-box__menu li.cds--list-box__menu-item'));
    items.forEach((item, index) => expect(menuItems[index].textContent).toEqual((item as { label: string }).label));
    expect(menuItems[0].classList.contains('cds--list-box__menu-item--active')).toBeTruthy(); // default sort order puts selected items first
  });

  it('renders list box menu item strings as supplied', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];
    const selectedItem = items.find(item => item === 'Banana')!;

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} selectedItems={[selectedItem]} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'click');
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLDivElement;
    expect(listBoxDiv.childElementCount).toEqual(items.length);
    const menuItems = Array.from(screen.querySelectorAll('ul.cds--list-box__menu li.cds--list-box__menu-item'));
    items.forEach((item, index) => expect(menuItems[index].textContent).toEqual(item));
    expect(menuItems[0].classList.contains('cds--list-box__menu-item--active')).toBeTruthy(); // default sort order puts selected items first
  });

  it('invokes onChange$ callback when an item is selected with the mouse', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];
    const initialItem = items.find(item => item === 'Banana');
    type Selected = {
      item?: Item;
    };
    const selected: Selected = {};

    const Wrapper = component$(() => {
      const selectedOption = useSignal<Item | undefined>(initialItem);
      return (
        <>
          <Form>
            <MultiSelect
              items={items}
              selectedItems={[selectedOption.value!]}
              onChange$={async (items: Item[], item: Item) => {
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
    const options = screen.querySelectorAll('li.cds--list-box__menu-item');
    const resultSpan = screen.querySelector('#result');
    await userEvent(options[0], 'click');
    expect(resultSpan?.textContent).toEqual('Banana');
  });

  it('renders items with a custom itemToElement function', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    const itemClass = 'item-component';
    const ItemComponent = component$(({ item }: ItemProps) => (
      <span class={itemClass}>{defaultItemToString(item)}</span>
    ));

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} itemToElement={ItemComponent} />
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
    const itemsWithIds: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'].map(
      label => ({ label, id: label })
    );
    const itemsWithKeys: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'].map(
      label => ({ label, key: label })
    );

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={itemsWithIds} id="combo-with-ids" />
          <MultiSelect items={itemsWithKeys} id="combo-with-keys" />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'click');
    const itemsWithIdsElements = Array.from(
      screen.querySelectorAll('#combo-with-ids li.cds--list-box__menu-item')
    ) as HTMLDivElement[];
    itemsWithIds.forEach((item, index) =>
      expect(itemsWithIdsElements[index].getAttribute('id')).toEqual((item as unknown as { id: string }).id)
    );
    const itemsWithKeysElements = Array.from(
      screen.querySelectorAll('#combo-with-keys li.cds--list-box__menu-item')
    ) as HTMLDivElement[];
    itemsWithKeys.forEach((item, index) =>
      expect(itemsWithKeysElements[index].getAttribute('id')).toEqual((item as unknown as { key: string }).key)
    );
  });

  it('opens the items menu when the Down Arrow key is pressed with the combobox having the focus', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { key: Key.DownArrow, getModifierState: () => '' });
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLUListElement;
    expect(listBoxDiv.childElementCount).toEqual(items.length);
  });

  it('opens the items menu when the Up Arrow key is pressed with the combobox having the focus', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { key: Key.UpArrow, getModifierState: () => '' });
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLUListElement;
    expect(listBoxDiv.childElementCount).toEqual(items.length);
  });

  it('opens the items menu when the Down Arrow key is pressed with the Alt modifier with the combobox having the focus', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', {
      key: Key.UpArrow,
      getModifierState: () => 'Alt',
    });
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLUListElement;
    expect(listBoxDiv.childElementCount).toEqual(items.length);
  });

  it('opens the items menu when the Home key is pressed with the combobox having the focus, and selects the first item', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { key: Key.Home, getModifierState: () => '' });
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLUListElement;
    const first = listBoxDiv.children.item(0);
    expect(first?.classList.contains('cds--list-box__menu-item--highlighted')).toBeTruthy();
  });

  it('opens the items menu when the End key is pressed with the combobox having the focus, and selects the last item', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { key: Key.End });
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLUListElement;
    const last = listBoxDiv.children.item(listBoxDiv.childElementCount - 1);
    expect(last?.classList.contains('cds--list-box__menu-item--highlighted')).toBeTruthy();
  });

  it('opens the items menu and selects the first item that starts with a typed character', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blackberry', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} />
        </Form>
      </CarbonRoot>
    );

    const oldSetTimeout = setTimeout;
    //@ts-ignore
    // eslint-disable-next-line no-global-assign
    setTimeout = () => {};
    await userEvent('div.cds--list-box__field', 'keydown', { key: 'b' });
    await userEvent('div.cds--list-box__field', 'keydown', { key: 'a' });
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLUListElement;
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
          <MultiSelect items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', {
      key: Key.DownArrow,
      getModifierState: () => false,
    });
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLUListElement;
    await userEvent(listBoxDiv, 'keydown', { key: Key.DownArrow, getModifierState: () => false });
    const secondItem = screen.querySelectorAll('li.cds--list-box__menu-item')?.[1];
    expect(secondItem?.classList.contains('cds--list-box__menu-item--highlighted')).toBeTruthy();
  });

  it('selects the first item from the menu if the up arrow key is pressed twice', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', {
      key: Key.UpArrow,
      getModifierState: () => false,
    });
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLUListElement;
    await userEvent(listBoxDiv, 'keydown', { key: Key.UpArrow, getModifierState: () => false });
    const secondItem = screen.querySelectorAll('li.cds--list-box__menu-item')?.[0];
    expect(secondItem?.classList.contains('cds--list-box__menu-item--highlighted')).toBeTruthy();
  });

  it('selects the second item from the menu if the down arrow is pressed twice and the up arrow key is pressed once', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', {
      key: Key.DownArrow,
      getModifierState: () => false,
    });
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLUListElement;
    await userEvent(listBoxDiv, 'keydown', { key: Key.DownArrow, getModifierState: () => false });
    await userEvent(listBoxDiv, 'keydown', { key: Key.UpArrow, getModifierState: () => false });
    const secondItem = screen.querySelectorAll('li.cds--list-box__menu-item')?.[0];
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
          <MultiSelect
            items={items}
            onChange$={$((items: Item[], item: Item) => {
              selected.item = item;
            })}
          />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', {
      key: Key.DownArrow,
      getModifierState: () => false,
    });
    const listBoxDiv = screen.querySelector('li.cds--list-box__menu') as HTMLUListElement;
    await userEvent(listBoxDiv, 'keydown', { key: Key.UpArrow, getModifierState: () => true });
    await userEvent(listBoxDiv, 'keydown', { key: Key.UpArrow, getModifierState: () => false }); // dummy event cycle to give handler a chance to run
    const secondItem = screen.querySelectorAll('li.cds--list-box__menu-item')?.[0];
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
    ].map(item => ({ label: item }));

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} selectedItems={[items.find(item => (item as Labelled).label === 'Guava')!]} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { key: 'a', keyCode: 66 });
    await userEvent('div.cds--list-box__field', 'keydown', { key: Key.PageDown });
    await userEvent('div.cds--list-box__field', 'keydown', { key: Key.PageUp });
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLUListElement;
    expect(listBoxDiv.childElementCount).toEqual(items.length);
  });

  it('closes the items menu when Escape is pressed', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blackberry'];

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--list-box__field', 'keydown', { key: 'a', keyCode: 66 });
    await userEvent('div.cds--list-box__field', 'keydown', { key: Key.Escape });
    const listBoxDiv = screen.querySelector('ul.cds--list-box__menu') as HTMLUListElement;
    expect(listBoxDiv.childElementCount).toEqual(0);
  });

  it('count badge reflects number of selected items', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} />
        </Form>
      </CarbonRoot>
    );

    let badge = screen.querySelector('div.cds--tag--filter span.cds--tag__label') as HTMLSpanElement;
    expect(badge).toBeUndefined();

    await userEvent('div.cds--list-box__field', 'keydown', { key: Key.Home, getModifierState: () => '' });
    await userEvent('ul.cds--list-box__menu li:first-of-type() span.cds--checkbox-label', 'click');

    badge = screen.querySelector('div.cds--tag--filter span.cds--tag__label') as HTMLSpanElement;
    expect(badge.textContent).toEqual('1');

    await userEvent('ul.cds--list-box__menu li:first-of-type() span.cds--checkbox-label', 'click');

    badge = screen.querySelector('div.cds--tag--filter span.cds--tag__label') as HTMLSpanElement;
    expect(badge).toBeUndefined();

    await userEvent('div.cds--list-box__field', 'keydown', { key: Key.Home, getModifierState: () => '' });
    await userEvent('ul.cds--list-box__menu li:first-of-type() span.cds--checkbox-label', 'keydown', {
      key: Key.Enter,
    });

    badge = screen.querySelector('div.cds--tag--filter span.cds--tag__label') as HTMLSpanElement;
    expect(badge.textContent).toEqual('1');

    await userEvent('div.cds--list-box__field', 'keydown', { key: Key.Home, getModifierState: () => '' });
    await userEvent('ul.cds--list-box__menu li:first-of-type() span.cds--checkbox-label', 'keydown', {
      key: Key.Enter,
    });

    badge = screen.querySelector('div.cds--tag--filter span.cds--tag__label') as HTMLSpanElement;
    expect(badge).toBeUndefined();
  });

  it('clears the selection when the list of items changes and no longer contains it', async () => {
    const { screen, render, userEvent } = await createDOM();

    await render(<MultiSelectTestWrapper />);

    await userEvent('button#change-list', 'click');

    await userEvent('div.cds--list-box__field', 'keydown', {
      key: Key.DownArrow,
      getModifierState: () => false,
    });
    const selectedItems = screen.querySelectorAll('li.cds--list-box__menu-item cds--list-box__menu-item--active');
    expect(selectedItems.length).toBe(0);
  });

  it('clears the selection when the X button is clicked on the badge', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];
    const selectedItems = items.filter(item => item === 'Apple' || item === 'Banana');

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} selectedItems={selectedItems} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--tag__close-icon', 'click');

    const badge = screen.querySelector('div.cds--tag--filter span.cds--tag__label') as HTMLSpanElement;
    expect(badge).toBeUndefined();
  });

  it('clears the selection when Enter is pressed with the X button on the badge having the focus', async () => {
    const { screen, render, userEvent } = await createDOM();
    const items: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];
    const selectedItems = items.filter(item => item === 'Apple' || item === 'Banana');

    await render(
      <CarbonRoot>
        <Form>
          <MultiSelect items={items} selectedItems={selectedItems} />
        </Form>
      </CarbonRoot>
    );

    await userEvent('div.cds--tag__close-icon', 'keydown', { key: Key.Enter });

    const badge = screen.querySelector('div.cds--tag--filter span.cds--tag__label') as HTMLSpanElement;
    expect(badge).toBeUndefined();
  });
});

/**
 * Test wrapper component for MultiSelect - to test altering the list so selectedItems are invalid
 */
const MultiSelectTestWrapper = component$(() => {
  const fruits: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];
  const newFruits = fruits.filter(fruit => fruit !== 'Cherry');
  const fruitOptions = useSignal<Item[]>(fruits);
  const selectedFruit = fruits.find(fruit => fruit === 'Cherry');
  const selectedItem = useSignal<Item | undefined>(selectedFruit);
  return (
    <>
      <CarbonRoot>
        <Form>
          <MultiSelect selectedItems={[selectedItem.value!]} items={fruitOptions.value} />
        </Form>
        <Button
          id="clear-selection"
          onClick$={() => {
            selectedItem.value = undefined;
          }}
        >
          Clear selection
        </Button>
        <Button
          id="change-list"
          onClick$={() => {
            fruitOptions.value = newFruits;
          }}
        >
          Change fruits
        </Button>
      </CarbonRoot>
    </>
  );
});
