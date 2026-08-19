# react-lib Component Wiki

> **Visual cookbook for `@umesh0492/react-libs`** — copy-paste patterns for every component.
> - **70+ components** across 6 semantic domains
> - **Storybook 10** at http://localhost:6006 — live visual playground

### Quick Domain Index

| Domain | Components |
|---|---|
| **Forms** | Button, Input, Textarea, Select, FilterSelect, Checkbox, RadioGroup, Switch, Toggle, ToggleGroup, Slider, Form, Label, InputGroup, ButtonGroup |
| **Data Display** | Badge, StatusBadge, ActiveFilterBadge, Avatar, Card, DataTable, Table, Chart, Accordion, Collapsible, Carousel, HoverCard |
| **Layout** | PageHeader, Separator, ScrollArea, AspectRatio, ResizablePanelGroup |
| **Overlays** | Dialog, AlertDialog, ConfirmDialog, Sheet, Popover, Tooltip, HoverCard, DropdownMenu, ContextMenu, Command, Drawer |
| **Navigation** | Sidebar, NavigationMenu, Breadcrumb, Tabs, Menubar, Pagination |
| **Feedback** | Toast/Toaster, Sonner, Skeleton, Progress, Spinner, Alert, EmptyState, RoleEmptyState |

> Full API docs → [README.md](./README.md) · Full test patterns → [test.md](./test.md)

---

## Button

```tsx
import { Button } from "@ui/forms/button"
// OR: import { Button } from "@umesh0492/react-libs"
```

### Variants

| Variant | Code | Use Case |
|---|---|---|
| Default (Green) | `<Button>Save</Button>` | Primary action |
| Outline | `<Button variant="outline">Cancel</Button>` | Secondary action |
| Destructive | `<Button variant="destructive">Delete</Button>` | Irreversible actions |
| Ghost | `<Button variant="ghost">More</Button>` | Subtle / icon buttons |
| Secondary | `<Button variant="secondary">Filter</Button>` | Supporting actions |
| Link | `<Button variant="link">View details</Button>` | Inline text links |

### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Trash2 /></Button>   {/* Square icon button */}
```

### Loading State

```tsx
// Spinner auto-shows, button auto-disables
<Button isLoading={isSubmitting} loadingText="Saving...">Save Changes</Button>
<Button variant="destructive" isLoading={isDeleting}>Delete</Button>
<Button variant="outline" isLoading={isFetching} size="sm">Refresh</Button>
```

---

## StatusBadge

```tsx
import { StatusBadge } from "@ui/data-display/status-badge"
```

Covers every status across the procurement domain. Always consistent colour — do not build custom status indicators.

```tsx
// Order lifecycle
<StatusBadge status="pending" />             // 🟡 Amber
<StatusBadge status="confirmed" />           // 🔵 Blue
<StatusBadge status="in_progress" />         // 🔵 Blue
<StatusBadge status="dispatched" />          // 🟣 Indigo
<StatusBadge status="delivered" />           // 🟢 Green
<StatusBadge status="partially_delivered" /> // 🟡 Amber
<StatusBadge status="cancelled" />           // 🔴 Red
<StatusBadge status="returned" />            // 🟠 Orange

// Payment
<StatusBadge status="paid" />               // 🟢 Green
<StatusBadge status="unpaid" />             // 🔴 Red
<StatusBadge status="partially_paid" />     // 🟡 Amber
<StatusBadge status="overdue_payment" />    // 🔴 Dark Red

// RFQ / Tender
<StatusBadge status="open" />              // 🔵 Blue
<StatusBadge status="awarded" />           // 🟢 Green
<StatusBadge status="closed" />            // ⚫ Slate
<StatusBadge status="expired" />           // ⚫ Slate

// Dispute / Compliance
<StatusBadge status="under_review" />      // 🟣 Purple
<StatusBadge status="escalated" />         // 🔴 Red
<StatusBadge status="resolved" />          // 🟢 Green

// Documents
<StatusBadge status="verified" />          // 🟢 Green
<StatusBadge status="expired_doc" />       // 🔴 Red
<StatusBadge status="uploaded" />          // 🔵 Blue

