// @vitest-environment node
import * as React from "react";
import { describe, it, expect } from "vitest";
import { renderToString } from "react-dom/server";
import fs from "node:fs";
import path from "node:path";

// Subpath Entry Imports for SSR Verification
import { cn as pureCn } from "../utils";
import { AnalyticsEngine as PureAnalyticsEngine, ConsoleAdapter as PureConsoleAdapter } from "../lib/analytics";
import { AnalyticsProvider as SsrAnalyticsProvider, TrackArea as SsrTrackArea } from "../lib/analytics/react";
import { calculateGSTSplit as pureCalculateGSTSplit, validateGSTIN as pureValidateGSTIN, INDIA_STATES as pureIndiaStates } from "../india";
import { AmountSummaryCardIndia as SsrAmountSummaryCardIndia } from "../india/react";
import { useToast as ssrUseToast, toast as ssrToast } from "../hooks/use-toast";
import { PdfViewer as SsrPdfViewer } from "../components/ui/data-display/pdf-viewer";

// Form Components
import { Button } from "../components/ui/forms/button";
import { ButtonGroup } from "../components/ui/forms/button-group";
import { Checkbox } from "../components/ui/forms/checkbox";
import { Input } from "../components/ui/forms/input";
import { InputGroup } from "../components/ui/forms/input-group";
import { InputOTP } from "../components/ui/forms/input-otp";
import { Label } from "../components/ui/forms/label";
import { SearchField } from "../components/ui/forms/search-field";
import { Slider } from "../components/ui/forms/slider";
import { Switch } from "../components/ui/forms/switch";
import { Textarea } from "../components/ui/forms/textarea";
import { Toggle } from "../components/ui/forms/toggle";
import { ToggleGroup, ToggleGroupItem } from "../components/ui/forms/toggle-group";
import { Field, FieldLabel, FieldDescription } from "../components/ui/forms/field";

// Data Display
import { Badge } from "../components/ui/data-display/badge";
import { StatusBadge } from "../components/ui/data-display/status-badge";
import { AmountSummaryCard } from "../components/ui/data-display/amount-summary-card";
import { AmountSummaryCardIndia } from "../india/react";
import { SalaryRangeDisplay } from "../components/ui/data-display/salary-range-display";
import { KPICard } from "../components/ui/data-display/kpi-card";
import { MatchScoreGauge } from "../components/ui/data-display/match-score-gauge";
import { RadarSweep } from "../components/ui/data-display/radar-sweep";
import { QuotaCard } from "../components/ui/data-display/quota-card";
import { Timeline } from "../components/ui/data-display/timeline";
import { DataTable } from "../components/ui/data-display/data-table";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/data-display/table";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../components/ui/data-display/accordion";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "../components/ui/data-display/collapsible";
import { ProofOfWorkCard } from "../components/ui/data-display/proof-of-work-card";
import { PipelineKanban } from "../components/ui/data-display/pipeline-kanban";
import { MetricTicker } from "../components/ui/data-display/metric-ticker";

// Layout
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../components/ui/layout/card";
import { PageHeader } from "../components/ui/layout/page-header";
import { Separator } from "../components/ui/layout/separator";
import { DetailGrid } from "../components/ui/layout/detail-grid";

// Navigation
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage } from "../components/ui/navigation/breadcrumb";
import { Stepper } from "../components/ui/navigation/stepper";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/navigation/tabs";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../components/ui/navigation/pagination";

// Feedback
import { Alert, AlertTitle, AlertDescription } from "../components/ui/feedback/alert";
import { Banner } from "../components/ui/feedback/banner";
import { CopyButton } from "../components/ui/feedback/copy-button";
import { EmptyState } from "../components/ui/feedback/empty-state";
import { ErrorBoundary } from "../components/ui/feedback/error-boundary";
import { LoadingState } from "../components/ui/feedback/loading-state";
import { Progress } from "../components/ui/feedback/progress";
import { ProgressRing } from "../components/ui/feedback/progress-ring";
import { Skeleton } from "../components/ui/feedback/skeleton";
import { Spinner } from "../components/ui/feedback/spinner";

