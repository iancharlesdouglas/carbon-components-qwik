import { CarbonRoot } from '../../components/carbon-root/carbon-root';
import { Meta, StoryObj } from 'storybook-framework-qwik/*';
import { component$ } from '@builder.io/qwik';
import { Heading, HeadingProps } from '../../components/heading/heading';
import { Section } from '../../components/heading/section';
import './heading.scss';

const HeadingWrapper = component$<HeadingProps>(props => {
  return (
    <CarbonRoot>
      <Section>
        <Heading {...props} />
        <Section>
          <Heading {...props} text="Heading Level 2" />
          <Section>
            <Heading {...props} text="Heading Level 3" />
            <Section>
              <Heading {...props} text="Heading Level 4" />
              <Section>
                <Heading {...props} text="Heading Level 5" />
                <Section>
                  <Heading {...props} text="Heading Level 6" />
                </Section>
              </Section>
            </Section>
          </Section>
        </Section>
      </Section>
    </CarbonRoot>
  );
});

const meta: Meta<HeadingProps> = {
  title: 'Controls/Heading',
  component: Heading,
  args: {},
  tags: ['autodocs'],
  render: args => <HeadingWrapper {...args} />,
};

export default meta;

type Story = StoryObj<HeadingProps>;

export const Default: Story = {
  args: {
    text: 'Heading Level 1',
  },
  argTypes: {
    text: {
      description: 'Text of the heading',
    },
  },
};
