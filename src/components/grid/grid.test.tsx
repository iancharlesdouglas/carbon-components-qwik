import { describe, expect, it } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Grid } from './grid';
import { Row } from './row';
import { Column } from './column';

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

  it('renders a row with the expected CSS classes', async () => {
    const { screen, render } = await createDOM();
    const id = 'test-id';
    const rowWithoutModifiersId = 'row-no-modif';
    const rowClass = 'row-class';
    const rowText = 'Row text';

    await render(
      <CarbonRoot>
        <Grid>
          <Row class={rowClass} condensed narrow id={id}>
            {rowText}
          </Row>
          <Row id={rowWithoutModifiersId} />
        </Grid>
      </CarbonRoot>
    );

    const rowDiv = screen.querySelector(`div#${id}`) as HTMLDivElement;
    expect(rowDiv.classList.contains('cds--row')).toBeTruthy();
    expect(rowDiv.classList.contains('cds--row--condensed')).toBeTruthy();
    expect(rowDiv.classList.contains('cds--row--narrow')).toBeTruthy();
    expect(rowDiv.classList.contains(rowClass)).toBeTruthy();
    const rowDivWithoutModifs = screen.querySelector(`div#${rowWithoutModifiersId}`) as HTMLDivElement;
    expect(rowDivWithoutModifs.classList.contains('cds--row--condensed')).toBeFalsy();
    expect(rowDivWithoutModifs.classList.contains('cds--row--narrow')).toBeFalsy();
  });

  it('renders columns with auto breakpoints', async () => {
    const { screen, render } = await createDOM();
    const columnId = 'column-id';

    await render(
      <CarbonRoot>
        <Grid>
          <Column sm md lg xlg max id={columnId}></Column>
        </Grid>
      </CarbonRoot>
    );

    const colDiv = screen.querySelector(`div#${columnId}`) as HTMLDivElement;
    expect(colDiv.classList.contains('cds--css-grid-column')).toBeTruthy();
    expect(colDiv.classList.contains('cds--sm:col-span-auto')).toBeTruthy();
    expect(colDiv.classList.contains('cds--md:col-span-auto')).toBeTruthy();
    expect(colDiv.classList.contains('cds--lg:col-span-auto')).toBeTruthy();
    expect(colDiv.classList.contains('cds--xlg:col-span-auto')).toBeTruthy();
    expect(colDiv.classList.contains('cds--max:col-span-auto')).toBeTruthy();
  });

  it('renders columns with percentage breakpoints', async () => {
    const { screen, render } = await createDOM();
    const columnId = 'column-id';
    const pct = 25;
    const perc = `${pct}%`;

    await render(
      <CarbonRoot>
        <Grid>
          <Column sm={perc} md={perc} lg={perc} xlg={perc} max={perc} id={columnId}></Column>
        </Grid>
      </CarbonRoot>
    );

    const colDiv = screen.querySelector(`div#${columnId}`) as HTMLDivElement;
    expect(colDiv.classList.contains(`cds--sm:col-span-${pct}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--md:col-span-${pct}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--lg:col-span-${pct}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--xlg:col-span-${pct}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--max:col-span-${pct}`)).toBeTruthy();
  });

  it('renders columns with numeric breakpoints', async () => {
    const { screen, render } = await createDOM();
    const columnId = 'column-id';
    const sm = 1;
    const md = 2;
    const lg = 4;
    const xlg = 8;
    const max = 16;

    await render(
      <CarbonRoot>
        <Grid>
          <Column sm={sm} md={md} lg={lg} xlg={xlg} max={max} id={columnId}></Column>
        </Grid>
      </CarbonRoot>
    );

    const colDiv = screen.querySelector(`div#${columnId}`) as HTMLDivElement;
    expect(colDiv.classList.contains(`cds--sm:col-span-${sm}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--md:col-span-${md}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--lg:col-span-${lg}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--xlg:col-span-${xlg}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--max:col-span-${max}`)).toBeTruthy();
  });

  it('renders columns with span (numeric) and offset breakpoints', async () => {
    const { screen, render } = await createDOM();
    const columnId = 'column-id';
    const span = 2;
    const offset = 1;
    const spanOffset = { span, offset };

    await render(
      <CarbonRoot>
        <Grid>
          <Column sm={spanOffset} md={spanOffset} lg={spanOffset} xlg={spanOffset} max={spanOffset} id={columnId}></Column>
        </Grid>
      </CarbonRoot>
    );

    const colDiv = screen.querySelector(`div#${columnId}`) as HTMLDivElement;
    expect(colDiv.classList.contains(`cds--sm:col-span-${span}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--md:col-span-${span}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--lg:col-span-${span}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--xlg:col-span-${span}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--max:col-span-${span}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--sm:col-start-${offset + 1}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--md:col-start-${offset + 1}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--lg:col-start-${offset + 1}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--xlg:col-start-${offset + 1}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--max:col-start-${offset + 1}`)).toBeTruthy();
  });

  it('renders columns with span (percentage) breakpoints', async () => {
    const { screen, render } = await createDOM();
    const columnId = 'column-id';
    const span = 25;
    const spanDef = { span: `${span}%` };

    await render(
      <CarbonRoot>
        <Grid>
          <Column sm={spanDef} md={spanDef} lg={spanDef} xlg={spanDef} max={spanDef} id={columnId}></Column>
        </Grid>
      </CarbonRoot>
    );

    const colDiv = screen.querySelector(`div#${columnId}`) as HTMLDivElement;
    expect(colDiv.classList.contains(`cds--sm:col-span-${span}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--md:col-span-${span}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--lg:col-span-${span}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--xlg:col-span-${span}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--max:col-span-${span}`)).toBeTruthy();
  });

  it('renders columns with span start and end breakpoints', async () => {
    const { screen, render } = await createDOM();
    const columnId = 'column-id';
    const start = 2;
    const end = 1;
    const startEnd = { start, end };

    await render(
      <CarbonRoot>
        <Grid>
          <Column sm={startEnd} md={startEnd} lg={startEnd} xlg={startEnd} max={startEnd} id={columnId}></Column>
        </Grid>
      </CarbonRoot>
    );

    const colDiv = screen.querySelector(`div#${columnId}`) as HTMLDivElement;
    expect(colDiv.classList.contains(`cds--sm:col-start-${start}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--md:col-start-${start}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--lg:col-start-${start}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--xlg:col-start-${start}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--max:col-start-${start}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--sm:col-end-${end}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--md:col-end-${end}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--lg:col-end-${end}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--xlg:col-end-${end}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--max:col-end-${end}`)).toBeTruthy();
  });

  it('renders columns with span (object) attributes', async () => {
    const { screen, render } = await createDOM();
    const columnId = 'column-id';
    const start = 2;
    const end = 1;
    const span = 2;
    const spanDef = { start, end, span };

    await render(
      <CarbonRoot>
        <Grid>
          <Column span={spanDef} id={columnId}></Column>
        </Grid>
      </CarbonRoot>
    );

    const colDiv = screen.querySelector(`div#${columnId}`) as HTMLDivElement;
    expect(colDiv.classList.contains(`cds--col-start-${start}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--col-end-${end}`)).toBeTruthy();
    expect(colDiv.classList.contains(`cds--col-span-${span}`)).toBeTruthy();
  });

  it('renders columns with span (numeric/string) attributes', async () => {
    const { screen, render } = await createDOM();
    const column1Id = 'column-1-id';
    const column2Id = 'column-2-id';
    const numericSpan = 2;
    const stringSpan = '2';

    await render(
      <CarbonRoot>
        <Grid>
          <Column span={numericSpan} id={column1Id}></Column>
          <Column span={stringSpan} id={column2Id}></Column>
        </Grid>
      </CarbonRoot>
    );

    const col1Div = screen.querySelector(`div#${column1Id}`) as HTMLDivElement;
    expect(col1Div.classList.contains(`cds--col-span-${numericSpan}`)).toBeTruthy();
    const col2Div = screen.querySelector(`div#${column2Id}`) as HTMLDivElement;
    expect(col2Div.classList.contains(`cds--col-span-${stringSpan}`)).toBeTruthy();
  });
});