describe("SSR Smoke Test Suite - renderToString Zero Crash Check", () => {
  const components: Array<{ name: string; element: React.ReactElement }> = [
    { name: "Button", element: <Button>Click me</Button> },
    { name: "ButtonGroup", element: <ButtonGroup><Button>One</Button><Button>Two</Button></ButtonGroup> },
    { name: "Checkbox", element: <Checkbox aria-label="Check" /> },
    { name: "Input", element: <Input placeholder="Type..." aria-label="Input" /> },
    { name: "InputGroup", element: <InputGroup><Input placeholder="Group" /></InputGroup> },
    { name: "InputOTP", element: <InputOTP maxLength={6}><div /></InputOTP> },
    { name: "Label", element: <Label>Test Label</Label> },
    { name: "SearchField", element: <SearchField placeholder="Search..." aria-label="Search" /> },
    { name: "Slider", element: <Slider defaultValue={[30]} max={100} aria-label="Slider" /> },
    { name: "Switch", element: <Switch aria-label="Toggle" /> },
    { name: "Textarea", element: <Textarea placeholder="Text..." aria-label="Notes" /> },
    { name: "Toggle", element: <Toggle aria-label="Toggle">B</Toggle> },
    {
      name: "ToggleGroup",
      element: (
        <ToggleGroup type="single">
          <ToggleGroupItem value="1">1</ToggleGroupItem>
        </ToggleGroup>
      ),
    },
    {
      name: "Field",
      element: (
        <Field id="f1">
          <FieldLabel>Name</FieldLabel>
          <Input id="f1" />
          <FieldDescription>Your full legal name</FieldDescription>
        </Field>
      ),
    },
    { name: "Badge", element: <Badge>Active</Badge> },
    { name: "StatusBadge", element: <StatusBadge status="success" label="Healthy" /> },
    {
      name: "AmountSummaryCard",
      element: (
        <AmountSummaryCard
          baseAmount={10000}
          taxes={[{ label: "VAT", amount: 1500 }]}
          shippingCost={200}
        />
      ),
    },
    {
      name: "AmountSummaryCardIndia",
      element: (
        <AmountSummaryCardIndia
          baseAmount={150000}
          gstRate={18}
          isIntraState={true}
          transportCost={2500}
          tdsPercentage={2}
        />
      ),
    },
    {
      name: "SalaryRangeDisplay",
      element: <SalaryRangeDisplay min={80} max={120} unit="k" variant="badge" />,
    },
    { name: "KPICard", element: <KPICard title="MRR" value="$120k" change={12} /> },
    { name: "MatchScoreGauge", element: <MatchScoreGauge score={85} /> },
    {
      name: "RadarSweep",
      element: <RadarSweep blips={[{ id: "1", x: 50, y: 50, label: "Node A" }]} />,
    },
    { name: "QuotaCard", element: <QuotaCard title="Storage" used={70} total={100} unitLabel="GB" /> },
    {
      name: "Timeline",
      element: (
        <Timeline
          items={[{ title: "Created", timestamp: "Today" }]}
        />
      ),
    },
    {
      name: "DataTable",
      element: (
        <DataTable
          columns={[{ key: "id", header: "ID" }]}
          data={[{ id: "1" }]}
        />
      ),
    },
    {
      name: "Table",
      element: (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Col</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Val</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ),
    },
    {
      name: "Accordion",
      element: (
        <Accordion type="single">
          <AccordionItem value="1">
            <AccordionTrigger>Question</AccordionTrigger>
            <AccordionContent>Answer</AccordionContent>
          </AccordionItem>
        </Accordion>
      ),
    },
    {
      name: "Collapsible",
      element: (
        <Collapsible>
          <CollapsibleTrigger>Toggle</CollapsibleTrigger>
          <CollapsibleContent>Details</CollapsibleContent>
        </Collapsible>
      ),
    },
    {
      name: "ProofOfWorkCard",
      element: (
        <ProofOfWorkCard
          item={{ title: "Review Task", type: "github", verified: true }}
        />
      ),
    },
    {
      name: "PipelineKanban",
      element: (
        <PipelineKanban
          columns={[
            { id: "c1", title: "Backlog", items: [{ id: "t1", title: "Task 1" }] },
          ]}
        />
      ),
    },
    { name: "MetricTicker", element: <MetricTicker items={[{ label: "Signups", value: 1234 }]} /> },
    {
      name: "Card",
      element: (
        <Card>
          <CardHeader>
            <CardTitle>Title</CardTitle>
            <CardDescription>Desc</CardDescription>
          </CardHeader>
          <CardContent>Body</CardContent>
          <CardFooter>Footer</CardFooter>
        </Card>
      ),
    },
    { name: "PageHeader", element: <PageHeader title="Dashboard" description="Overview" /> },
    { name: "Separator", element: <Separator /> },
    {
      name: "DetailGrid",
      element: (
        <DetailGrid>
          <div>Status: Live</div>
        </DetailGrid>
      ),
    },
    {
      name: "Breadcrumb",
      element: (
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbPage>Current</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      ),
    },
    {
      name: "Stepper",
      element: <Stepper steps={[{ title: "One" }, { title: "Two" }]} activeStep={0} />,
    },
    {
      name: "Tabs",
      element: (
        <Tabs defaultValue="t1">
          <TabsList>
            <TabsTrigger value="t1">Tab 1</TabsTrigger>
          </TabsList>
          <TabsContent value="t1">Content 1</TabsContent>
        </Tabs>
      ),
    },
    {
      name: "Pagination",
      element: (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationLink href="#1" isActive>1</PaginationLink>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ),
    },
    {
      name: "Alert",
      element: (
        <Alert>
          <AlertTitle>Notice</AlertTitle>
          <AlertDescription>System is operating normally</AlertDescription>
        </Alert>
      ),
    },
    { name: "Banner", element: <Banner title="Maintenance scheduled" /> },
    { name: "CopyButton", element: <CopyButton value="secret" defaultText="Copy" /> },
    { name: "EmptyState", element: <EmptyState title="No items" description="Create one" /> },
    {
      name: "ErrorBoundary",
      element: (
        <ErrorBoundary fallback={<div>Error</div>}>
          <div>Safe Content</div>
        </ErrorBoundary>
      ),
    },
    { name: "LoadingState", element: <LoadingState label="Loading..." /> },
    { name: "Progress", element: <Progress value={45} /> },
    { name: "ProgressRing", element: <ProgressRing percentage={75} /> },
    { name: "Skeleton", element: <Skeleton className="h-4 w-20" /> },
    { name: "Spinner", element: <Spinner /> },
  ];

  for (const { name, element } of components) {
    it(`renders ${name} to string without throwing or crashing`, () => {
      expect(() => {
        const html = renderToString(element);
        expect(html).toBeDefined();
        expect(html.length).toBeGreaterThan(0);
      }).not.toThrow();
    });
  }
});

