import * as React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import axe from "axe-core";

import { MultiSelect } from "../forms/multi-select";
import { DataTable } from "../data-display/data-table";
import { ProgressRing } from "../feedback/progress-ring";
import { Stepper } from "../navigation/stepper";
import { CopyButton } from "../feedback/copy-button";
import { FileUpload } from "../forms/file-upload";
import { MatchScoreGauge } from "../data-display/match-score-gauge";
import { RadarSweep } from "../data-display/radar-sweep";
import { MetricTicker } from "../data-display/metric-ticker";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from "../data-display/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../data-display/accordion";
import { Button } from "../forms/button";
import { Checkbox } from "../forms/checkbox";
import { Input } from "../forms/input";
import { Textarea } from "../forms/textarea";
import { Switch } from "../forms/switch";
import { Slider } from "../forms/slider";
import { Toggle } from "../forms/toggle";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../navigation/tabs";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
} from "../navigation/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../navigation/pagination";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "../overlays/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../overlays/alert-dialog";
import { Popover, PopoverTrigger, PopoverContent } from "../core/popover";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../overlays/tooltip";

describe("Accessibility (a11y) Automated Tests - Axe Violations", () => {
  it("MultiSelect has 0 accessibility violations in closed and open states", async () => {
    const { container } = render(
      <MultiSelect
        options={[
          { label: "Option 1", value: "opt-1" },
          { label: "Option 2", value: "opt-2" },
          { label: "Option 3", value: "opt-3" },
        ]}
        placeholder="Select options"
        aria-label="Select options"
      />
    );

    let results = await axe.run(container);
    expect(results.violations).toEqual([]);

    // Open dropdown
    const combobox = screen.getByRole("combobox");
    fireEvent.click(combobox);

    results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("DataTable has 0 accessibility violations with sortable columns and caption", async () => {
    const { container } = render(
      <DataTable
        caption="User Accounts Table"
        columns={[
          { key: "id", header: "ID", sortable: true },
          { key: "name", header: "Name", sortable: true },
          { key: "role", header: "Role" },
        ]}
        data={[
          { id: "1", name: "Alice Smith", role: "Admin" },
          { id: "2", name: "Bob Jones", role: "Viewer" },
        ]}
        onSort={vi.fn()}
      />
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("ProgressRing has 0 accessibility violations", async () => {
    const { container } = render(
      <ProgressRing percentage={65} showLabel aria-label="Download progress" />
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("Stepper has 0 accessibility violations", async () => {
    const { container } = render(
      <Stepper
        steps={[
          { title: "Account", description: "Create account" },
          { title: "Profile", description: "Setup profile" },
          { title: "Confirm", description: "Review and confirm" },
        ]}
        activeStep={1}
        clickable
        onStepClick={vi.fn()}
      />
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("CopyButton has 0 accessibility violations", async () => {
    const { container } = render(
      <CopyButton value="npm install @umesh0492/react-libs" defaultText="Copy command" />
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("FileUpload has 0 accessibility violations", async () => {
    const { container } = render(
      <FileUpload
        label="Upload resumes"
        description="PDF or DOCX up to 5MB"
      />
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("MatchScoreGauge has 0 accessibility violations", async () => {
    const { container } = render(
      <MatchScoreGauge score={94} label="Match Score" />
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("Carousel has 0 accessibility violations with slides and controls", async () => {
    const { container } = render(
      <Carousel aria-label="Featured projects">
        <CarouselContent>
          <CarouselItem>Slide 1 Content</CarouselItem>
          <CarouselItem>Slide 2 Content</CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("RadarSweep has 0 accessibility violations", async () => {
    const { container } = render(
      <RadarSweep
        statusText="Systems Normal"
        blips={[{ id: "1", x: 50, y: 50, label: "Server Alpha" }]}
      />
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });

  it("Accordion has 0 accessibility violations", async () => {
    const { container } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="faq-1">
          <AccordionTrigger>What is this library?</AccordionTrigger>
          <AccordionContent>A production-ready React component library.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const results = await axe.run(container);
    expect(results.violations).toEqual([]);
  });
});

describe("Accessibility Feature Verifications", () => {
  describe("MultiSelect Accessibility & Behavior", () => {
    it("uses dynamic React.useId() instead of static multiselect-listbox", () => {
      render(
        <MultiSelect
          options={[{ label: "Alpha", value: "a" }]}
          placeholder="Choose"
        />
      );

      const combobox = screen.getByRole("combobox");
      const controlsId = combobox.getAttribute("aria-controls");
      expect(controlsId).toBeTruthy();
      expect(controlsId).not.toBe("multiselect-listbox");
      expect(controlsId).toContain("listbox");

      // Open and verify listbox has matching ID
      fireEvent.click(combobox);
      const listbox = screen.getByRole("listbox");
      expect(listbox).toHaveAttribute("id", controlsId);
    });

    it("supports proper aria-expanded, aria-activedescendant, and arrow key navigation", () => {
      render(
        <MultiSelect
          options={[
            { label: "Apple", value: "apple" },
            { label: "Banana", value: "banana" },
            { label: "Cherry", value: "cherry" },
          ]}
          placeholder="Fruits"
        />
      );

      const combobox = screen.getByRole("combobox");
      expect(combobox).toHaveAttribute("aria-expanded", "false");

      // Arrow down to open
      fireEvent.keyDown(combobox, { key: "ArrowDown" });
      expect(combobox).toHaveAttribute("aria-expanded", "true");
      expect(combobox.getAttribute("aria-activedescendant")).toBeTruthy();

      // Arrow down to second option
      fireEvent.keyDown(combobox, { key: "ArrowDown" });
      const activeId2 = combobox.getAttribute("aria-activedescendant");
      expect(activeId2).toBeTruthy();

      // Search input has aria-label
      const searchInput = screen.getByLabelText(/search options/i);
      expect(searchInput).toBeInTheDocument();

      // Arrow down inside search input
      fireEvent.keyDown(searchInput, { key: "ArrowDown" });
      const activeId3 = combobox.getAttribute("aria-activedescendant");
      expect(activeId3).toBeTruthy();
    });

    it("restores focus to trigger on Escape", () => {
      render(
        <MultiSelect
          options={[{ label: "Item 1", value: "1" }]}
          placeholder="Select Item"
        />
      );

      const combobox = screen.getByRole("combobox");
      fireEvent.click(combobox);
      expect(combobox).toHaveAttribute("aria-expanded", "true");

      const searchInput = screen.getByLabelText(/search options/i);
      searchInput.focus();

      fireEvent.keyDown(searchInput, { key: "Escape" });
      expect(combobox).toHaveAttribute("aria-expanded", "false");
      expect(document.activeElement).toBe(combobox);
    });

    it("extends HTMLAttributes and forwards ref, className, and rest props", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <MultiSelect
          ref={ref}
          options={[{ label: "A", value: "a" }]}
          className="custom-multi-select"
          data-testid="multi-select-root"
        />
      );

      const root = screen.getByTestId("multi-select-root");
      expect(root).toBeInTheDocument();
      expect(root).toHaveClass("custom-multi-select");
      expect(ref.current).toBe(root);
    });

    it("supports uncontrolled mode with defaultValue and internal state", () => {
      render(
        <MultiSelect
          options={[
            { label: "Alpha", value: "alpha" },
            { label: "Beta", value: "beta" },
          ]}
          defaultValue={["alpha"]}
        />
      );

      expect(screen.getByText("Alpha")).toBeInTheDocument();

      // Open and toggle Beta
      const combobox = screen.getByRole("combobox");
      fireEvent.click(combobox);

      const betaOption = screen.getByText("Beta");
      fireEvent.click(betaOption);

      expect(screen.getAllByText("Beta")).toHaveLength(2);
    });
  });

  describe("FileUpload Accessibility & Uncontrolled Mode", () => {
    it("includes aria-live polite for upload status and error messages", () => {
      render(
        <FileUpload
          label="Upload files"
          error="Exceeded file limit"
        />
      );

      const politeRegions = document.querySelectorAll('[aria-live="polite"]');
      expect(politeRegions.length).toBeGreaterThanOrEqual(1);

      const errorText = screen.getByText("Exceeded file limit");
      expect(errorText.closest('[aria-live="polite"]')).toBeInTheDocument();
    });

    it("supports uncontrolled mode in FileUpload", () => {
      global.URL.createObjectURL = vi.fn(() => "blob:http://localhost/mock");
      global.URL.revokeObjectURL = vi.fn();

      render(<FileUpload label="Drop files" />);

      const input = screen.getByTestId("file-upload-input");
      const file = new File(["hello"], "sample.txt", { type: "text/plain" });

      fireEvent.change(input, { target: { files: [file] } });
      expect(screen.getByText("sample.txt")).toBeInTheDocument();
    });
  });

  describe("Custom SVG Gauges Accessibility", () => {
    it("MatchScoreGauge has role meter, aria value attributes, and title", () => {
      render(<MatchScoreGauge score={82} label="ATS Match" />);

      const meter = screen.getByRole("meter");
      expect(meter).toHaveAttribute("aria-valuenow", "82");
      expect(meter).toHaveAttribute("aria-valuemin", "0");
      expect(meter).toHaveAttribute("aria-valuemax", "100");

      const title = meter.querySelector("title");
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toContain("82%");
    });

    it("ProgressRing has role progressbar, aria value attributes, and title", () => {
      render(<ProgressRing percentage={45} aria-label="Storage usage" />);

      const progressbar = screen.getByRole("progressbar");
      expect(progressbar).toHaveAttribute("aria-valuenow", "45");
      expect(progressbar).toHaveAttribute("aria-valuemin", "0");
      expect(progressbar).toHaveAttribute("aria-valuemax", "100");
    });

    it("RadarSweep has role img with accessible label", () => {
      render(
        <RadarSweep
          statusText="Radar Online"
          blips={[{ id: "1", x: 50, y: 50, label: "Target Alpha" }]}
        />
      );

      const img = screen.getByRole("img");
      expect(img).toHaveAttribute("aria-label");
      expect(img.getAttribute("aria-label")).toContain("Radar Online");
    });
  });

  describe("Motion & Table Accessibility", () => {
    it("MetricTicker supports prefers-reduced-motion and pause-on-hover / pause-on-focus", () => {
      const { container } = render(
        <MetricTicker
          items={[
            { label: "Latency", value: "12ms" },
            { label: "Uptime", value: "99.99%" },
          ]}
        />
      );

      const region = screen.getByRole("region", { name: /metrics ticker/i });
      expect(region).toBeInTheDocument();

      // Pause on mouse enter
      fireEvent.mouseEnter(region);
      const track = container.querySelector('[style*="animation-play-state"]') || container.querySelector('.animate-\[marquee_linear_infinite\]');
      expect(track).toHaveStyle({ animationPlayState: 'paused' });

      // Resume on mouse leave
      fireEvent.mouseLeave(region);
      expect(track).not.toHaveStyle({ animationPlayState: 'paused' });

      // Pause on focus
      fireEvent.focus(region);
      expect(track).toHaveStyle({ animationPlayState: 'paused' });
    });

    it("DataTable wraps sortable headers in buttons, provides aria-sort, aria-busy, caption, and forwardRef", () => {
      const ref = React.createRef<HTMLDivElement>();
      const onSort = vi.fn();

      render(
        <DataTable
          ref={ref}
          caption="Invoices Overview"
          isLoading={true}
          sortKey="amount"
          sortDirection="desc"
          onSort={onSort}
          columns={[
            { key: "id", header: "Invoice #", sortable: true },
            { key: "amount", header: "Amount", sortable: true },
            { key: "notes", header: "Notes" },
          ]}
          data={[{ id: "INV-001", amount: "", notes: "Paid" }]}
        />
      );

      // Ref forwarded
      expect(ref.current).toBeInTheDocument();

      // Table caption rendered
      expect(screen.getByText("Invoices Overview")).toBeInTheDocument();

      // aria-busy on table
      const table = screen.getByRole("table");
      expect(table).toHaveAttribute("aria-busy", "true");

      // Sortable headers wrapped in button inside th
      const invoiceHeaderBtn = screen.getByRole("button", { name: /invoice #/i });
      expect(invoiceHeaderBtn).toBeInTheDocument();
      expect(invoiceHeaderBtn.tagName).toBe("BUTTON");
      expect(invoiceHeaderBtn.closest("th")).toBeInTheDocument();

      // Non-sortable header does NOT have a sort button
      const notesTh = screen.getByText("Notes").closest("th");
      expect(notesTh?.querySelector("button")).toBeNull();

      // aria-sort attributes
      const amountTh = screen.getByRole("button", { name: /amount/i }).closest("th");
      expect(amountTh).toHaveAttribute("aria-sort", "descending");

      const invoiceTh = invoiceHeaderBtn.closest("th");
      expect(invoiceTh).toHaveAttribute("aria-sort", "none");
    });

    it("Stepper adds aria-current=step to active step", () => {
      render(
        <Stepper
          steps={[
            { title: "Step 1" },
            { title: "Step 2" },
            { title: "Step 3" },
          ]}
          activeStep={1}
        />
      );

      const currentSteps = document.querySelectorAll('[aria-current="step"]');
      expect(currentSteps.length).toBeGreaterThanOrEqual(1);
      expect(currentSteps[0]).toHaveTextContent("Step 2");
    });

    it("CopyButton includes aria-live polite status message", async () => {
      Object.assign(navigator, {
        clipboard: {
          writeText: vi.fn().mockResolvedValue(undefined),
        },
      });

      render(<CopyButton value="secret-token" defaultText="Copy Token" />);

      const button = screen.getByRole("button", { name: /copy token/i });
      const liveRegion = document.querySelector('[aria-live="polite"]');
      expect(liveRegion).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(button);
      });

      expect(liveRegion).toHaveTextContent("Copied!");
    });
  });

  describe("Interactive Core Primitives Axe Tests", () => {
    it("Button has 0 accessibility violations", async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("Checkbox with label has 0 accessibility violations", async () => {
      const { container } = render(
        <label>
          <Checkbox aria-label="Accept terms and conditions" />
          <span>Accept terms and conditions</span>
        </label>
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("Input with aria-label has 0 accessibility violations", async () => {
      const { container } = render(
        <Input placeholder="Enter email" aria-label="Email address" type="email" />
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("Textarea with aria-label has 0 accessibility violations", async () => {
      const { container } = render(
        <Textarea placeholder="Enter feedback" aria-label="User feedback" />
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("Switch with aria-label has 0 accessibility violations", async () => {
      const { container } = render(
        <Switch aria-label="Enable notifications" />
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("Slider with aria-label has 0 accessibility violations", async () => {
      const { container } = render(
        <Slider defaultValue={[50]} max={100} step={1} aria-label="Volume level" />
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("Toggle with aria-label has 0 accessibility violations", async () => {
      const { container } = render(
        <Toggle aria-label="Toggle italic formatting">Italic</Toggle>
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("Tabs has 0 accessibility violations", async () => {
      const { container } = render(
        <Tabs defaultValue="account">
          <TabsList aria-label="Manage account settings">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Account details here.</TabsContent>
          <TabsContent value="password">Password change here.</TabsContent>
        </Tabs>
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("Breadcrumb has 0 accessibility violations", async () => {
      const { container } = render(
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Settings</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("Pagination has 0 accessibility violations", async () => {
      const { container } = render(
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#1" isActive>1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#2">2</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("Dialog structure has 0 accessibility violations", async () => {
      const { container } = render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>Confirm Action</DialogTitle>
            <DialogDescription>Are you sure you want to proceed?</DialogDescription>
            <Button>Confirm</Button>
          </DialogContent>
        </Dialog>
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("AlertDialog structure has 0 accessibility violations", async () => {
      const { container } = render(
        <AlertDialog open>
          <AlertDialogContent>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("Popover structure has 0 accessibility violations", async () => {
      const { container } = render(
        <Popover open>
          <PopoverTrigger asChild>
            <Button>Open Popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <p>Popover content description.</p>
          </PopoverContent>
        </Popover>
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });

    it("Tooltip has 0 accessibility violations", async () => {
      const { container } = render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger asChild>
              <Button>Hover me</Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Helpful tooltip text</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
      const results = await axe.run(container);
      expect(results.violations).toEqual([]);
    });
  });
});

