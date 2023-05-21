import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  it('renders default CSS classes and custom CSS class', async () => {
    const { screen, render } = await createDOM();
    const customClass = 'custom-class';

    await render(
      <CarbonRoot>
        <Checkbox class={customClass} />
      </CarbonRoot>
    );

    const inputElement = screen.querySelector('input') as HTMLInputElement;
    expect(inputElement.classList.contains('cds--checkbox')).toBeTruthy();
    // label
    // label text
    // checkbox wrapper
  });
});
