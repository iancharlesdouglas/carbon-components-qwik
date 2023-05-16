import { describe, expect, it } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Form } from './form';

describe('Form', () => {
  it('renders expected DOM element with expected class attribute', async () => {
    const { screen, render } = await createDOM();
    const customClass = 'custom-class';

    await render(
      <CarbonRoot>
        <Form class={customClass}>Content</Form>
      </CarbonRoot>
    );

    const formElement = screen.querySelector('form') as HTMLFormElement;
    expect(formElement.getAttribute('class')).toContain('cds--form');
    expect(formElement.getAttribute('class')).toContain(customClass);
  });
});
