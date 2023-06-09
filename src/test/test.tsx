import { component$, $, useSignal } from '@builder.io/qwik';
import { CarbonRoot } from '../components/carbon-root/carbon-root';
import { Link } from '../components/link/link';
import { Edit } from 'carbon-icons-qwik';
import { Button } from '../components/button/button';
import { TextInput, TextInputChangeEvent } from '../components/text-input/text-input';
import { Form } from '../components/form/form';
import { Grid } from '../components/grid/grid';
import { Column } from '../components/grid/column';
import { Checkbox } from '../components/checkbox/checkbox';
import { Dropdown, Item, ItemProps, defaultItemToString } from '../components/dropdown/dropdown';

/**
 * Local test harness for dev. purposes
 */
const Test = component$(() => {
  const textValue = 'Test value';
  const SelectedItemRenderComp = component$((props: ItemProps) => (
    <span class="selected-item-class">Here: {typeof props.item === 'string' ? props.item : props.item.label}</span>
  ));
  const items: Item[] = [
    'Apple',
    'Banana',
    'Blackberry',
    'Blueberry',
    'Cherry',
    'Dragonfruit',
    'Durian',
    'Elderberry',
    'Fig',
    'Guava',
    'Huckleberry',
    'Ichigo',
    'Jackfruit',
  ].map((label) => ({ label, key: label }));
  // const ItemComponent = component$(({ item }: ItemProps) => <span class="item-class">{defaultItemToString(item)}</span>);
  const selectedItem = useSignal<Item>(items.find((item) => (item as { label: string }).label === 'Banana')!);

  return (
    <CarbonRoot>
      <Link href="https://github.com" target="blank" data-x="test" id="link_id" size="lg" visited renderIcon={Edit} onClick$={() => alert('clicked')}>
        GitHub
      </Link>
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
          invalid={false}
          invalidText="Invalid text"
          readOnly={false}
          warn={true}
          warnText="Warning text"
          class="blah"
          enableCounter={false}
          maxCount={20}
          onChange$={$((event: TextInputChangeEvent) => alert(`Length: ${event.value.length}`))}
        />
        <Grid>
          <Column lg={4}>
            <Dropdown
              titleText="Fruit"
              label="Select a fruit"
              selectedItem={selectedItem.value}
              renderSelectedItem={SelectedItemRenderComp}
              items={items}
              helperText="Optional"
              onSelect$={$((item: Item) => {
                console.log('got selected item', item);
                selectedItem.value = item;
              })}
              // itemToElement={ItemComponent}
            />
          </Column>
          <Column lg={1}>
            <span>{defaultItemToString(selectedItem.value)}</span>
          </Column>
        </Grid>
      </Form>
      <Grid class="test-class" id="main-grid" fullWidth>
        <Column sm={4} md={8} lg={16}>
          <Grid class="subgrid-class" id="sub-grid" fullWidth>
            <Column sm={1} md={1} lg xlg max>
              <Checkbox labelText="Active" checked={false} onChange$={$(() => console.log('changed'))} />
            </Column>
            <Column sm={1} md={1} lg={'25%'}></Column>
            <Column sm={1} md={1} lg={{ start: 1, end: 3 }}>
              Col 3-4
            </Column>
          </Grid>
        </Column>
      </Grid>
    </CarbonRoot>
  );
});

export default Test;
