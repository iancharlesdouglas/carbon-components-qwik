import {describe, expect, it} from 'vitest';
import { Link } from './link';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonApp } from '../carbon-app/carbon-app';

describe('Link', () => {
  it('renders href, text content in its anchor and link CSS class', async () => {
    const {screen, render} = await createDOM();
    const url = 'github.com';
    const content = 'GitHub';

    await render(<CarbonApp><Link href={url}>{content}</Link></CarbonApp>);
    
    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.getAttribute('href')).toEqual(url);
    expect(aElement.textContent).toEqual(content);
    expect(aElement.getAttribute('class')).toEqual('cds--link');
  });

  it('supports a custom CSS class', async () => {
    const {screen, render} = await createDOM();
    const customClass = 'custom-format';

    await render(<CarbonApp><Link href="x.com" class={customClass}>Custom text</Link></CarbonApp>);

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.classList.contains(customClass));
  });

  it('sets disabled CSS class if disabled', async () => {
    const {screen, render} = await createDOM();

    await render(<CarbonApp><Link href="x.com" disabled>X.com</Link></CarbonApp>)

    const aElement = screen.querySelector('a') as HTMLAnchorElement;

    expect(aElement.classList.contains('cds--link--disabled'));
  });

  it('sets inline CSS class if inline', async () => {
    const {screen, render} = await createDOM();

    await render(<CarbonApp><Link href="x.com" inline>Custom text</Link></CarbonApp>);

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.classList.contains('cds--link--inline'));
  })

  it('sets visited CSS class if visited (with custom CarbonApp prefix)', async () => {
    const {screen, render} = await createDOM();
    const prefix = 'pre';

    await render(<CarbonApp prefix={prefix}><Link href="x.com" visited>Custom text</Link></CarbonApp>)

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.classList.contains(`${prefix}--link--visited`));
  });

  it('adds rel="noopener" if target="_blank"', async () => {
    const {screen, render} = await createDOM();

    await render(<CarbonApp><Link href="x.com" target="_blank">Custom text</Link></CarbonApp>)

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.hasAttribute('rel'));
    expect(aElement.getAttribute('rel')).toEqual('noopener');
  });
});