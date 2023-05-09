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
});