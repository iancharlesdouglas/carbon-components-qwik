import { component$, $, useSignal } from '@builder.io/qwik';
import { CarbonRoot } from '../components/carbon-root/carbon-root';
import { Link } from '../components/link/link';
import { Edit, ErrorOutline } from 'carbon-icons-qwik';
import { Button } from '../components/button/button';
import { TextInput, TextInputChangeEvent } from '../components/text-input/text-input';
import { Form } from '../components/form/form';
import { Grid } from '../components/grid/grid';
import { Column } from '../components/grid/column';
import { Checkbox } from '../components/checkbox/checkbox';
import { Dropdown, Item, ItemProps, Labelled, defaultItemToString } from '../components/dropdown/dropdown';
import { Section } from '../components/heading/section';
import { Heading } from '../components/heading/heading';
import { MultiSelect } from '../components/multi-select/multi-select';

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
    'Kiwi fruit and related fruits from the kiwi family',
  ].map(label => ({
    label,
    key: label,
    disabled: label === 'Huckleberry' || label === 'Apple' || label === 'Jackfruit' || label === 'Banana',
  }));
  const newItems = items.filter(item => (item as Labelled).label !== 'Banana');
  const itemOptions = useSignal(items);
  const selectedItem = useSignal<Item | undefined>(items.find(item => (item as { label: string }).label === 'Guava')!);
  const selectedItems = useSignal(
    items.filter(item => (item as any).label === 'Blueberry' || (item as any).label === 'Cherry')
  );
  const userSelection = useSignal(selectedItems.value);

  return (
    <CarbonRoot>
      <Link
        href="https://github.com"
        target="blank"
        data-x="test"
        id="link_id"
        size="lg"
        visited
        renderIcon={Edit}
        onClick$={() => alert('clicked')}
      >
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
              label="Fruit"
              placeholder="Select a fruit"
              selectedItem={selectedItem.value}
              renderSelectedItem={SelectedItemRenderComp}
              items={itemOptions.value}
              helperText="Optional"
              onSelect$={$((item: Item) => {
                selectedItem.value = item;
              })}
              // itemToElement={ItemComponent}
            />
          </Column>
          <Column lg={2}>
            <span>Selected: {defaultItemToString(selectedItem.value!)}</span>
          </Column>
          <Column lg={4}>
            <MultiSelect
              title="Fruits"
              label="Select fruits"
              placeholder="Select fruits"
              selectedItems={selectedItems.value}
              items={itemOptions.value}
              itemToString$={$((item: Item | undefined) => `Item ${(item as any).label}`)}
              onChange$={(selection: Item[]) => {
                userSelection.value = selection;
              }}
            />
            <span>{userSelection.value.map(item => (item as Labelled).label)}</span>
          </Column>
          <Column>
            <Button
              onClick$={$(() => {
                if (!selectedItems.value.some(item => (item as Labelled).label === 'Dragonfruit')) {
                  selectedItems.value = [
                    ...selectedItems.value,
                    items.find(item => (item as Labelled).label === 'Dragonfruit')!,
                  ];
                }
              })}
              renderIcon={ErrorOutline}
              style="margin-left: 1rem"
              type="button"
            >
              Set Dragonf.
            </Button>
          </Column>
        </Grid>
      </Form>
      <Grid class="test-class" id="main-grid" fullWidth>
        <Column sm={4} md={8} lg={16}>
          <Grid class="subgrid-class" id="sub-grid" fullWidth>
            <Column sm={1} md={2} lg={4} class="test">
              <Checkbox labelText="Active" checked={false} onChange$={$(() => console.log('changed'))} />
              <Button
                onClick$={$(() => {
                  selectedItem.value = undefined;
                })}
                renderIcon={ErrorOutline}
              >
                Clear Selection
              </Button>
              <Button
                onClick$={$(() => {
                  itemOptions.value = newItems;
                })}
                renderIcon={ErrorOutline}
                style="margin-left: 1rem"
              >
                Change list
              </Button>
            </Column>
            <Column sm={1} md={1} lg={'25%'}></Column>
            <Column sm={1} md={1} lg={{ start: 1, end: 3 }}>
              Col 3-4
            </Column>
          </Grid>
        </Column>
      </Grid>
      <Section>
        <Heading text="Heading 1" />
        <Section>
          <Heading text="Heading 2" />
        </Section>
      </Section>
    </CarbonRoot>
  );
});

export default Test;
