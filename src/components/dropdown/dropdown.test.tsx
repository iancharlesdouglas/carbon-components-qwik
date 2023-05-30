import { describe, expect, it } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Form } from '../form/form';
import { Dropdown } from './dropdown';

describe('Dropdown', () => {
  it('renders expected CSS classes per attributes', async () => {
    const { screen, render } = await createDOM();
    const customClass = 'custom-class';
    const dropdownId = 'dropdown-id';

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown id={dropdownId} class={customClass} invalid type="inline" disabled direction="top" />
        </Form>
      </CarbonRoot>
    );

    const divElement = screen.querySelector(`div#${dropdownId}`) as HTMLDivElement;
    expect(divElement.classList.contains('cds--dropdown')).toBeTruthy();
    expect(divElement.classList.contains('cds--dropdown--invalid')).toBeTruthy();
    expect(divElement.classList.contains('cds--dropdown--warning')).toBeFalsy();
    expect(divElement.classList.contains('cds--dropdown--inline')).toBeTruthy();
    expect(divElement.classList.contains('cds--dropdown--disabled')).toBeTruthy();
    expect(divElement.classList.contains('cds--list-box--up')).toBeTruthy();
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

    const divElement = screen.querySelector(`div#${dropdownId}`) as HTMLDivElement;
    expect(divElement.classList.contains('cds--dropdown--warning')).toBeTruthy();
    expect(divElement.classList.contains('cds--dropdown--invalid')).toBeFalsy();
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

    const divElement = screen.querySelector(`div#${dropdownId}`) as HTMLDivElement;
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
    illegalAttrs.forEach((attr) => expect(divElement.hasAttribute(attr), `Attribute: ${attr} unexpected`).toBeFalsy());
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

    const labelledDropdownLabel = screen.querySelector(`div#${dropdownIdTitle} label`) as HTMLLabelElement;
    expect(labelledDropdownLabel).toBeTruthy();
    expect(labelledDropdownLabel.classList.contains('cds--label')).toBeTruthy();
    expect(labelledDropdownLabel.classList.contains('cds--label--disabled')).toBeTruthy();
    expect(labelledDropdownLabel.classList.contains('cds--visually-hidden')).toBeTruthy();

    const unlabelledDropdownLabel = screen.querySelector(`div#${dropdownIdNoTitle} label`) as HTMLLabelElement;
    expect(unlabelledDropdownLabel).toBeFalsy();
  });

  it('renders a ListBox with appropriate attributes', async () => {
    const { screen, render } = await createDOM();
    const customClass = 'custom-class';
    const dropdownId = 'dropdown-id';
    const ariaLabel = 'Aria label';
    const size = 'sm';

    await render(
      <CarbonRoot>
        <Form>
          <Dropdown id={dropdownId} class={customClass} ariaLabel={ariaLabel} size={size} invalid warn disabled />
        </Form>
      </CarbonRoot>
    );

    const divElement = screen.querySelector('div.cds--dropdown div.cds--list-box') as HTMLDivElement;
    expect(divElement.getAttribute('aria-label')).toEqual(ariaLabel);
    expect(divElement.classList.contains(`cds--list-box--${size}`)).toBeTruthy();
    expect(divElement.classList.contains('cds--list-box--invalid')).toBeTruthy();
    expect(divElement.classList.contains('cds--list-box--warning')).toBeFalsy();
    expect(divElement.getAttribute('id')).toEqual(dropdownId);
  });
});
