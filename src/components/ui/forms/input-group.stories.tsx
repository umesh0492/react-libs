// @ts-nocheck
import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Eye, EyeOff, Globe, IndianRupee, Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "./input-group";
import ts from "typescript";

type AddonAlign = React.ComponentProps<typeof InputGroupAddon>["align"];
type ButtonSize = React.ComponentProps<typeof InputGroupButton>["size"];

type InputGroupStoryArgs = React.ComponentProps<typeof InputGroup> & {
  addonAlign: AddonAlign;
  buttonLabel: string;
  buttonSize: ButtonSize;
  helperText: string;
  inputAriaLabel: string;
  inputClassName: string;
  inputDefaultValue: string;
  inputPlaceholder: string;
  inputType: React.ComponentProps<typeof InputGroupInput>["type"];
  suffixText: string;
  textareaRows: number;
  textareaValue: string;
  widthClassName: string;
};

const StoryFrame = ({
  children,
  widthClassName,
  className,
}: {
  children: React.ReactNode;
  widthClassName: string;
  className?: string;
}) => (
  <div className={`p-8 ${widthClassName}${className ? ` ${className}` : ""}`}>
    {children}
  </div>
);

const meta = {
  title: "UI/Forms/InputGroup",
  component: InputGroup,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Composes `InputGroupAddon`, `InputGroupInput`, `InputGroupTextarea`, and `InputGroupButton` into a single grouped control. Controls are bound to the shared example props these stories actually use so the browser UI stays accurate and useful.",
      },
    },
  },
  tags: ["autodocs"],
  args: {
    addonAlign: "inline-start",
    buttonLabel: "Verify",
    buttonSize: "xs",
    className: "",
    helperText: "Use lowercase letters, numbers, or hyphens only.",
    inputAriaLabel: "Search partners",
    inputClassName: "",
    inputDefaultValue: "",
    inputPlaceholder: "Search partners...",
    inputType: "text",
    suffixText: ".enterprise.io",
    textareaRows: 3,
    textareaValue: "Please deliver before 8 AM and call security on arrival.",
    widthClassName: "w-[320px]",
  },
  argTypes: {
    addonAlign: {
      control: "select",
      options: ["inline-start", "inline-end", "block-start", "block-end"],
      description: "Alignment applied to the featured addon in the story.",
    },
    buttonLabel: {
      control: "text",
      description: "Visible label used by button-based stories.",
    },
    buttonSize: {
      control: "select",
      options: ["xs", "sm", "icon-xs", "icon-sm"],
      description: "Size passed to `InputGroupButton` in button stories.",
    },
    className: {
      control: "text",
      description: "Additional classes applied to the `InputGroup` root.",
    },
    helperText: {
      control: "text",
      description: "Supporting or validation text used by feedback stories.",
    },
    inputAriaLabel: {
      control: "text",
      description: "Accessible name for the input or textarea control.",
    },
    inputClassName: {
      control: "text",
      description: "Additional classes applied to the input control.",
    },
    inputDefaultValue: {
      control: "text",
      description: "Initial value for uncontrolled input examples.",
    },
    inputPlaceholder: {
      control: "text",
      description: "Placeholder used by input and textarea examples.",
    },
    inputType: {
      control: "select",
      options: ["text", "email", "number", "password", "search", "url"],
      description: "HTML input type used by relevant stories.",
    },
    suffixText: {
      control: "text",
      description: "Text rendered in trailing addon examples.",
    },
    textareaRows: {
      control: { type: "number", min: 2, max: 8, step: 1 },
      description: "Visible row count for textarea examples.",
    },
    textareaValue: {
      control: "text",
      description: "Initial content used by textarea value examples.",
    },
    widthClassName: {
      control: "text",
      description: "Width utility applied to the story frame.",
    },
    children: {
      table: {
        disable: true,
      },
    },
    id: {
      control: false,
    },
    role: {
      control: false,
    },
    style: {
      control: false,
    },
  },
} satisfies Meta<InputGroupStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithLeadingIcon: Story = {
  args: {
    addonAlign: "inline-start",
    inputAriaLabel: "Search partners",
    inputPlaceholder: "Search partners...",
    widthClassName: "w-[320px]",
  },
  render: ({
    addonAlign,
    inputAriaLabel,
    inputPlaceholder,
    widthClassName,
    ...args
  }) => (
    <StoryFrame widthClassName={widthClassName}>
      <InputGroup {...args} id="ig-search">
        <InputGroupAddon align={addonAlign}>
          <InputGroupText>
            <Search />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-label={inputAriaLabel}
          placeholder={inputPlaceholder}
        />
      </InputGroup>
    </StoryFrame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("textbox", { name: args.inputAriaLabel }),
    ).toBeInTheDocument();
  },
};

