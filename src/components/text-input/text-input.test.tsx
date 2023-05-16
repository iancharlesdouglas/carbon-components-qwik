import { createDOM } from '@builder.io/qwik/testing';
import { describe, expect, it } from 'vitest';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { TextInput } from './text-input';
import { Form } from '../form/form';

describe('TextInput', () => {
  it('renders default CSS class, custom CSS class, invalid and warning classes and size class as stipulated', async () => {
    const { screen, render } = await createDOM();
    const customClass = 'custom-class';

    await render(
      <CarbonRoot>
        <Form>
          <TextInput class={customClass} invalid warn />
        </Form>
      </CarbonRoot>
    );

    const inputElement = screen.querySelectorAll('input')[0] as HTMLInputElement;
    const expectedClasses = ['cds--text-input', 'cds--text-input--md', 'cds--text-input--invalid', 'cds--text-input--warning'];
    expectedClasses.forEach((className) => expect(inputElement.classList.contains(className)));
  });

  it('removes non-standard properties from rendered input element if supplied', async () => {
    const { screen, render } = await createDOM();
    const nonStdProps = [
      'renderSize',
      'labelText',
      'hideLabel',
      'helperText',
      'inline',
      'invalid',
      'invalidText',
      'warn',
      'warnText',
      'enableCounter',
      'maxCount',
    ];

    await render(
      <CarbonRoot>
        <Form>
          <TextInput
            type="text"
            renderSize="sm"
            labelText="Label"
            hideLabel
            helperText="Helper text"
            inline
            invalid
            invalidText="Invalid text"
            readOnly
            warn
            warnText="Warning text"
            enableCounter
            maxCount={10}
          />
        </Form>
      </CarbonRoot>
    );

    const inputElement = screen.querySelector('input') as HTMLInputElement;
    nonStdProps.forEach((propName) => expect(!inputElement.hasAttribute(propName)));
  });

  it('renders invalid or warning state such that they are mutually exclusive', async () => {});
});
