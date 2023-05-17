import { describe, expect, it } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { Theme, ThemeCode } from './theme';
import { CarbonRoot } from '../carbon-root/carbon-root';

describe('Theme', () => {
  it('renders the selected theme class plus any custom class and the child content to a div element', async () => {
    const { screen, render } = await createDOM();
    const selectedTheme: ThemeCode = 'g100';
    const customClass = 'custom-class';
    const childContent = 'Child content';
    const childContentId = 'child-content-id';

    await render(
      <CarbonRoot>
        <Theme theme={selectedTheme} class={customClass}>
          <div id={childContentId}>{childContent}</div>
        </Theme>
      </CarbonRoot>
    );

    const divElement = screen.querySelector('div') as HTMLDivElement;
    expect(divElement.classList.contains(customClass)).toBeTruthy();
    expect(divElement.classList.contains(`cds--${selectedTheme}`)).toBeTruthy();
    const childContentDiv = screen.querySelector(`div#${childContentId}`) as HTMLDivElement;
    expect(childContentDiv.textContent).toEqual(childContent);
  });
});
