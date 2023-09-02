import { component$, useSignal } from '@builder.io/qwik';
import { Dropdown, Item } from './dropdown';
import { CarbonRoot } from '../carbon-root/carbon-root';
import { Form } from '../form/form';
import { Button } from '../button/button';

export const DropdownTestWrapper = component$(() => {
  const fruits: Item[] = ['Apple', 'Banana', 'Blueberry', 'Cherry', 'Durian', 'Elderberry', 'Grape'];
  const newFruits = fruits.filter((fruit) => fruit !== 'Cherry');
  const fruitOptions = useSignal<Item[]>(fruits);
  const selectedFruit = fruits.find((fruit) => fruit === 'Cherry');
  const selectedItem = useSignal<Item | undefined>(selectedFruit);
  return (
    <>
      <CarbonRoot>
        <Form>
          <Dropdown selectedItem={selectedItem.value} items={fruitOptions.value} />
        </Form>
        <Button
          id="clear-selection"
          onClick$={() => {
            selectedItem.value = undefined;
          }}
        >
          Clear selection
        </Button>
        <Button
          id="change-list"
          onClick$={() => {
            fruitOptions.value = newFruits;
          }}
        >
          Change fruits
        </Button>
      </CarbonRoot>
    </>
  );
});
