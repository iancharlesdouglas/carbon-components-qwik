import { describe, expect, it } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { FluidForm } from './fluid-form';

describe('Form', () => {
  it('renders expected DOM element with expected class attribute', async () => {
    const { screen, render } = await createDOM();
    const customClass = 'custom-class';

    await render(
      <CarbonRoot>
        <FluidForm class={customClass}>Content</FluidForm>
      </CarbonRoot>
    );

    const formElement = screen.querySelector('form') as HTMLFormElement;
    expect(formElement.getAttribute('class')).toContain('cds--form--fluid');
    expect(formElement.getAttribute('class')).toContain(customClass);
  });
});
