import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../resizable';

describe('Resizable components', () => {
  it('renders horizontal ResizablePanelGroup with panels and handle', () => {
    render(
      <ResizablePanelGroup direction="horizontal" className="h-64">
        <ResizablePanel defaultSize={50}>
          <div>Panel One</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div>Panel Two</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByText('Panel One')).toBeInTheDocument();
    expect(screen.getByText('Panel Two')).toBeInTheDocument();
  });

  it('renders vertical ResizablePanelGroup with handle', () => {
    render(
      <ResizablePanelGroup direction="vertical" className="h-64">
        <ResizablePanel defaultSize={40}>
          <div>Top Panel</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={60}>
          <div>Bottom Panel</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByText('Top Panel')).toBeInTheDocument();
    expect(screen.getByText('Bottom Panel')).toBeInTheDocument();
  });
});
