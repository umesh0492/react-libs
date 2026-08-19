import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { PdfViewer } from './pdf-viewer'

const meta = {
  title: 'UI/Data-display/PdfViewer',
  component: PdfViewer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Renders PDF documents directly inside the UI. Built precisely over `react-pdf` utilizing worker-thread offloading. ' +
          'Includes built-in loading arrays, error handling boundaries, and internal pagination.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    file: {
      control: 'text',
      description: 'URL of the PDF or a File instance block natively assigned.',
    },
    scale: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.1 },
      description: 'Zoom scale configuration.',
    },
    maxWidth: {
      control: 'number',
      description: 'Maximum width bounding limits.',
    },
    showDownload: {
      control: 'boolean',
      description: 'Allows downloading the embedded natively passing blob.',
    },
    showPrint: {
      control: 'boolean',
      description: 'Allows native browser printing using hidden iframe contexts.',
    },
  },
  args: {
    scale: 1,
    maxWidth: 600,
    showDownload: true,
    showPrint: true,
  },
} satisfies Meta<typeof PdfViewer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    file: '/sample.pdf',
    showDownload: false,
    showPrint: false,
  },
}

export const WithControls: Story = {
  args: {
    file: '/sample.pdf',
    showDownload: true,
    showPrint: true,
  },
  parameters: {
    docs: {
      description: { story: 'Enables download utility bounds attached directly to the native Viewer Card.' },
    },
  },
}

export const ErrorState: Story = {
  args: {
    file: '/broken-url-does-not-exist.pdf',
  },
  parameters: {
    docs: {
      description: { story: 'Shows graceful error boundary fallbacks natively mapping.' },
    },
  },
}
