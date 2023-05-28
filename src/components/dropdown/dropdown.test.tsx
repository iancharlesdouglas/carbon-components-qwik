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
            scale="md"
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
      'scale',
      'selectedItem',
      'titleText',
      'translateWithId',
      'type',
      'warn',
      'warnText',
    ];
    illegalAttrs.forEach((attr) => expect(divElement.hasAttribute(attr), `Attribute: ${attr} unexpected`).toBeFalsy());
  });
});
