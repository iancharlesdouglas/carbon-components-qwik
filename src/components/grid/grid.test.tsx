import { describe, expect, it } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Grid } from './grid';

describe('Grid', () => {
  it('renders expected CSS classes including any custom class', async () => {
    const { screen, render } = await createDOM();
    const content = 'Some text';
    const customClass = 'a-class';

    await render(
      <CarbonRoot>
        <Grid fullWidth class={customClass}>
          {content}
        </Grid>
      </CarbonRoot>
    );

    const divElement = screen.querySelector('div') as HTMLDivElement;
    expect(divElement.textContent).toEqual(content);
    expect(divElement.classList.contains('cds--css-grid'));
    expect(divElement.classList.contains('cds--css-grid--full-width'));
    expect(divElement.classList.contains(customClass));
  });

  it('renders CSS classes for narrow and condensed independently, favoring narrow', async () => {
    const { screen, render } = await createDOM();

    await render(
      <CarbonRoot>
        <Grid narrow condensed></Grid>
      </CarbonRoot>
    );

    const divElement = screen.querySelector('div') as HTMLDivElement;
    expect(divElement.classList.contains('cds--css-grid--narrow'));
    expect(!divElement.classList.contains('cds--css-grid--condensed'));

    const { screen: screen2, render: render2 } = await createDOM();

    await render2(
      <CarbonRoot>
        <Grid condensed></Grid>
      </CarbonRoot>
    );

    const divElement2 = screen2.querySelector('div') as HTMLDivElement;
    expect(divElement2.classList.contains('cds--css-grid--condensed'));
  });

  it('renders general div attributes that may be specified', async () => {
    const { screen, render } = await createDOM();
    const id = 'test-id';

    await render(
      <CarbonRoot>
        <Grid id={id}></Grid>
      </CarbonRoot>
    );

    const divElement = screen.querySelector('div') as HTMLDivElement;
    expect(divElement.getAttribute('id')).toEqual(id);
  });
});