// Modifier props
<StatusBadge status="active" size="sm" />            // Compact variant
<StatusBadge status="active" showDot={false} />      // No dot icon
<StatusBadge status="pending" label="Awaiting GRN" /> // Custom label override
```

---

## PageHeader

```tsx
import { PageHeader, PageHeaderSkeleton } from "@ui/layout/page-header"
```

**Use on every page** for consistent spacing, breadcrumbs, and action placement.

```tsx
// Minimal — just a title
<PageHeader title="Invoices" />

// Full featured
<PageHeader
  title="Purchase Orders"
  description="Track all active and completed orders across partners"
  badge={<StatusBadge status="active" size="sm" />}
  breadcrumbs={
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem><BreadcrumbPage>Orders</BreadcrumbPage></BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  }
  actions={
    <>
      <Button variant="outline" size="sm"><Download /> Export</Button>
      <Button><Plus /> New PO</Button>
    </>
  }
/>

// Loading state
{isLoading ? <PageHeaderSkeleton /> : <PageHeader title="Orders" ... />}
```

**Responsive:** title truncates on mobile, actions wrap below title on small screens.

---

## DataTable

```tsx
import { DataTable } from "@ui/data-display/data-table"
```

Generic sortable table with skeleton loading, empty state, and pagination.

```tsx
const columns = [
  {
    key: "poNumber",
    header: "PO Number",
    sortable: true,
  },
  {
    key: "partner",
    header: "Partner",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Avatar className="h-6 w-6"><AvatarFallback>{row.partner.name[0]}</AvatarFallback></Avatar>
        <span>{row.partner.name}</span>
      </div>
    ),
  },
  {
    key: "amount",
    header: "Amount",
    cell: (row) => formatCurrency(row.amount),
    className: "text-right tabular-nums",
    headerClassName: "text-right",
  },
  {
    key: "status",
    header: "Status",
    cell: (row) => <StatusBadge status={row.status} />,
  },
  {
    key: "actions",
    header: "",
    cell: (row) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon"><MoreHorizontal /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => navigate(`/po/${row.id}`)}>View</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => setDeleteTarget(row.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

<DataTable
  columns={columns}
  data={orders}
  rowKey={(row) => row.id}
  isLoading={isLoading}
  skeletonRows={10}
  emptyMessage="No purchase orders found. Create your first PO."
  sortKey={sortKey}
  sortDirection={sortDir}
  onSort={(key, dir) => { setSortKey(key); setSortDir(dir) }}
  onRowClick={(row) => navigate(`/orders/${row.id}`)}
  pagination={{
    page,
    pageSize: 20,
    total: totalCount,
    onPageChange: setPage,
  }}
/>
```

**Responsive:** horizontal scroll on mobile, "Page X / N" pagination on xs screens.

---

## ConfirmDialog

```tsx
import { ConfirmDialog } from "@ui/overlays/confirm-dialog"
```

Replace all manual `<AlertDialog>` confirm patterns with this. Handles own loading state.

```tsx
const [showDelete, setShowDelete] = useState(false)
const [isDeleting, setIsDeleting] = useState(false)

async function handleDelete() {
  setIsDeleting(true)
  await deleteOrder(orderId)
  setIsDeleting(false)
  setShowDelete(false)
}

<Button variant="destructive" size="sm" onClick={() => setShowDelete(true)}>
  Delete Order
</Button>

<ConfirmDialog
  open={showDelete}
  onOpenChange={setShowDelete}
  title="Delete Purchase Order?"
  description="PO-2024-001 will be permanently deleted. This action cannot be undone."
  variant="destructive"
  confirmLabel="Delete"
  cancelLabel="Keep Order"
  isLoading={isDeleting}
  onConfirm={handleDelete}
/>
```

---

## Dialog (Modal)

```tsx
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from "@ui/overlays/dialog"
```

> **Rule:** Always use `@ui/overlays/dialog` — never build custom modals. `dialog.tsx` manages its own overlay, animations, portal, and focus trap via Radix.

```tsx
const [open, setOpen] = useState(false)

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent className="sm:max-w-[500px]">
    <DialogHeader>
      <DialogTitle>Edit Partner Profile</DialogTitle>
      <DialogDescription>
        Update the partner's contact and billing information.
      </DialogDescription>
    </DialogHeader>

    <div className="grid gap-4 py-4">
      <Input placeholder="Company name" />
    </div>

    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button isLoading={isSaving}>Save Changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Sheet (Slide-in Panel)

```tsx
import {
  Sheet, SheetContent, SheetHeader,
  SheetTitle, SheetDescription, SheetFooter,
} from "@ui/overlays/sheet"
```

```tsx
<Sheet open={open} onOpenChange={setOpen}>
  <SheetTrigger asChild>
    <Button variant="outline">Edit Details</Button>
  </SheetTrigger>
  <SheetContent side="right" className="w-[480px] sm:max-w-[480px]">
    <SheetHeader>
      <SheetTitle>Partner Details</SheetTitle>
      <SheetDescription>View and update partner information.</SheetDescription>
    </SheetHeader>
    <div className="py-6">
      {/* Content */}
    </div>
    <SheetFooter>
      <Button onClick={() => setOpen(false)}>Save</Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

`side` options: `"top"` | `"bottom"` | `"left"` | `"right"` (default: `"right"`)

---

## Form Inputs (react-hook-form + Zod)

```tsx
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@ui/forms/form"
import { Input } from "@ui/forms/input"
import { Textarea } from "@ui/forms/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/forms/select"
import { Checkbox } from "@ui/forms/checkbox"
import { Switch } from "@ui/forms/switch"
```

```tsx
const schema = z.object({
  partnerName: z.string().min(2),
  category: z.enum(["produce", "dairy", "dry"]),
  notes: z.string().optional(),
  active: z.boolean().default(true),
})

const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) })

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
    <FormField
      control={form.control}
      name="partnerName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Partner Name</FormLabel>
          <FormControl>
            <Input placeholder="e.g. Fresh Farms Pvt Ltd" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="category"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Category</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="produce">Fresh Produce</SelectItem>
              <SelectItem value="dairy">Dairy</SelectItem>
              <SelectItem value="dry">Dry Goods</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="active"
      render={({ field }) => (
        <FormItem className="flex items-center gap-2">
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <FormLabel className="!mt-0">Active Partner</FormLabel>
        </FormItem>
      )}
    />

    <Button type="submit" isLoading={form.formState.isSubmitting}>
      Save Partner
    </Button>
  </form>
