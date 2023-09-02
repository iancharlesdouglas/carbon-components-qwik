import { describe, expect, it } from 'vitest';
import { Link } from './link';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Edit } from 'carbon-icons-qwik';
import { component$ } from '@builder.io/qwik';

describe('Link', () => {
  it('renders href, text content in its anchor and link CSS class', async () => {
    const { screen, render } = await createDOM();
    const url = 'github.com';
    const content = 'GitHub';

    await render(
      <CarbonRoot>
        <Link href={url}>{content}</Link>
      </CarbonRoot>
    );

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.getAttribute('href')).toEqual(url);
    expect(aElement.textContent).toEqual(content);
    expect(aElement.getAttribute('class')).toEqual('cds--link');
  });

  it('supports a custom CSS class', async () => {
    const { screen, render } = await createDOM();
    const customClass = 'custom-format';

    await render(
      <CarbonRoot>
        <Link href="x.com" class={customClass}>
          Custom text
        </Link>
      </CarbonRoot>
    );

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.classList.contains(customClass));
  });

  it('sets disabled CSS class if disabled', async () => {
    const { screen, render } = await createDOM();

    await render(
      <CarbonRoot>
        <Link href="x.com" disabled>
          X.com
        </Link>
      </CarbonRoot>
    );

    const aElement = screen.querySelector('a') as HTMLAnchorElement;

    expect(aElement.classList.contains('cds--link--disabled'));
  });

  it('sets inline CSS class if inline', async () => {
    const { screen, render } = await createDOM();

    await render(
      <CarbonRoot>
        <Link inline>Link text</Link>
      </CarbonRoot>
    );

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.classList.contains('cds--link--inline'));
  });

  it('sets visited CSS class if visited (with custom CarbonApp prefix)', async () => {
    const { screen, render } = await createDOM();
    const prefix = 'pre';

    await render(
      <CarbonRoot prefix={prefix}>
        <Link visited>Link text</Link>
      </CarbonRoot>
    );

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.classList.contains(`${prefix}--link--visited`));
  });

  it('sets the appropriate CSS class per the size', async () => {
    const { screen, render } = await createDOM();
    const size = 'lg';

    await render(
      <CarbonRoot>
        <Link size={size}>Link text</Link>
      </CarbonRoot>
    );

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.classList.contains(`$cds--link--${size}`));
  });

  it("sets the default size to 'md'", async () => {
    const { screen, render } = await createDOM();
    const defaultSize = 'md';
    await render(
      <CarbonRoot>
        <Link>Link text</Link>
      </CarbonRoot>
    );

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.classList.contains(`$cds--link--${defaultSize}`));
  });

  it('adds rel="noopener" if target="_blank"', async () => {
    const { screen, render } = await createDOM();

    await render(
      <CarbonRoot>
        <Link href="x.com" target="_blank">
          Link text
        </Link>
      </CarbonRoot>
    );

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.hasAttribute('rel'));
    expect(aElement.getAttribute('rel')).toEqual('noopener');
  });

  it('disables anchor when disabled', async () => {
    const { screen, render } = await createDOM();

    await render(
      <CarbonRoot>
        <Link href="x.com" disabled>
          Custom text
        </Link>
      </CarbonRoot>
    );

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.click).toThrowError();
  });

  it('renders an "id" attribute onto the anchor element', async () => {
    const { screen, render } = await createDOM();
    const editComponent = component$(() => <Edit />);

    await render(
      <CarbonRoot>
        <Link id="1" renderIcon={editComponent}>
          Link text
        </Link>
      </CarbonRoot>
    );

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.getAttribute('id')).toEqual('1');
  });

  it('removes inapplicable props from the rendered anchor element', async () => {
    const { screen, render } = await createDOM();
    const editComponent = component$(() => <Edit />);
    await render(
      <CarbonRoot>
        <Link renderIcon={editComponent} size="sm" inline>
          Click here
        </Link>
      </CarbonRoot>
    );

    const aElement = screen.querySelector('a') as HTMLAnchorElement;
    expect(aElement.hasAttribute('renderIcon')).toBeFalsy();
    expect(aElement.hasAttribute('size')).toBeFalsy();
    expect(aElement.hasAttribute('inline')).toBeFalsy();
  });
});
