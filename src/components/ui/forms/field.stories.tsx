import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldContent,
  FieldTitle,
  FieldSeparator,
} from "./field";
import { Input } from "./input";
import { Checkbox } from "./checkbox";

/**
 * A composable form field system. `Field` is the layout wrapper;
 * `FieldLabel`, `FieldDescription`, `FieldError`, and `FieldContent` are
 * semantic sub-components. Supports `vertical`, `horizontal` and `responsive`
 * orientations. Group multiple fields with `FieldGroup` inside a `FieldSet`.
 */
const meta = {
  title: "UI/Forms/Field",
  component: Field,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Composable field primitives that enforce consistent label, control, hint, and error layout. " +
          "Use `orientation` to switch between vertical, horizontal, and responsive layouts. " +
          "Descriptions and errors should be wired to the form control with `aria-describedby`, " +
          "and compound controls should use explicit labeling such as `aria-labelledby`.",
      },
    },
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["vertical", "horizontal", "responsive"],
      description: "Controls how the label and input are arranged.",
      table: { category: "Layout", defaultValue: { summary: "vertical" } },
    },
  },
  args: { orientation: "vertical" },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

function FieldStoryFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={["p-8", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}

/** Default vertical field — label stacked above the input. */
export const Vertical: Story = {
  render: (args) => (
    <FieldStoryFrame className="w-[340px]">
      <Field {...args}>
        <FieldLabel htmlFor="field-name">Full Name</FieldLabel>
        <Input
          id="field-name"
          aria-describedby="field-name-description"
          placeholder="John Doe"
        />
        <FieldDescription id="field-name-description">
          Enter your legal name as on your ID.
        </FieldDescription>
      </Field>
    </FieldStoryFrame>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByLabelText("Full Name")).toBeInTheDocument();
    expect(
      canvas.getByText("Enter your legal name as on your ID."),
    ).toBeInTheDocument();
  },
};

/** Horizontal field — label and input rendered side-by-side. */
export const Horizontal: Story = {
  args: { orientation: "horizontal" },
  render: (args) => (
    <FieldStoryFrame className="w-[480px]">
      <Field {...args}>
        <FieldLabel htmlFor="field-email">Email</FieldLabel>
        <Input id="field-email" type="email" placeholder="you@example.com" />
      </Field>
    </FieldStoryFrame>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByLabelText("Email")).toHaveAttribute("type", "email");
  },
};

/** Responsive field pattern intended for use inside `FieldGroup` containers. */
export const Responsive: Story = {
  args: { orientation: "responsive" },
  render: (args) => (
    <FieldStoryFrame className="w-[520px]">
      <FieldGroup>
        <Field {...args}>
          <FieldLabel htmlFor="field-company">Company</FieldLabel>
          <Input id="field-company" placeholder="Acme Pvt Ltd" />
        </Field>
      </FieldGroup>
    </FieldStoryFrame>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByLabelText("Company")).toBeInTheDocument();
  },
};

/** Field with a validation error. */
export const WithError: Story = {
  render: (args) => (
    <FieldStoryFrame className="w-[340px]">
      <Field {...args} data-invalid="true">
        <FieldLabel htmlFor="field-gst">GST Number</FieldLabel>
        <Input
          id="field-gst"
          aria-describedby="field-gst-error"
          aria-invalid="true"
          defaultValue="INVALID_GST"
        />
        <FieldError id="field-gst-error">
          Must be a valid 15-character GST number.
        </FieldError>
      </Field>
    </FieldStoryFrame>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByRole("alert")).toBeInTheDocument();
    expect(canvas.getByLabelText("GST Number")).toHaveAttribute(
      "aria-describedby",
      "field-gst-error",
    );
  },
};

/** Multiple errors passed via the `errors` prop. */
export const MultipleErrors: Story = {
  render: (args) => (
    <FieldStoryFrame className="w-[340px]">
      <Field {...args} data-invalid="true">
        <FieldLabel htmlFor="field-pan">PAN Number</FieldLabel>
        <Input
          id="field-pan"
          aria-describedby="field-pan-errors"
          aria-invalid="true"
        />
        <FieldError
          id="field-pan-errors"
          errors={[
            { message: "PAN cannot be empty." },
            { message: "PAN must be exactly 10 characters." },
          ]}
        />
      </Field>
    </FieldStoryFrame>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByRole("alert")).toBeInTheDocument();
    expect(canvas.getByText("PAN cannot be empty.")).toBeInTheDocument();
    expect(
      canvas.getByText("PAN must be exactly 10 characters."),
    ).toBeInTheDocument();
  },
};

