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
    expect(divElement.classList.contains('cds--css-grid')).toBeTruthy();
    expect(divElement.classList.contains('cds--css-grid--full-width')).toBeTruthy();
    expect(divElement.classList.contains(customClass)).toBeTruthy();
  });

  it('renders a sub-grid with expected CSS classes including any custom class', async () => {
    const { screen, render } = await createDOM();
    const content = 'Some sub-grid text';
    const customClass = 'a-subgrid-class';
    const subGridId = 'subgrid';

    await render(
      <CarbonRoot>
        <Grid>
          <Grid class={customClass} id={subGridId}>
            {content}
          </Grid>
        </Grid>
      </CarbonRoot>
    );

    const divElement = screen.querySelector(`div#${subGridId}`) as HTMLDivElement;
    expect(divElement.textContent).toEqual(content);
    expect(divElement.classList.contains('cds--subgrid')).toBeTruthy();
    expect(divElement.classList.contains('cds--subgrid--wide')).toBeTruthy();
    expect(divElement.classList.contains(customClass)).toBeTruthy();
  });

  it('renders CSS classes for narrow and condensed independently, favoring narrow, including for the sub-grid', async () => {
    const { screen, render } = await createDOM();
    const mainGridId = 'main-grid';
    const subGridId = 'sub-grid';

    await render(
      <CarbonRoot>
        <Grid narrow condensed id={mainGridId}>
          <Grid id={subGridId}></Grid>
        </Grid>
      </CarbonRoot>
    );

    const mainDivElement = screen.querySelector(`div#${mainGridId}`) as HTMLDivElement;
    expect(mainDivElement.classList.contains('cds--css-grid--narrow')).toBeTruthy();
    expect(!mainDivElement.classList.contains('cds--css-grid--condensed')).toBeTruthy();
    const subDivElement = screen.querySelector(`div#${subGridId}`) as HTMLDivElement;
    expect(subDivElement.classList.contains('cds--subgrid--narrow')).toBeTruthy();
    expect(!subDivElement.classList.contains('cds--subgrid--condensed')).toBeTruthy();

    const { screen: screen2, render: render2 } = await createDOM();

    await render2(
      <CarbonRoot>
        <Grid id={mainGridId} condensed>
          <Grid id={subGridId}></Grid>
        </Grid>
      </CarbonRoot>
    );

    const mainDivElement2 = screen2.querySelector(`div#${mainGridId}`) as HTMLDivElement;
    expect(mainDivElement2.classList.contains('cds--css-grid--condensed')).toBeTruthy();
    const subDivElement2 = screen2.querySelector(`div#${subGridId}`) as HTMLDivElement;
    expect(subDivElement2.classList.contains('cds--subgrid--condensed')).toBeTruthy();
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
