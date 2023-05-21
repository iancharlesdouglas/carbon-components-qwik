import { describe, expect, it } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Text } from './text';
import { TextDirection } from '../../internal/contexts/text-direction-context';

describe('Text', () => {
  it('renders expected span element with expected text content and inherited text direction', async () => {
    const { screen, render } = await createDOM();
    const textContent = 'Text content';

    await render(
      <CarbonRoot>
        <Text>{textContent}</Text>
      </CarbonRoot>
    );

    const spanElement = screen.querySelector('span') as HTMLSpanElement;
    expect(spanElement.getAttribute('dir')).toEqual('auto');
    expect(spanElement.textContent).toEqual(textContent);
  });

  it('renders span element with override text direction', async () => {
    const { screen, render } = await createDOM();
    const overriddenDir: TextDirection = 'rtl';

    await render(
      <CarbonRoot>
        <Text dir={overriddenDir} id="id1">
          Content
        </Text>
      </CarbonRoot>
    );

    const spanElement = screen.querySelector('span') as HTMLSpanElement;
    expect(spanElement.getAttribute('dir')).toEqual(overriddenDir);
  });

  it('renders span element with auto text direction where the context does not provide one', async () => {
    const { screen, render } = await createDOM();

    await render(
      <CarbonRoot dir={undefined}>
        <Text>Content</Text>
      </CarbonRoot>
    );

    const spanElement = screen.querySelector('span') as HTMLSpanElement;
    expect(spanElement.getAttribute('dir')).toEqual('auto');
  });
});
