import type { Meta, StoryObj } from '@storybook/vue3';
import Button from '@/components/Button.vue';

const meta = {
  title: 'Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    isLoading: { control: 'boolean' },
    class: { control: 'text' },
  },
  args: {
    isLoading: false,
    class: 'example-button',
  },
} satisfies Meta<typeof Button>;

type Story = StoryObj<typeof meta>;

export default meta;

export const Primary: Story = {
  render: (args) => ({
    components: { Button },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Primary button</Button>',
  }),
};

export const Loading: Story = {
  args: {
    isLoading: true,
    class: 'example-button',
  },
  render: (args) => ({
    components: {
      Button,
    },
    setup() {
      return { args };
    },
    template: '<Button v-bind="args">Loading...</Button>',
  }),
};
