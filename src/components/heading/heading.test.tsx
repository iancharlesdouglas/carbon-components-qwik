import { describe, expect, it } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Section } from './section';
import { Heading } from './heading';

describe('Heading', () => {
  it('renders headings at the appropriate levels', async () => {
    const { screen, render } = await createDOM();
    const headings = ['Heading Level 1', 'Heading Level 2', 'Heading Level 3'];

    await render(
      <CarbonRoot>
        <Section>
          <Heading text={headings[0]} />
          <Section>
            <Heading text={headings[1]} />
            <Section>
              <Heading text={headings[2]} />
            </Section>
          </Section>
        </Section>
      </CarbonRoot>
    );

    for (let level = 0; level < headings.length; level++) {
      const hElement = screen.querySelector(`h${level + 1}`) as HTMLHeadingElement;
      expect(hElement.textContent).toEqual(headings[level]);
    }
  });
});
