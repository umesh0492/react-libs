import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import * as React from 'react';
import { LanguageToggle } from '../language-toggle';

describe('LanguageToggle component', () => {
  it('renders current language code and accessible label in trigger', () => {
    render(<LanguageToggle language="en" setLanguage={vi.fn()} />);
    const button = screen.getByRole('button', { name: /language: english/i });
    expect(button).toBeInTheDocument();
    expect(screen.getByText('EN')).toBeInTheDocument();
  });

  it('renders Hindi code in trigger when active language is hi', () => {
    render(<LanguageToggle language="hi" setLanguage={vi.fn()} />);
    expect(screen.getByText('HI')).toBeInTheDocument();
  });

  it('opens dropdown menu and selects language on click', async () => {
    const handleSetLanguage = vi.fn();
    render(<LanguageToggle language="en" setLanguage={handleSetLanguage} />);

    const trigger = screen.getByRole('button', { name: /language: english/i });
    fireEvent.pointerDown(trigger);
    fireEvent.pointerUp(trigger);
    fireEvent.click(trigger);

    // Menu item for Hindi should be present
    const hindiItem = await screen.findByText('हिंदी');
    expect(hindiItem).toBeInTheDocument();

    fireEvent.pointerDown(hindiItem);
    fireEvent.pointerUp(hindiItem);
    fireEvent.click(hindiItem);
    expect(handleSetLanguage).toHaveBeenCalledWith('hi');
  });
});