</Form>
```

---

## Hooks

```tsx
import { useDebounce, useLocalStorage, useIsMobile } from "@umesh0492/react-libs"
```

### useDebounce — Search

```tsx
const [query, setQuery] = useState("")
const debouncedQuery = useDebounce(query, 400)

useEffect(() => {
  fetchPartners({ search: debouncedQuery })
}, [debouncedQuery])

<Input
  placeholder="Search partners..."
  value={query}
  onChange={(e) => setQuery(e.target.value)}
/>
```

### useLocalStorage — Persistent State

```tsx
// Syncs across tabs, persists across reloads, type-safe
const [pageSize, setPageSize] = useLocalStorage<number>("po-table-size", 20)
const [filters, setFilters] = useLocalStorage("partner-filters", { status: "all" })
const [sidebarOpen, setSidebarOpen] = useLocalStorage("sidebar-open", true)
```

### useIsMobile — Responsive Logic

```tsx
const isMobile = useIsMobile()   // true if viewport < 768px

{isMobile ? <Sheet>...</Sheet> : <Popover>...</Popover>}
```

---

## Formatters

```tsx
import {
  formatCurrency, formatDate, formatDateTime, formatRelativeTime,
  formatWeight, formatQuantity, formatFileSize, formatPercent,
  formatLocalizedDate, formatLocalizedDateTime, formatLocalizedNumber,
} from "@umesh0492/react-libs"
```

### In Table Cells

```tsx
cell: (row) => formatCurrency(row.totalAmount)        // ₹1,23,456.78
cell: (row) => formatDate(row.deliveryDate)            // 27 Mar 2026
cell: (row) => formatDateTime(row.createdAt)           // 27 Mar 2026, 14:32
cell: (row) => formatRelativeTime(row.createdAt)       // 3h ago
cell: (row) => formatWeight(row.quantity, "kg")        // 12.5 kg
cell: (row) => formatPercent(row.fulfillmentRate)      // 94.2%
cell: (row) => formatFileSize(row.document?.size)      // 2.4 MB