/** Disabled field with state shared through attributes and native control props. */
export const Disabled: Story = {
  render: (args) => (
    <FieldStoryFrame className="w-[340px]">
      <Field {...args} data-disabled="true">
        <FieldLabel htmlFor="field-disabled">Partner code</FieldLabel>
        <Input id="field-disabled" disabled defaultValue="VEN-1024" />
        <FieldDescription>
          This value is assigned automatically.
        </FieldDescription>
      </Field>
    </FieldStoryFrame>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByLabelText("Partner code")).toBeDisabled();
  },
};

/** FieldGroup wraps multiple fields with consistent vertical rhythm. */
export const GroupedFields: Story = {
  render: () => (
    <FieldStoryFrame className="w-[400px]">
      <FieldSet>
        <FieldLegend>Partner Details</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="g-name">Company Name</FieldLabel>
            <Input id="g-name" placeholder="Acme Pvt Ltd" />
          </Field>
          <Field>
            <FieldLabel htmlFor="g-gst">GST Number</FieldLabel>
            <Input id="g-gst" placeholder="22AAAAA0000A1Z5" />
            <FieldDescription>
              15-digit GSTIN issued by the Government of India.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="g-phone">Phone</FieldLabel>
            <Input id="g-phone" type="tel" placeholder="+91 98765 43210" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldStoryFrame>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByText("Partner Details")).toBeInTheDocument();
    expect(canvas.getByLabelText("Company Name")).toBeInTheDocument();
    expect(canvas.getByLabelText("GST Number")).toBeInTheDocument();
    expect(canvas.getByLabelText("Phone")).toBeInTheDocument();
  },
};

/** Field with a separator between sections. */
export const WithSeparator: Story = {
  render: () => (
    <FieldStoryFrame className="w-[400px]">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="sep-name">Name</FieldLabel>
          <Input id="sep-name" placeholder="Jane Smith" />
        </Field>
        <FieldSeparator>or</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="sep-email">Email</FieldLabel>
          <Input id="sep-email" placeholder="jane@example.com" />
        </Field>
      </FieldGroup>
    </FieldStoryFrame>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByText("or")).toBeInTheDocument();
  },
};

/** Fieldset and legend usage for grouped controls. */
export const FieldsetWithLegend: Story = {
  render: () => (
    <FieldStoryFrame className="w-[400px]">
      <FieldSet>
        <FieldLegend>Notification Preferences</FieldLegend>
        <FieldDescription>
          Choose how your operations team should receive urgent updates.
        </FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="notify-email">Primary email</FieldLabel>
            <Input
              id="notify-email"
              type="email"
              placeholder="ops@example.com"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="notify-phone">Escalation phone</FieldLabel>
            <Input id="notify-phone" type="tel" placeholder="+91 98765 43210" />
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldStoryFrame>
  ),
  play: async ({ canvas }) => {
    expect(canvas.getByText("Notification Preferences")).toBeInTheDocument();
    expect(
      canvas.getByText(
        "Choose how your operations team should receive urgent updates.",
      ),
    ).toBeInTheDocument();
  },
};

/** Checkbox field pattern with explicit label and description wiring. */
export const CheckboxField: Story = {
  render: () => (
    <FieldStoryFrame className="w-[360px]">
      <Field orientation="horizontal">
        <Checkbox
          id="terms"
          aria-labelledby="terms-title"
          aria-describedby="terms-description"
        />
        <FieldContent>
          <FieldTitle id="terms-title">Accept terms & conditions</FieldTitle>
          <FieldDescription id="terms-description">
            You agree to our{" "}
            <a href="#terms-of-service" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#privacy-policy" className="underline">
              Privacy Policy
            </a>
            .
          </FieldDescription>
        </FieldContent>
      </Field>
    </FieldStoryFrame>
  ),
  play: async ({ canvas }) => {
    expect(
      canvas.getByRole("checkbox", { name: "Accept terms & conditions" }),
    ).toBeInTheDocument();
    expect(canvas.getByText("Terms of Service")).toBeInTheDocument();
  },
};
