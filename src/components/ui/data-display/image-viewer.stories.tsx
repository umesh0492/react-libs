import type { Meta, StoryObj } from '@storybook/react';
import { ImageViewer } from './image-viewer';

const meta = {
  title: 'UI/Data-display/ImageViewer',
  component: ImageViewer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    showDownload: { control: 'boolean' },
    scale: { control: { type: 'range', min: 0.1, max: 2, step: 0.1 } },
  },
} satisfies Meta<typeof ImageViewer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Placeholder image URL
const DUMMY_IMAGE = 'https://images.unsplash.com/photo-1707343843437-caacff5cfa74?q=80&w=1000&auto=format&fit=crop';

export const Default: Story = {
  args: {
    file: DUMMY_IMAGE,
    showDownload: true,
    className: 'w-[600px]',
  },
};

export const WithoutDownload: Story = {
  args: {
    file: DUMMY_IMAGE,
    showDownload: false,
    className: 'w-[600px]',
  },
};

export const ErrorState: Story = {
  args: {
    file: 'https://example.com/not-an-image.jpg',
    showDownload: true,
    className: 'w-[600px]',
  },
};
