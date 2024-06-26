import { describe, expect, it } from 'vitest';
import { createDOM } from '@builder.io/qwik/testing';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { ListBox } from './list-box';
import { Form } from '../form/form';
import { ListBoxMenuIcon } from './list-box-menu-icon';

describe('ListBox', () => {
  it('renders expected CSS class and custom class', async () => {
    const { screen, render } = await createDOM();
    const customClass = 'custom-class';
    const listBoxId = 'list-box-id';

    await render(
      <CarbonRoot>
        <Form>
          <ListBox class={customClass} id={listBoxId}></ListBox>
        </Form>
      </CarbonRoot>
    );

    const divElement = screen.querySelector(`div#${listBoxId}`) as HTMLDivElement;
    expect(divElement.classList.contains('cds--list-box')).toBeTruthy();
    expect(divElement.classList.contains(customClass)).toBeTruthy();
  });

  it('renders disabled, expanded and inline states as expected', async () => {
    const { screen, render } = await createDOM();
    const listBoxId = 'list-box-id';

    await render(
      <CarbonRoot>
        <Form>
          <ListBox disabled isOpen type="inline" id={listBoxId}></ListBox>
        </Form>
      </CarbonRoot>
    );

    const divElement = screen.querySelector(`div#${listBoxId}`) as HTMLDivElement;
    expect(divElement.classList.contains('cds--list-box--inline')).toBeTruthy();
    expect(divElement.classList.contains('cds--list-box--disabled')).toBeTruthy();
    expect(divElement.classList.contains('cds--list-box--expanded')).toBeTruthy();
  });

  it('renders invalid state as expected', async () => {
    const { screen, render } = await createDOM();
    const listBoxId = 'list-box-id';
    const invalidMessage = 'Please select an option';

    await render(
      <CarbonRoot>
        <Form>
          <ListBox invalid invalidText={invalidMessage} id={listBoxId}></ListBox>
        </Form>
      </CarbonRoot>
    );

    const divElement = screen.querySelector(`div#${listBoxId}`) as HTMLDivElement;
    expect(divElement.classList.contains('cds--list-box--invalid')).toBeTruthy();
    const invalidElement = screen.querySelector(`div#${listBoxId} ~ div.cds--form-requirement`) as HTMLDivElement;
    expect(invalidElement.textContent).toEqual(invalidMessage);
  });

  it('renders warning state as expected', async () => {
    const { screen, render } = await createDOM();
    const listBoxId = 'list-box-id';
    const warningMessage = 'Please select a better option';

    await render(
      <CarbonRoot>
        <Form>
          <ListBox warn warnText={warningMessage} id={listBoxId}></ListBox>
        </Form>
      </CarbonRoot>
    );

    const divElement = screen.querySelector(`div#${listBoxId}`) as HTMLDivElement;
    expect(divElement.classList.contains('cds--list-box--warning')).toBeTruthy();
    const warningElement = screen.querySelector(`div#${listBoxId} ~ div.cds--form-requirement`) as HTMLDivElement;
    expect(warningElement.textContent).toEqual(warningMessage);
  });

  it('removes non-standard attributes prior to rendering', async () => {
    const { screen, render } = await createDOM();
    const listBoxId = 'list-box-id';

    await render(
      <CarbonRoot>
        <Form>
          <ListBox id={listBoxId}></ListBox>
        </Form>
      </CarbonRoot>
    );

    const divElement = screen.querySelector(`div#${listBoxId}`) as HTMLDivElement;
    const nonStdAttrs = ['disabled', 'invalid', 'invalidText', 'isOpen', 'size', 'type', 'warn', 'warnText'];
    nonStdAttrs.forEach(attr => expect(divElement.hasAttribute(attr)).toBeFalsy());
  });

  it('triggers key-down', async () => {
    const { screen, render, userEvent } = await createDOM();
    const listBoxId = 'list-box-id';

    await render(
      <CarbonRoot>
        <Form>
          <ListBox id={listBoxId}></ListBox>
        </Form>
      </CarbonRoot>
    );

    const divElement = screen.querySelector(`div#${listBoxId}`) as HTMLDivElement;
    await userEvent(divElement, 'keydown', { keyCode: 27 });
    await userEvent(divElement, 'keydown', { keyCode: 13 });
  });

  it('renders listbox menu icon appropriately', async () => {
    const { screen, render } = await createDOM();

    await render(
      <CarbonRoot>
        <ListBoxMenuIcon isOpen={true} />
        <ListBoxMenuIcon isOpen={false} />
      </CarbonRoot>
    );

    const menuIconDivs = Array.from(screen.querySelectorAll('div.cds--list-box__menu-icon'));
    expect(menuIconDivs[0].classList.contains('cds--list-box__menu-icon--open')).toBeTruthy();
    expect(menuIconDivs[1].classList.contains('cds--list-box__menu-icon--open')).toBeFalsy();
  });
});
