import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const fixes = [
  {
    file: 'src/components/ui/core/language-toggle.stories.tsx',
    search: 'export const Default: Story = {',
    replace: `export const Default: Story = {\n  args: {\n    language: 'en',\n    onChange: () => {}\n  },`
  },
  {
    file: 'src/components/ui/data-display/accordion.stories.tsx',
    search: 'export const Default: Story = {',
    replace: `export const Default: Story = {\n  args: {\n    type: 'single'\n  },`
  },
  {
    file: 'src/components/ui/data-display/ActiveFilterBadge.stories.tsx',
    search: 'export const Default: Story = {',
    replace: `export const Default: Story = {\n  args: {\n    filterKey: 'status',\n    label: 'Status',\n    value: 'Active',\n    onRemove: () => {}\n  },`
  },
  {
    file: 'src/components/ui/data-display/data-table.stories.tsx',
    search: 'export const Default: Story = {',
    replace: `export const Default: Story = {\n  args: {\n    columns: [{ key: 'id', header: 'ID' }],\n    data: [{ id: 1 }]\n  },`
  },
  {
    file: 'src/components/ui/data-display/status-badge.stories.tsx',
    search: 'export const Default: Story = {',
    replace: `export const Default: Story = {\n  args: {\n    status: 'active'\n  },`
  },
  {
    file: 'src/components/ui/feedback/empty-state.stories.tsx',
    search: 'export const Default: Story = {',
    replace: `export const Default: Story = {\n  args: {\n    title: 'No Items Found',\n    description: 'Create an item to get started.'\n  },`
  },
  {
    file: 'src/components/ui/forms/toggle-group.stories.tsx',
    search: 'export const Default: Story = {',
    replace: `export const Default: Story = {\n  args: {\n    type: 'single'\n  },`
  },
  {
    file: 'src/components/ui/layout/page-header.stories.tsx',
    search: 'export const Default: Story = {',
    replace: `export const Default: Story = {\n  args: {\n    title: 'Dashboard Overview'\n  },`
  },
  {
    file: 'src/components/ui/navigation/pagination.stories.tsx',
    search: 'export const Default: Story = {',
    replace: `export const Default: Story = {\n  args: {\n    currentPage: 1,\n    totalPages: 5,\n    totalItems: 50,\n    onPageChange: () => {}\n  },`
  },
  {
    file: 'src/components/ui/overlays/confirm-dialog.stories.tsx',
    search: 'export const Default: Story = {',
    replace: `export const Default: Story = {\n  args: {\n    open: true,\n    onOpenChange: () => {},\n    title: 'Are you sure?',\n    description: 'This action cannot be undone.',\n    onConfirm: () => {}\n  },`
  }
];

fixes.forEach(fix => {
  const filePath = path.join(projectRoot, fix.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    if (!content.includes('args: {') && content.includes(fix.search)) {
      content = content.replace(fix.search, fix.replace);
      fs.writeFileSync(filePath, content);
    }
  }
});

// Fix Chart
const chartPath = path.join(projectRoot, 'src/components/ui/data-display/chart.stories.tsx');
if (fs.existsSync(chartPath)) {
  fs.writeFileSync(chartPath, `import * as React from 'react';\nimport type { Meta, StoryObj } from '@storybook/react';\nimport { ChartContainer, ChartTooltip } from './chart';\n\nconst meta = {\n  title: 'UI/Data-display/Chart',\n  component: ChartContainer,\n  parameters: {\n    layout: 'centered',\n  },\n  tags: ['autodocs'],\n} satisfies Meta<typeof ChartContainer>;\n\nexport default meta;\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {\n  args: { config: {} },\n  render: (args) => <div className="w-[400px] h-[300px] bg-card rounded-lg p-4"><ChartContainer {...args}><div>Chart Placeholder</div></ChartContainer></div>\n};`);
}

// Fix Resizable
const resizablePath = path.join(projectRoot, 'src/components/ui/layout/resizable.stories.tsx');
if (fs.existsSync(resizablePath)) {
  fs.writeFileSync(resizablePath, `import * as React from 'react';\nimport type { Meta, StoryObj } from '@storybook/react';\nimport { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable';\n\nconst meta = {\n  title: 'UI/Layout/ResizablePanelGroup',\n  component: ResizablePanelGroup,\n  parameters: {\n    layout: 'centered',\n  },\n  tags: ['autodocs'],\n} satisfies Meta<typeof ResizablePanelGroup>;\n\nexport default meta;\ntype Story = StoryObj<typeof meta>;\n\nexport const Default: Story = {\n  args: { direction: 'horizontal' },\n  render: (args) => (\n    <div className="w-[600px] h-[400px] border rounded-md">\n      <ResizablePanelGroup {...args}>\n        <ResizablePanel defaultSize={50}><div className="flex items-center justify-center p-6 h-full font-semibold">One</div></ResizablePanel>\n        <ResizableHandle />\n        <ResizablePanel defaultSize={50}><div className="flex items-center justify-center p-6 h-full font-semibold">Two</div></ResizablePanel>\n      </ResizablePanelGroup>\n    </div>\n  )\n};`);
}
