import {describe, expect, it} from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Edit } from 'carbon-icons-qwik';
import { Button } from './button';

describe('Button', () => {
  it('renders text content and button CSS class, medium size class and primary state class', async () => {
    const {screen, render} = await createDOM();
    const content = 'GitHub';

    await render(<CarbonRoot><Button>{content}</Button></CarbonRoot>);
    
    const btnElement = screen.querySelector('button') as HTMLButtonElement;
    expect(btnElement.textContent).toEqual(content);
    expect(btnElement.getAttribute('class')).toEqual('cds--btn cds--btn--md cds--btn--primary');
  });

  it('supports a custom CSS class', async () => {
    const {screen, render} = await createDOM();
    const customClass = 'custom-format';

    await render(<CarbonRoot><Button class={customClass}>Custom text</Button></CarbonRoot>);

    const btnElement = screen.querySelector('button') as HTMLButtonElement;
    expect(btnElement.classList.contains(customClass));
  });

  it('sets disabled CSS class if disabled', async () => {
    const {screen, render} = await createDOM();

    await render(<CarbonRoot><Button disabled>X.com</Button></CarbonRoot>);

    const btnElement = screen.querySelector('button') as HTMLButtonElement;
    expect(btnElement.classList.contains('cds--link--disabled'));
  });

  // test - sizes

  // test - expressive

  // test - hasIconOnly

  // test - href and anchor
});