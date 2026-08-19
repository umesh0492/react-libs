// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { expect, within, userEvent, waitFor, fn } from "storybook/test";
import { LanguageToggle, type SupportedLanguage } from "./language-toggle";

/**
 * A dropdown language switcher for multi-locale apps.
 *
 * **Phase 2 fixes:**
 * - Trigger shows **language code only** (e.g. `EN`) — no "active: Language Name" label
 * - `ChevronDown` inside the trigger signals it's a dropdown
 * - Removed hardcoded `bg-white text-slate-700` — uses theme tokens now
 * - Dropdown items show native script + English subtitle
 */
const meta = {
  title: "UI/Core/LanguageToggle",
  component: LanguageToggle,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A `DropdownMenu`-based language switcher. " +
          "Trigger shows Globe icon + ISO code + ChevronDown. " +
          "Dropdown rows show native script (हिंदी) with English label below.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    language: {
      control: "select",
      options: ["en", "hi", "ta", "te", "kn", "mr", "gu"],
      description: "Currently active language code.",
      table: { category: "State" },
    },
    setLanguage: {
      action: "setLanguage",
      description: "Callback fired with the newly selected code.",
      table: { category: "Events" },
    },
    className: {
      control: "text",
      description: "Additional classes for the trigger button.",
      table: { category: "Styling" },
    },
  },
  args: { language: "en", setLanguage: fn() },
} satisfies Meta<typeof LanguageToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

function StatefulLanguageToggle(
  args: React.ComponentProps<typeof LanguageToggle>,
) {
  const [lang, setLang] = React.useState<SupportedLanguage>(args.language);

  React.useEffect(() => {
    setLang(args.language);
  }, [args.language]);

  const handleSetLanguage = (nextLanguage: SupportedLanguage) => {
    setLang(nextLanguage);
    args.setLanguage(nextLanguage);
  };

  return (
    <LanguageToggle {...args} language={lang} setLanguage={handleSetLanguage} />
  );
}

/**
 * Interactive switcher — click to open, select a language.
 * Trigger now shows Globe + `EN` + ChevronDown (not the full language name).
 */
export const Default: Story = {
  render: (args) => {
    const [lang, setLang] = React.useState<SupportedLanguage>(args.language);

    React.useEffect(() => {
      setLang(args.language);
    }, [args.language]);

    const handleSetLanguage = (nextLanguage: SupportedLanguage) => {
      setLang(nextLanguage);
      args.setLanguage(nextLanguage);
    };

    return (
      <div className="p-8 flex items-center justify-center gap-4">
        <LanguageToggle
          {...args}
          language={lang}
          setLanguage={handleSetLanguage}
        />
        {/* Show what was selected, separate from the trigger */}
        <div className="text-sm text-muted-foreground border-l pl-4">
          Selected:{" "}
          <strong className="text-foreground">{lang.toUpperCase()}</strong>
        </div>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button");
    expect(trigger).toBeInTheDocument();
    // Trigger text should be the code (EN), not the full name
    expect(trigger).toHaveTextContent("EN");
    // Open dropdown
    await userEvent.click(trigger);
    await waitFor(() =>
      expect(within(document.body).getByRole("menu")).toBeInTheDocument(),
    );
    // Click Hindi
    await userEvent.click(within(document.body).getByText(/हिंदी/i));
    // Menu closes
    await waitFor(() =>
      expect(within(document.body).queryByRole("menu")).not.toBeInTheDocument(),
    );
  },
};

/** All seven supported languages shown in static trigger buttons. */
export const AllLanguages: Story = {
  render: () => (
    <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
      {(["en", "hi", "ta", "te", "kn", "mr", "gu"] as SupportedLanguage[]).map(
        (code) => (
          <LanguageToggle key={code} language={code} setLanguage={() => {}} />
        ),
      )}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "All 7 language triggers — each shows its code badge.",
      },
    },
  },
};

/** Hindi pre-selected. */
export const Hindi: Story = {
  args: { language: "hi" },
  render: (args) => (
    <div className="p-8 flex items-center justify-center">
      <StatefulLanguageToggle {...args} />
    </div>
  ),
};

/** In a realistic header context — placed at the end of a nav bar. */
export const InHeader: Story = {
  render: (args) => (
    <header className="w-[600px] flex items-center justify-between border rounded-lg px-4 py-2 bg-card">
      <span className="font-semibold text-sm">Partner Portal</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">v2.1</span>
        <StatefulLanguageToggle {...args} />
      </div>
    </header>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Placed in a header nav — compact trigger fits naturally at the end of the bar.",
      },
    },
  },
};