describe("SSR Subpath Purity & Execution Suite - All 8 package.json Exports", () => {
  const DIST_DIR = path.resolve(__dirname, "../../dist");

  function assertDirective(filePath: string, expected: "client" | "pure") {
    const fullPath = path.join(DIST_DIR, filePath);
    expect(fs.existsSync(fullPath), `Artifact must exist: ${filePath}`).toBe(true);
    const content = fs.readFileSync(fullPath, "utf-8");
    const firstLine = content.split("\n")[0]?.trim() || "";

    if (expected === "client") {
      expect(
        firstLine.startsWith("'use client';") || firstLine.startsWith('"use client";'),
        `${filePath} must have 'use client' as line 1 (got: ${firstLine})`
      ).toBe(true);
    } else {
      expect(
        content.includes("'use client'") || content.includes('"use client"'),
        `${filePath} must NOT contain 'use client' directive`
      ).toBe(false);
    }
  }

  // 1. Export "." (Root entry)
  it("subpath '.' has 'use client' banner and renders in SSR without throwing", () => {
    assertDirective("index.js", "client");
    expect(() => {
      const html = renderToString(
        <div>
          <Button>Root Button</Button>
          <Badge>Root Badge</Badge>
        </div>
      );
      expect(html).toContain("Root Button");
      expect(html).toContain("Root Badge");
    }).not.toThrow();
  });

  // 2. Export "./utils"
  it("subpath './utils' has NO 'use client' and executes server-side without throwing", () => {
    assertDirective("utils.js", "pure");
    expect(typeof pureCn).toBe("function");
    expect(pureCn("px-4", "py-2")).toBe("px-4 py-2");
  });

  // 3. Export "./analytics"
  it("subpath './analytics' has NO 'use client', zero React hooks/DOM, and executes server-side without throwing", () => {
    assertDirective("analytics/index.js", "pure");
    const analyticsContent = fs.readFileSync(path.join(DIST_DIR, "analytics/index.js"), "utf-8");
    expect(analyticsContent).not.toMatch(/\buseState\b/);
    expect(analyticsContent).not.toMatch(/\buseEffect\b/);
    expect(analyticsContent).not.toMatch(/\bcreateContext\b/);

    expect(PureAnalyticsEngine).toBeDefined();

    const engine = new PureAnalyticsEngine({
      appId: "ssr-test-app",
      adapters: [new PureConsoleAdapter()],
      autoTrackDom: false,
      autoTrackPages: false,
    });

    expect(engine).toBeDefined();
    expect(typeof engine.track).toBe("function");
    expect(typeof engine.destroy).toBe("function");
  });

  // 4. Export "./analytics/react"
  it("subpath './analytics/react' has 'use client' banner and renders in SSR without throwing", () => {
    assertDirective("analytics/react/index.js", "client");
    expect(() => {
      const html = renderToString(
        <SsrAnalyticsProvider config={{ appId: "ssr-app", autoTrackDom: false, autoTrackPages: false }}>
          <SsrTrackArea journey="ssr-test-area">
            <div>SSR Tracked Content</div>
          </SsrTrackArea>
        </SsrAnalyticsProvider>
      );
      expect(html).toContain("SSR Tracked Content");
    }).not.toThrow();
  });

  // 5. Export "./india"
  it("subpath './india' has NO 'use client' and executes pure domain calculations server-side without throwing", () => {
    assertDirective("india/index.js", "pure");
    expect(pureValidateGSTIN("29ABCDE1234F1Z5")).toBeUndefined();
    expect(pureValidateGSTIN("invalid")).toBeDefined();
    const split = pureCalculateGSTSplit(1000, 18, true);
    expect(split.cgstAmount).toBe(90);
    expect(split.sgstAmount).toBe(90);
    expect(split.totalPayable).toBe(1180);
    expect(pureIndiaStates.length).toBeGreaterThan(20);
  });

  // 6. Export "./india/react"
  it("subpath './india/react' has 'use client' banner and renders in SSR without throwing", () => {
    assertDirective("india/react/index.js", "client");
    expect(() => {
      const html = renderToString(
        <SsrAmountSummaryCardIndia
          baseAmount={1000}
          gstRate={18}
          isIntraState={true}
        />
      );
      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(0);
    }).not.toThrow();
  });

  // 7. Export "./hooks/use-toast"
  it("subpath './hooks/use-toast' has 'use client' banner and executes in SSR without throwing", () => {
    assertDirective("hooks/use-toast.js", "client");
    expect(typeof ssrToast).toBe("function");

    function ToastConsumer() {
      const { toasts } = ssrUseToast();
      return <div data-testid="toasts-len">{toasts.length}</div>;
    }

    expect(() => {
      const html = renderToString(<ToastConsumer />);
      expect(html).toContain("toasts-len");
    }).not.toThrow();
  });

  // 8. Export "./pdf"
  it("subpath './pdf' has 'use client' banner and renders in SSR without throwing", () => {
    assertDirective("pdf.js", "client");
    expect(() => {
      const html = renderToString(<SsrPdfViewer file="sample.pdf" />);
      expect(html).toBeDefined();
      expect(html.length).toBeGreaterThan(0);
    }).not.toThrow();
  });
});