// All return "—" for null/undefined/NaN — safe to use directly in JSX
```

### Migration Guide — Replace Custom Formatters

```tsx
// ❌ Before — ad hoc date formatting
new Date(record.created_at).toLocaleDateString('en-IN', {
  day: '2-digit', month: 'short', year: 'numeric'
})

// ✅ After
formatDate(record.created_at)

// ❌ Before — local fmtTs helper
fmtTs(record.updated_at)

// ✅ After
formatRelativeTime(record.updated_at)
```

---

## Toast Notifications

```tsx
import { useToast } from "@ui/feedback/use-toast"
import { Toaster } from "@ui/feedback/toaster"

// Add <Toaster /> once in App.tsx / root layout
```

```tsx
const { toast } = useToast()

// Success
toast({ title: "Order confirmed", description: "PO-001 has been approved.", variant: "success" })

// Error
toast({ title: "Payment failed", description: "Card was declined.", variant: "destructive" })

// Info
toast({ title: "Export ready", description: "Download will start shortly.", variant: "info" })

// Warning
toast({ title: "Low stock warning", description: "Only 3 units remaining.", variant: "warning" })
```

**Variants:** `default` · `success` · `destructive` · `warning` · `info`

---

## Skeleton Loading

```tsx
import { Skeleton } from "@ui/feedback/skeleton"
```

```tsx
// Card loading state
<Card>
  <CardContent className="p-6 space-y-3">
    <Skeleton className="h-5 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-2/3" />
  </CardContent>
</Card>

// DataTable handles skeletons automatically via isLoading prop — no extra code needed
<DataTable isLoading={isLoading} skeletonRows={10} ... />
```

---

## EmptyState

```tsx
import { EmptyState } from "@ui/feedback/empty-state"
import { RoleEmptyState } from "@ui/feedback/role-empty-state"
```

```tsx
// Generic empty state
<EmptyState
  icon={<Package className="h-12 w-12 text-muted-foreground" />}
  title="No purchase orders"
  description="Create your first PO to get started."
  action={<Button><Plus /> Create PO</Button>}
/>

// Permission-aware — shows different content based on user role
<RoleEmptyState
  role="partner"                     // "admin" | "partner" | "catalog"
  entity="purchase-order"
  onCreate={() => setOpenCreate(true)}
/>
```

---

## Chart

```tsx
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
  ChartLegend, ChartLegendContent,
} from "@ui/data-display/chart"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts"
```

```tsx
const chartConfig = {
  sales: { label: "Sales", color: "hsl(142 76% 36%)" },
  revenue: { label: "Revenue", color: "hsl(221 83% 53%)" },
}

const data = [
  { month: "Jan", sales: 120, revenue: 240 },
  { month: "Feb", sales: 150, revenue: 300 },
]

<ChartContainer config={chartConfig} className="h-64">
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="month" />
    <YAxis />
    <ChartTooltip content={<ChartTooltipContent />} />
    <ChartLegend content={<ChartLegendContent />} />
    <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
    <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
  </BarChart>
</ChartContainer>
```

---

## Sidebar

```tsx
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarFooter,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarProvider, SidebarTrigger, SidebarInset,
} from "@ui/navigation/sidebar"
```

```tsx
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>
      <div className="flex items-center gap-2 px-4 py-3">
        <Logo />
        <span className="font-semibold">Admin Portal</span>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Main</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={location.pathname === "/dashboard"}>
                <a href="/dashboard"><LayoutDashboard /> Dashboard</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/orders"><ShoppingCart /> Purchase Orders</a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Settings /> Settings
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>

  <SidebarInset>
    <header className="flex h-16 items-center gap-2 px-4 border-b">
      <SidebarTrigger />  {/* Hamburger toggle */}
      <Breadcrumb>...</Breadcrumb>
    </header>
    <main className="p-6">
      {/* Page content */}
    </main>
  </SidebarInset>
