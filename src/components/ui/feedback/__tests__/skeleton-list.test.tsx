import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SkeletonList } from '../skeleton-list';

describe('SkeletonList component', () => {
  it('renders default 5 skeleton items', () => {
    const { container } = render(<SkeletonList />);
    const rows = container.querySelectorAll('.border-b');
    expect(rows).toHaveLength(5);
  });

  it('renders custom count of skeleton items', () => {
    const { container } = render(<SkeletonList count={3} />);
    const rows = container.querySelectorAll('.border-b');
    expect(rows).toHaveLength(3);
  });
});
