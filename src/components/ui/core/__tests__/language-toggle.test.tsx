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

  it('renders custom language code in trigger when active language is es', () => {
    render(<LanguageToggle language="es" setLanguage={vi.fn()} />);
    expect(screen.getByText('ES')).toBeInTheDocument();
  });

  it('opens dropdown menu and selects language on click', async () => {
    const handleSetLanguage = vi.fn();
    render(<LanguageToggle language="en" setLanguage={handleSetLanguage} />);

    const trigger = screen.getByRole('button', { name: /language: english/i });
    fireEvent.pointerDown(trigger);
    fireEvent.pointerUp(trigger);
    fireEvent.click(trigger);

    // Menu item for Spanish should be present
    const esItem = await screen.findByText('Español');
    expect(esItem).toBeInTheDocument();

    fireEvent.pointerDown(esItem);
    fireEvent.pointerUp(esItem);
    fireEvent.click(esItem);
    expect(handleSetLanguage).toHaveBeenCalledWith('es');
  });

  it('supports custom languages array passed via prop', async () => {
    const handleSetLanguage = vi.fn();
    const customLanguages = [
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    ];
    render(
      <LanguageToggle
        language="pt"
        setLanguage={handleSetLanguage}
        languages={customLanguages}
      />
    );

    expect(screen.getByText('PT')).toBeInTheDocument();

    const trigger = screen.getByRole('button', { name: /language: portuguese/i });
    fireEvent.pointerDown(trigger);
    fireEvent.pointerUp(trigger);
    fireEvent.click(trigger);

    const itItem = await screen.findByText('Italiano');
    expect(itItem).toBeInTheDocument();
    fireEvent.click(itItem);
    expect(handleSetLanguage).toHaveBeenCalledWith('it');
  });
});
