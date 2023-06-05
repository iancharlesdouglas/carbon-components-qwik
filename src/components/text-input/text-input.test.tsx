import { createDOM } from '@builder.io/qwik/testing';
import { $, QwikChangeEvent, component$, useSignal } from '@builder.io/qwik';
import { describe, expect, it, vi } from 'vitest';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { TextInput, TextInputChangeEvent } from './text-input';
import { Form } from '../form/form';
import { FluidForm } from '../fluid-form/fluid-form';

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

  it('renders invalid text, an appropriate CSS class, and an error icon when state is "invalid"', async () => {
    const { screen, render } = await createDOM();
    const errorMessage = 'Enter a valid city';

    await render(
      <CarbonRoot>
        <FluidForm>
          <TextInput invalid invalidText={errorMessage}></TextInput>
        </FluidForm>
      </CarbonRoot>
    );

    const invalidMessageDiv = screen.querySelector('div.cds--form-requirement') as HTMLDivElement;
    expect(invalidMessageDiv).toBeTruthy();
    expect(invalidMessageDiv.textContent).toEqual(errorMessage);
    const invalidIconSvg = screen.querySelector('svg.cds--text-input__invalid-icon') as SVGSVGElement;
    expect(invalidIconSvg).toBeTruthy();
  });

  it('renders warning text, an appropriate CSS class, and a warning icon when state is "warn"', async () => {
    const { screen, render } = await createDOM();
    const warning = 'Enter a valid city';

    await render(
      <CarbonRoot>
        <FluidForm>
          <TextInput warn warnText={warning}></TextInput>
        </FluidForm>
      </CarbonRoot>
    );

    const warnMessageDiv = screen.querySelector('div.cds--form-requirement') as HTMLDivElement;
    expect(warnMessageDiv).toBeTruthy();
    expect(warnMessageDiv.textContent).toEqual(warning);
    const warnIconSvg = screen.querySelector('svg.cds--text-input__invalid-icon.cds--text-input__invalid-icon--warning') as SVGSVGElement;
    expect(warnIconSvg).toBeTruthy();
  });

  it('renders the label as hidden if hideLabel is set to true', async () => {
    const { screen, render } = await createDOM();

    await render(
      <CarbonRoot>
        <Form>
          <TextInput hideLabel labelText="Test label" />
        </Form>
      </CarbonRoot>
    );

    const labelElement = screen.querySelector('label') as HTMLLabelElement;
    expect(labelElement.classList.contains('cds--visually-hidden')).toBeTruthy();
  });

  it('fires onChange$ callback when its value is changed', async () => {
    const { screen, render, userEvent } = await createDOM();

    const Wrapper = component$(() => {
      const content = useSignal('.');
      return (
        <>
          <Form>
            <TextInput
              onChange$={$((event: TextInputChangeEvent) => {
                content.value = event.value;
              })}
            />
          </Form>
          <div id="output">{content.value}</div>
        </>
      );
    });

    await render(
      <CarbonRoot>
        <Wrapper />
      </CarbonRoot>
    );

    const value = 'changed value';
    const inputElement = screen.querySelector('input') as HTMLInputElement;
    await userEvent(inputElement, 'input', { target: { value } });
    await userEvent(inputElement, 'change', { target: { value } });
    await userEvent(inputElement, 'click');

    const outputElement = screen.querySelector('div#output') as HTMLDivElement;
    expect(outputElement.textContent).toEqual(value);
  });
});
