import { describe, expect, it } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Form } from '../form/form';
import { Dropdown, RenderSelectedItemProps } from './dropdown';
import { component$ } from '@builder.io/qwik';

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
          <Dropdown selectedItem={selectedItem} />
        </Form>
      </CarbonRoot>
    );

    const selectedItemSpan = screen.querySelector('div.cds--dropdown button span') as HTMLSpanElement;
    expect(selectedItemSpan.textContent).toEqual(label);
  });

  it('renders selected item label using a custom component function', async () => {
    const { screen, render } = await createDOM();
    const label = 'Selected item';
    const selectedItem = { label };
    const selectedItemClass = 'selected-item';

    const SelectedItemRenderComp = component$((props: RenderSelectedItemProps) => (
      <span class={selectedItemClass}>{typeof props.item === 'string' ? props.item : props.item.label}</span>
    ));

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown selectedItem={selectedItem} renderSelectedItem={SelectedItemRenderComp} />
        </Form>
      </CarbonRoot>
    );

    const selectedItemSpan = screen.querySelector('div.cds--dropdown button span') as HTMLSpanElement;
    expect(selectedItemSpan.textContent).toEqual(label);
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
});
