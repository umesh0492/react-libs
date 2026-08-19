// @ts-nocheck
import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { DataTablePagination } from './pagination';

const meta = {
  title: 'UI/Navigation/DataTablePagination',
  component: DataTablePagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Table pagination control with prev/next links and numbered page links. ' +
          'Prev/Next are `<a>` elements (role="link"), not buttons. ' +
          'Disabled state is expressed via CSS (`pointer-events-none opacity-50`), not the HTML `disabled` attribute.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DataTablePagination>;

export default meta;
type Story = StoryObj<typeof meta>;

const PaginationDemo = ({
  initialPage = 1,
  ...props
}: { initialPage?: number } & Partial<React.ComponentProps<typeof DataTablePagination>>) => {
  const [page, setPage] = React.useState(initialPage);
  return (
    <div className="p-4 w-[520px] md:w-auto border rounded-md">
      <p className="text-sm text-muted-foreground mb-3">Showing page {page} of 10</p>
      <DataTablePagination
        currentPage={page}
        totalPages={10}
        totalItems={100}
        onPageChange={setPage}
        
        {...props}
      />
    </div>
  );
};

export const Default: Story = {
  render: () => <PaginationDemo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Pagination uses <a> links, not buttons — query by role "link"
    const nextLink = canvas.getByRole('link', { name: /go to next page/i });
    await userEvent.click(nextLink);
    await waitFor(() =>
      expect(canvas.getByText(/page 2 of 10/i)).toBeInTheDocument()
    );

    // Click next again
    await userEvent.click(canvas.getByRole('link', { name: /go to next page/i }));
    await waitFor(() =>
      expect(canvas.getByText(/page 3 of 10/i)).toBeInTheDocument()
    );

    // Click previous
    const prevLink = canvas.getByRole('link', { name: /go to previous page/i });
    await userEvent.click(prevLink);
    await waitFor(() =>
      expect(canvas.getByText(/page 2 of 10/i)).toBeInTheDocument()
    );
  },
};

/** On the last page the "next" link is visually disabled (CSS opacity/pointer-events). */
export const LastPage: Story = {
  render: () => <PaginationDemo initialPage={10} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/page 10 of 10/i)).toBeInTheDocument();
    // Next link exists but has no pointer-events (CSS disabled)
    const nextLink = canvas.getByRole('link', { name: /go to next page/i });
    expect(nextLink).toHaveClass('pointer-events-none');
  },
};

/** On the first page the "previous" link is visually disabled (CSS opacity/pointer-events). */
export const FirstPage: Story = {
  render: () => <PaginationDemo initialPage={1} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/page 1 of 10/i)).toBeInTheDocument();
    const prevLink = canvas.getByRole('link', { name: /go to previous page/i });
    expect(prevLink).toHaveClass('pointer-events-none');
  },
};

/** Middle page — both prev and next are active. */
export const MiddlePage: Story = {
  render: () => <PaginationDemo initialPage={5} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/page 5 of 10/i)).toBeInTheDocument();
    // Both nav links should exist and be clickable (no pointer-events-none)
    const nextLink = canvas.getByRole('link', { name: /go to next page/i });
    const prevLink = canvas.getByRole('link', { name: /go to previous page/i });
    expect(nextLink).not.toHaveClass('pointer-events-none');
    expect(prevLink).not.toHaveClass('pointer-events-none');
  },
};

/** Dynamic text enabled or disabled. */
export const WithoutLabels: Story = {
  render: () => <PaginationDemo showText={false} />,
};
