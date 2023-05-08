import {describe, expect, it} from 'vitest';
import { Link } from './link';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonApp } from '../carbon-app/carbon-app';
import { Edit } from 'carbon-icons-qwik';

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

    await render(<CarbonApp><Link href="x.com" disabled>X.com</Link></CarbonApp>);

    const aElement = screen.querySelector('a') as HTMLAnchorElement;

    expect(aElement.classList.contains('cds--link--disabled'));
  });

  it('sets inline CSS class if inline', async () => {
    const {screen, render} = await createDOM();

    await render(<CarbonApp><Link inline>Link text</Link></CarbonApp>);

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.classList.contains('cds--link--inline'));
  })

  it('sets visited CSS class if visited (with custom CarbonApp prefix)', async () => {
    const {screen, render} = await createDOM();
    const prefix = 'pre';

    await render(<CarbonApp prefix={prefix}><Link visited>Link text</Link></CarbonApp>);

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.classList.contains(`${prefix}--link--visited`));
  });

  it('sets the appropriate CSS class per the size', async () => {
    const {screen, render} = await createDOM();
    const size = 'lg';

    await render(<CarbonApp><Link size={size}>Link text</Link></CarbonApp>);

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.classList.contains(`$cds--link--${size}`));
  });

  it('sets the default size to \'md\'', async () => {
    const {screen, render} = await createDOM();
    const defaultSize = 'md';
    await render(<CarbonApp><Link>Link text</Link></CarbonApp>);

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.classList.contains(`$cds--link--${defaultSize}`));
  });

  it('adds rel="noopener" if target="_blank"', async () => {
    const {screen, render} = await createDOM();

    await render(<CarbonApp><Link href="x.com" target="_blank">Link text</Link></CarbonApp>);

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.hasAttribute('rel'));
    expect(aElement.getAttribute('rel')).toEqual('noopener');
  });

  it('disables anchor when disabled', async () => {
    const {screen, render} = await createDOM();

    await render(<CarbonApp><Link href="x.com" disabled>Custom text</Link></CarbonApp>);

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.click).toThrowError();
  });

  it('renders an "id" attribute onto the anchor element', async () => {
    const {screen, render} = await createDOM();

    await render(<CarbonApp><Link id="1">Link text</Link></CarbonApp>);

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.getAttribute('id')).toEqual('1');
  });

  it('renders a supplied icon within the anchor element', async () => {
    const {screen, render} = await createDOM();
    const expectedIconId = 'edit_icon';

    await render(<CarbonApp><Link renderIcon>Link Text<Edit id={expectedIconId} /></Link></CarbonApp>);

    const iconElement = screen.querySelector(`a > svg#${expectedIconId}`) as SVGSVGElement;
    expect(iconElement.getAttribute('id')).toEqual(expectedIconId);
  });
});