export const CurrencyPrefix: Story = {
  args: {
    addonAlign: "inline-start",
    inputAriaLabel: "Amount",
    inputClassName: "text-right",
    inputPlaceholder: "0.00",
    inputType: "number",
    widthClassName: "w-[240px]",
  },
  render: ({
    addonAlign,
    inputAriaLabel,
    inputClassName,
    inputPlaceholder,
    inputType,
    widthClassName,
    ...args
  }) => (
    <StoryFrame widthClassName={widthClassName}>
      <InputGroup {...args} id="ig-rupee">
        <InputGroupAddon align={addonAlign}>
          <InputGroupText>
            <IndianRupee className="h-4 w-4" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-label={inputAriaLabel}
          className={inputClassName}
          placeholder={inputPlaceholder}
          type={inputType}
        />
      </InputGroup>
    </StoryFrame>
  ),
};

export const WithTrailingText: Story = {
  args: {
    inputAriaLabel: "Store subdomain",
    inputPlaceholder: "your-store",
    suffixText: ".enterprise.io",
    widthClassName: "w-[320px]",
  },
  render: ({
    inputAriaLabel,
    inputPlaceholder,
    suffixText,
    widthClassName,
    ...args
  }) => (
    <StoryFrame widthClassName={widthClassName}>
      <InputGroup {...args} id="ig-url">
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <Globe className="h-4 w-4" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-label={inputAriaLabel}
          placeholder={inputPlaceholder}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText className="text-muted-foreground">
            {suffixText}
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </StoryFrame>
  ),
};

export const PasswordWithToggle: Story = {
  args: {
    buttonSize: "icon-xs",
    inputAriaLabel: "Password",
    inputPlaceholder: "Enter password",
    widthClassName: "w-[300px]",
  },
  render: ({
    buttonSize,
    inputAriaLabel,
    inputPlaceholder,
    widthClassName,
    ...args
  }) => {
    const [show, setShow] = React.useState(false);

    return (
      <StoryFrame widthClassName={widthClassName}>
        <InputGroup {...args} id="ig-password">
          <InputGroupInput
            aria-label={inputAriaLabel}
            placeholder={inputPlaceholder}
            type={show ? "text" : "password"}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((state) => !state)}
              size={buttonSize}
            >
              {show ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </StoryFrame>
    );
  },
};

export const TextareaWithBlockLabel: Story = {
  args: {
    addonAlign: "block-start",
    inputAriaLabel: "Internal note",
    inputPlaceholder: "Add a note visible only to partners...",
    textareaRows: 3,
    widthClassName: "w-[360px]",
  },
  render: ({
    addonAlign,
    inputAriaLabel,
    inputPlaceholder,
    textareaRows,
    widthClassName,
    ...args
  }) => (
    <StoryFrame widthClassName={widthClassName}>
      <InputGroup {...args} id="ig-textarea">
        <InputGroupAddon align={addonAlign}>
          <InputGroupText>Internal Note</InputGroupText>
        </InputGroupAddon>
        <InputGroupTextarea
          aria-label={inputAriaLabel}
          placeholder={inputPlaceholder}
          rows={textareaRows}
        />
      </InputGroup>
    </StoryFrame>
  ),
};

export const DisabledWithAddon: Story = {
  args: {
    inputAriaLabel: "Partner portal domain",
    inputDefaultValue: "portal.enterprise.io",
    widthClassName: "w-[320px]",
  },
  render: ({ inputAriaLabel, inputDefaultValue, widthClassName, ...args }) => (
    <StoryFrame widthClassName={widthClassName}>
      <InputGroup {...args} data-disabled="true" id="ig-disabled">
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <Globe className="h-4 w-4" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-label={inputAriaLabel}
          defaultValue={inputDefaultValue}
          disabled
        />
      </InputGroup>
    </StoryFrame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("textbox", { name: args.inputAriaLabel }),
    ).toBeDisabled();
  },
};

export const InvalidState: Story = {
  args: {
    helperText: "Use lowercase letters, numbers, or hyphens only.",
    inputAriaLabel: "Subdomain",
    inputDefaultValue: "partner portal",
    suffixText: ".enterprise.io",
    widthClassName: "w-[320px]",
  },
  render: ({
    helperText,
    inputAriaLabel,
    inputDefaultValue,
    suffixText,
    widthClassName,
    ...args
  }) => (
    <StoryFrame className="space-y-2" widthClassName={widthClassName}>
      <InputGroup {...args} id="ig-invalid">
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <Globe className="h-4 w-4" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-describedby="ig-invalid-error"
          aria-invalid="true"
          aria-label={inputAriaLabel}
          defaultValue={inputDefaultValue}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>{suffixText}</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <p className="text-destructive text-sm" id="ig-invalid-error">
        {helperText}
      </p>
    </StoryFrame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: args.inputAriaLabel });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "ig-invalid-error");
    expect(canvas.getByText(args.helperText)).toBeInTheDocument();
  },
};

