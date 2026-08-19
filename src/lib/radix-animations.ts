/**
 * Shared Radix UI animation injector.
 * This script injects the necessary CSS keyframes and selectors into the document head
 * to handle animations for various Radix components (Dialog, AlertDialog, Sheet, Dropdown, etc.)
 * in a consistent way.
 */

const RADIX_STYLE_ID = "radix-ui-animations"

export function injectRadixAnimations() {
  if (typeof document === "undefined" || document.getElementById(RADIX_STYLE_ID)) {
    return
  }

  const style = document.createElement("style")
  style.id = RADIX_STYLE_ID
  style.textContent = `
    /* Overlay animations */
    @keyframes radix-overlay-in    { from { opacity: 0 } to { opacity: 1 } }
    @keyframes radix-overlay-out   { from { opacity: 1 } to { opacity: 0 } }
    
    /* Content/Dialog animations */
    @keyframes radix-content-in    { from { opacity: 0; transform: translate(-50%,-48%) scale(.95) } to { opacity: 1; transform: translate(-50%,-50%) scale(1) } }
    @keyframes radix-content-out   { from { opacity: 1; transform: translate(-50%,-50%) scale(1) } to { opacity: 0; transform: translate(-50%,-48%) scale(.95) } }
    
    /* Popup/Popover/Tooltip animations */
    @keyframes radix-popup-in      { from { opacity: 0; transform: scale(.95) } to { opacity: 1; transform: scale(1) } }
    @keyframes radix-popup-out     { from { opacity: 1; transform: scale(1) } to { opacity: 0; transform: scale(.95) } }
    
    /* Sheet animations */
    @keyframes radix-sheet-in-right  { from { transform: translateX(100%) } to { transform: translateX(0) } }
    @keyframes radix-sheet-out-right { from { transform: translateX(0) } to { transform: translateX(100%) } }
    @keyframes radix-sheet-in-left   { from { transform: translateX(-100%) } to { transform: translateX(0) } }
    @keyframes radix-sheet-out-left  { from { transform: translateX(0) } to { transform: translateX(-100%) } }
    @keyframes radix-sheet-in-top    { from { transform: translateY(-100%) } to { transform: translateY(0) } }
    @keyframes radix-sheet-out-top   { from { transform: translateY(0) } to { transform: translateY(-100%) } }
    @keyframes radix-sheet-in-bottom { from { transform: translateY(100%) } to { transform: translateY(0) } }
    @keyframes radix-sheet-out-bottom { from { transform: translateY(0) } to { transform: translateY(100%) } }

    /* Component Selectors */
    [data-radix-dialog-overlay][data-state=open],
    [data-radix-alert-dialog-overlay][data-state=open]  { animation: radix-overlay-in 0.15s ease-out }
    [data-radix-dialog-overlay][data-state=closed],
    [data-radix-alert-dialog-overlay][data-state=closed] { animation: radix-overlay-out 0.15s ease-in }

    [data-radix-dialog-content][data-state=open],
    [data-radix-alert-dialog-content][data-state=open]  { animation: radix-content-in 0.2s ease-out }
    [data-radix-dialog-content][data-state=closed],
    [data-radix-alert-dialog-content][data-state=closed] { animation: radix-content-out 0.15s ease-in }

    [data-radix-dropdown-menu-content][data-state=open],
    [data-radix-select-content][data-state=open],
    [data-radix-popover-content][data-state=open],
    [data-radix-tooltip-content][data-state=open],
    [data-radix-context-menu-content][data-state=open]   { animation: radix-popup-in 0.15s ease-out }

    [data-radix-dropdown-menu-content][data-state=closed],
    [data-radix-select-content][data-state=closed],
    [data-radix-popover-content][data-state=closed],
    [data-radix-tooltip-content][data-state=closed],
    [data-radix-context-menu-content][data-state=closed]  { animation: radix-popup-out 0.1s ease-in }

    /* Sheet Side-Specific Content Animations */
    [data-radix-dialog-content][data-side=right][data-state=open]   { animation: radix-sheet-in-right 0.3s ease-out }
    [data-radix-dialog-content][data-side=right][data-state=closed]  { animation: radix-sheet-out-right 0.25s ease-in }
    [data-radix-dialog-content][data-side=left][data-state=open]    { animation: radix-sheet-in-left 0.3s ease-out }
    [data-radix-dialog-content][data-side=left][data-state=closed]   { animation: radix-sheet-out-left 0.25s ease-in }
    [data-radix-dialog-content][data-side=top][data-state=open]     { animation: radix-sheet-in-top 0.3s ease-out }
    [data-radix-dialog-content][data-side=top][data-state=closed]    { animation: radix-sheet-out-top 0.25s ease-in }
    [data-radix-dialog-content][data-side=bottom][data-state=open]  { animation: radix-sheet-in-bottom 0.3s ease-out }
    [data-radix-dialog-content][data-side=bottom][data-state=closed] { animation: radix-sheet-out-bottom 0.25s ease-in }
  `
  document.head.appendChild(style)
}