</SidebarProvider>
```

---

## Pagination

```tsx
import { Pagination, PaginationContent, PaginationItem,
  PaginationNext, PaginationPrevious, PaginationButton,
} from "@ui/navigation/pagination"
```

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} />
    </PaginationItem>
    {[1, 2, 3].map(n => (
      <PaginationItem key={n}>
        <PaginationButton isActive={page === n} onClick={() => setPage(n)}>{n}</PaginationButton>
      </PaginationItem>
    ))}
    <PaginationItem>
      <PaginationNext onClick={() => setPage(p => p + 1)} disabled={page >= totalPages} />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

> `DataTable` wraps this automatically via the `pagination` prop — use `Pagination` only for custom layouts.

---

## Accordion

```tsx
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@ui/data-display/accordion"
```

```tsx
<Accordion type="single" collapsible defaultValue="item-1">
  <AccordionItem value="item-1">
    <AccordionTrigger>Delivery Information</AccordionTrigger>
    <AccordionContent>
      Expected delivery: 27 Mar 2026
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Payment Terms</AccordionTrigger>
    <AccordionContent>
      Net 30 days from invoice date.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

> **Testing note:** Assert `toBeInTheDocument()` — NOT `toBeVisible()` — on content. Radix uses `height: 0` during close animation.

---

## Tabs

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/navigation/tabs"
```

```tsx
<Tabs defaultValue="orders">
  <TabsList>
    <TabsTrigger value="orders">Orders</TabsTrigger>
    <TabsTrigger value="invoices">Invoices</TabsTrigger>
    <TabsTrigger value="disputes">Disputes</TabsTrigger>
  </TabsList>
  <TabsContent value="orders"><OrdersTable /></TabsContent>
  <TabsContent value="invoices"><InvoicesTable /></TabsContent>
  <TabsContent value="disputes"><DisputesTable /></TabsContent>
</Tabs>
```

---

## Tooltip

```tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@ui/overlays/tooltip"
```

```tsx
<TooltipProvider delayDuration={0}>   {/* delayDuration=0 in stories/tests */}
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="ghost" size="icon"><Info /></Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>View order details</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

> **Testing:** Query via `within(document.body).getByRole('tooltip')` — Tooltip renders in a portal.

---

## Breadcrumb

```tsx
import {
  Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage,
} from "@ui/navigation/breadcrumb"
```

```tsx
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/orders">Orders</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>PO-2024-001</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

---

## Full Page Pattern — Table with Search, Sort & Delete

```tsx
export function OrdersPage() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState("createdAt")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const debouncedQuery = useDebounce(query, 400)

  const { data, isLoading } = useOrders({ page, search: debouncedQuery, sortKey, sortDir })

  async function handleDelete(id: string) {
    setIsDeleting(true)
    await deleteOrder(id)
    setIsDeleting(false)
    setDeleteId(null)
  }

  return (
    <div className="space-y-4 p-4 md:p-6">
      <PageHeader
        title="Purchase Orders"
        description="All active and completed purchase orders"
        actions={<Button><Plus />New PO</Button>}
      />

      <div className="flex gap-2">
        <Input
          placeholder="Search orders..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        rowKey={(row) => row.id}
        isLoading={isLoading}
        emptyMessage="No purchase orders found."
        sortKey={sortKey}
        sortDirection={sortDir}
        onSort={(key, dir) => { setSortKey(key); setSortDir(dir) }}
        onRowClick={(row) => navigate(`/orders/${row.id}`)}
        pagination={{ page, pageSize: 20, total: data?.total ?? 0, onPageChange: setPage }}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Order?"
        description="This cannot be undone."
        variant="destructive"
        confirmLabel="Delete"
        isLoading={isDeleting}
        onConfirm={() => handleDelete(deleteId!)}
      />
    </div>
  )
}
```
