# Thermal Printer Integration Specification

## 1. Overview
BMS supports receipt and kitchen slip generation for thermal printers (80mm and 58mm widths).

## 2. Supported Connection Modes
1. **Browser Printing**: Formatted print sheets utilizing `@media print` CSS rules for instant receipt generation in any desktop or tablet browser.
2. **ESC/POS Command Protocol**: Generation of raw binary control commands:
   - Init: `ESC @`
   - Center text: `ESC a 1`
   - Bold on/off: `ESC E 1` / `ESC E 0`
   - Feed and Cut: `GS V 0`
3. **Local Print Agent / Virtual Emulator**:
   - A Node.js background agent or in-browser preview emulator for physical printer testing.
