import {describe, expect, it} from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Edit } from 'carbon-icons-qwik';
import { Button, ButtonKind, ButtonSize } from './button';

describe('Button', () => {
  it('renders text content and button CSS class, medium size class and primary state class', async () => {
    const {screen, render} = await createDOM();
    const content = 'GitHub';

    await render(<CarbonRoot><Button>{content}</Button></CarbonRoot>);
    
    const btnElement = screen.querySelector('button') as HTMLButtonElement;
    expect(btnElement.textContent).toEqual(content);
    const expectedClasses = ['cds--btn', 'cds--btn--md', 'cds--btn--primary'];
    expectedClasses.forEach(className => (expect(btnElement.classList.contains(className))));
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

    await render(<CarbonRoot><Button disabled>Disabled</Button></CarbonRoot>);

    const btnElement = screen.querySelector('button') as HTMLButtonElement;
    expect(btnElement.classList.contains('cds--link--disabled'));
  });

  it('sets the appropriate CSS class for the stipulated size', async () => {
    const sizes = ['sm', 'md', 'lg', 'xl', '2xl'].map(size => size as ButtonSize);

    sizes.forEach(async (size: ButtonSize) => {
      const {screen, render} = await createDOM();

      await render(<CarbonRoot><Button size={size}>{size} Button</Button></CarbonRoot>);

      const btnElement = screen.querySelector('button') as HTMLButtonElement;
      expect(btnElement.classList.contains(`cds--btn--${size}`));
      });
  });

  it('sets the appropriate CSS class for the stipulated kind', async () => {
    const kinds = ['primary', 'secondary', 'tertiary', 'danger', 'danger--primary', 'danger--secondary', 'danger--tertiary', 'ghost']
      .map(kind => kind as ButtonKind);

    kinds.forEach(async (kind: ButtonKind) => {
      const {screen, render} = await createDOM();

      await render(<CarbonRoot><Button kind={kind}>{kind} Button</Button></CarbonRoot>);

      const btnElement = screen.querySelector('button') as HTMLButtonElement;
      expect(btnElement.classList.contains(`cds--btn--${kind}`));
      });
  });

  it('sets the appropriate CSS class/es if isExpressive is stipulated, including suppression of certain sizes', async () => {
    const {screen, render} = await createDOM();

    await render(<CarbonRoot>
      <Button id="expr" isExpressive>Expressive</Button>
      <Button id="sm" isExpressive size="sm">Small</Button>
      <Button id="md" isExpressive size="md">Small</Button>
      <Button id="lg" isExpressive size="lg">Small</Button>
    </CarbonRoot>);

    const btnExpr = screen.querySelector('button#expr') as HTMLButtonElement;
    expect(btnExpr.classList.contains('cds--btn--expressive'));
    const btnSm = screen.querySelector('button#sm') as HTMLButtonElement;
    expect(!btnSm.classList.contains('cds--btn--sm'));
    const btnMd = screen.querySelector('button#md') as HTMLButtonElement;
    expect(!btnMd.classList.contains('cds--btn--md'));
    const btnLg = screen.querySelector('button#lg') as HTMLButtonElement;
    expect(!btnLg.classList.contains('cds--btn--lg'));
  });

  it('sets the appropriate CSS class/es and attributes if hasIconOnly (that has been selected) has been stipulated', async () => {
    const {screen, render} = await createDOM();

    await render(<CarbonRoot><Button hasIconOnly renderIcon={Edit} isSelected kind="ghost"></Button></CarbonRoot>);

    const btnElement = screen.querySelector('button') as HTMLButtonElement;
    expect(btnElement.classList.contains('cds--btn--icon-only'));
    expect(btnElement.classList.contains('cds--btn--selected'));  
    expect(btnElement.getAttribute('aria-pressed')).toEqual('true');
  });

  it('renders an anchor if the href attribute has been set', async () => {
    const {screen, render} = await createDOM();
    const expectedHref = 'https://x.com';

    await render(<CarbonRoot><Button href={expectedHref}>Link</Button></CarbonRoot>);

    const btnElement = screen.querySelector('button') as HTMLButtonElement;
    expect(btnElement).toBeFalsy();
    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.getAttribute('href')).toEqual(expectedHref);
  });
});