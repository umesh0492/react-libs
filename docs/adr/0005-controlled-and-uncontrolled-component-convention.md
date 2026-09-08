# ADR 0005: Controlled vs Uncontrolled State and Ref Forwarding Convention

## Status
Accepted

## Context
Form components in `@umesh0492/react-libs` are utilized across different paradigms:
1. Uncontrolled forms leveraging native FormData or `react-hook-form` / `uncontrolled` integrations.
2. Controlled forms where state is strictly managed in host React state or external state management engines (Zustand, Redux).

Previous versions of components like `Combobox`, `MultiSelect`, and `FileUpload` threw errors or functioned inconsistently when `value` or `onChange` were omitted. Additionally, several composite components (`Field`, `Sidebar`, `withAuditTrail` HOC) dropped forwarded refs, making it impossible for parent components or third-party focus managers to access underlying DOM nodes.

## Decision
1. **Hybrid Controlled/Uncontrolled State Support**:
   - All interactive form components must seamlessly support both controlled and uncontrolled usage:
     - If `value !== undefined`, the component behaves as controlled, relying on `onChange` to broadcast state transitions.
     - If `value === undefined`, the component falls back to internal state initialized via `defaultValue` or sensible empty defaults (`""`, `[]`).
2. **Universal `React.forwardRef` Enforcement**:
   - Every exported visual and composite primitive must wrap its implementation in `React.forwardRef`:
     - `Combobox`, `Field`, `MultiSelect`, `FileUpload`, `DataTable`.
     - Navigation composites (`Sidebar`, `SidebarHeader`, `SidebarContent`, `SidebarFooter`).
     - Telemetry HOCs (`withAuditTrail` must forward the ref to the wrapped target component).
3. **Consistent `displayName`**:
   - Every forwardRef component must explicitly declare its `displayName` to facilitate debugging in React DevTools.
4. **Prop Pass-Through & className Merging**:
   - Container elements must accept standard HTML attributes (e.g. `React.HTMLAttributes<HTMLDivElement>`) and merge user-supplied `className` using `cn(...)`.

## Consequences
- **Positive**:
  - Components work reliably with or without React state handlers.
  - Full compatibility with `react-hook-form`'s `register` and `useForm` hooks.
  - Zero ref-dropping in higher-order telemetry and audit wrappers.
- **Negative**:
  - Requires internal state synchronization logic in components supporting both controlled and uncontrolled contracts.