export const SearchWithShortcut: Story = {
  args: {
    inputAriaLabel: "Search orders or partners",
    inputPlaceholder: "Search orders or partners",
    suffixText: "Ctrl K",
    widthClassName: "w-[340px]",
  },
  render: ({
    inputAriaLabel,
    inputPlaceholder,
    suffixText,
    widthClassName,
    ...args
  }) => (
    <StoryFrame widthClassName={widthClassName}>
      <InputGroup {...args} id="ig-command-search">
        <InputGroupAddon align="inline-start">
          <InputGroupText>
            <Search />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupInput
          aria-label={inputAriaLabel}
          placeholder={inputPlaceholder}
        />
        <InputGroupAddon align="inline-end">
          <InputGroupText>
            <kbd>{suffixText}</kbd>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </StoryFrame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("textbox", { name: args.inputAriaLabel }),
    ).toBeInTheDocument();
    expect(canvas.getByText(args.suffixText)).toBeInTheDocument();
  },
};

export const InputWithInlineAction: Story = {
  args: {
    buttonLabel: "Verify",
    buttonSize: "xs",
    helperText: "Verification pending.",
    inputAriaLabel: "Buyer email",
    inputPlaceholder: "buyer@company.com",
    inputType: "email",
    widthClassName: "w-[360px]",
  },
  render: ({
    buttonLabel,
    buttonSize,
    helperText,
    inputAriaLabel,
    inputPlaceholder,
    inputType,
    widthClassName,
    ...args
  }) => {
    const [verified, setVerified] = React.useState(false);

    return (
      <StoryFrame className="space-y-2" widthClassName={widthClassName}>
        <InputGroup {...args} id="ig-inline-action">
          <InputGroupInput
            aria-label={inputAriaLabel}
            placeholder={inputPlaceholder}
            type={inputType}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label={`${buttonLabel} email`}
              onClick={() => setVerified(true)}
              size={buttonSize}
            >
              {buttonLabel}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <p aria-live="polite" className="text-muted-foreground text-sm">
          {verified ? "Verification email queued." : helperText}
        </p>
      </StoryFrame>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: `${args.buttonLabel} email` }),
    );
    expect(canvas.getByText("Verification email queued.")).toBeInTheDocument();
  },
};

export const TextareaWithBlockFooter: Story = {
  args: {
    inputAriaLabel: "Delivery instructions",
    textareaRows: 4,
    textareaValue: "Please deliver before 8 AM and call security on arrival.",
    widthClassName: "w-[360px]",
  },
  render: ({
    inputAriaLabel,
    textareaRows,
    textareaValue,
    widthClassName,
    ...args
  }) => (
    <StoryFrame widthClassName={widthClassName}>
      <InputGroup {...args} id="ig-textarea-footer">
        <InputGroupTextarea
          aria-label={inputAriaLabel}
          defaultValue={textareaValue}
          rows={textareaRows}
        />
        <InputGroupAddon align="block-end" className="border-t">
          <InputGroupText>56 / 140 characters</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </StoryFrame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("textbox", { name: args.inputAriaLabel }),
    ).toBeInTheDocument();
    expect(canvas.getByText("56 / 140 characters")).toBeInTheDocument();
  },
};

export const AddonFocusBehavior: Story = {
  args: {
    addonAlign: "block-start",
    inputAriaLabel: "Internal note",
    inputPlaceholder: "Add a note for the warehouse team",
    textareaRows: 3,
    widthClassName: "w-[360px]",
  },
  render: ({
    addonAlign,
    inputAriaLabel,
    inputPlaceholder,
    textareaRows,
    widthClassName,
    ...args
  }) => (
    <StoryFrame widthClassName={widthClassName}>
      <InputGroup {...args} id="ig-addon-focus">
        <InputGroupAddon align={addonAlign}>
          <InputGroupText>Internal Note</InputGroupText>
        </InputGroupAddon>
        <InputGroupTextarea
          aria-label={inputAriaLabel}
          placeholder={inputPlaceholder}
          rows={textareaRows}
        />
      </InputGroup>
    </StoryFrame>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const labelAddon = canvas.getByText("Internal Note");
    const textarea = canvas.getByRole("textbox", { name: args.inputAriaLabel });

    await userEvent.click(labelAddon);

    expect(textarea).toHaveFocus();
  },
};
