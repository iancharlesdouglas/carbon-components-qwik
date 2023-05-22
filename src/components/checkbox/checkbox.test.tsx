import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders default CSS classes and custom CSS class', async () => {
    const { screen, render } = await createDOM();
    const customClass = 'custom-class';
    const labelText = 'Label';

    await render(
      <CarbonRoot>
        <Checkbox class={customClass} labelText={labelText} />
      </CarbonRoot>
    );

    const inputElement = screen.querySelector('input') as HTMLInputElement;
    expect(inputElement.classList.contains('cds--checkbox')).toBeTruthy();

    const wrapperElement = screen.querySelector('div:has(input)') as HTMLDivElement;
    expect(wrapperElement.classList.contains('cds--checkbox-wrapper')).toBeTruthy();
    expect(wrapperElement.classList.contains(customClass)).toBeTruthy();

    const labelElement = screen.querySelector('input+label') as HTMLLabelElement;
    expect(labelElement.classList.contains('cds--checkbox-label')).toBeTruthy();

    const labelTextElement = screen.querySelector('input+label>span') as HTMLSpanElement;
    expect(labelTextElement.classList.contains('cds--checkbox-label-text')).toBeTruthy();
    expect(labelTextElement.textContent).toEqual(labelText);
  });

  it('decorates the label with appropriate CSS class when the label is hidden', async () => {
    const { screen, render } = await createDOM();
    const labelText = 'Label';

    await render(
      <CarbonRoot>
        <Checkbox labelText={labelText} hideLabel />
      </CarbonRoot>
    );

    const labelTextElement = screen.querySelector('input+label>span') as HTMLSpanElement;
    expect(labelTextElement.classList.contains('cds--visually-hidden')).toBeTruthy();
  });

  it('automatically generates an ID if none is provided, so the input and label elements are functionally linked', async () => {
    const { screen, render } = await createDOM();

    await render(
      <CarbonRoot>
        <Checkbox labelText="Check me" />
      </CarbonRoot>
    );

    const inputElement = screen.querySelector('input') as HTMLInputElement;
    expect(inputElement.getAttribute('id')).toBeTruthy();

    const labelElement = screen.querySelector('input+label') as HTMLLabelElement;
    expect(labelElement.getAttribute('for')).toBeTruthy();
  });
});
