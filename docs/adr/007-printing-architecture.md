# ADR 007: Thermal Printing Architecture

## Status
Accepted

## Context
Bakery counter operations require fast receipt printing (80mm and 58mm thermal rolls) and kitchen staff rely on printed KOT slips with large font sizes. Web browsers running in cloud environments cannot send raw ESC/POS bytes directly to USB or network printers without specialized bridges.

## Decision
We implement a three-tiered printing architecture:
1. **Browser Direct Print (Fallback & Universal)**:
   - Dedicated print-optimized CSS (`@media print`) and responsive HTML receipt component supporting silent browser print (`window.print()`).
2. **Raw ESC/POS Byte Generator**:
   - Backend utility generating standard ESC/POS command sequences (bolding, centering, cut command `GS V 0`, line feeds).
3. **Local Print Agent / Print Emulator**:
   - WebSocket / HTTP print spooler client that can run locally on the counter Windows/Linux PC.
   - Built-in Virtual Print Emulator in BMS UI allowing testing and previewing receipt rolls without requiring physical hardware.
