import { component$, $, QwikChangeEvent } from '@builder.io/qwik';
import { CarbonRoot } from '../components/carbon-root/carbon-root';
import { Link } from '../components/link/link';
import { Add, Edit } from 'carbon-icons-qwik';
import { Button } from '../components/button/button';
import { TextInput } from '../components/text-input/text-input';
import { Form } from '../components/form/form';

const Test = component$(() => {
  const textValue = 'Test value';
  return (
    <CarbonRoot>
      <Link href="https://github.com" target="blank" data-x="test" id="link_id" size="lg" visited renderIcon={Edit} onClick$={() => alert('clicked')}>
        GitHub
      </Link>
      <Button size="sm" title="Button" onClick$={() => alert('clicked')} hasIconOnly={true} renderIcon={Add} class="test-class">
        Test
        <Add q:slot="icon" size={16} />
      </Button>
      <Button href="https://github.com">Link button</Button>
      <Form>
        <TextInput
          value={textValue}
          data-x="x"
          type="text"
          renderSize="sm"
          labelText="Label"
          hideLabel={false}
          helperText="Helper text"
          inline={false}
          invalid
          invalidText="Invalid text"
          readOnly={false}
          warn
          warnText="Warning text"
          class="blah"
          enableCounter={false}
          maxCount={20}
          onChange$={$((event: QwikChangeEvent<HTMLInputElement>) => alert(`Length: ${event.target.value.length}`))}
        />
      </Form>
    </CarbonRoot>
  );
});

export default Test;
