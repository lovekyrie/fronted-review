# Scenario questions and system design

Scenario questions are not about reciting definitions. They show how you **split the problem, trade off, and ship**.

## Interview structure (recommended)

1. **Name the goal**: confirm business goals and constraints (perf, cost, compatibility, security).
2. **Split modules**: frontend, server, storage, observability.
3. **Give the main path first**: one sentence for the core flow, then edges and failures.
4. **Make the trade-off explicit**: complexity vs speed of delivery, realtime vs cost.
5. **Quantify**: which metrics after launch prove the design works.

## High-frequency scenarios

- Large files: chunked upload, resume, instant upload.
- Massive rendering: virtual lists, time slicing.
- Permissions: route auth, button-level permission, SSO / QR login.
- Complex interaction: drag-and-drop sort, rich-text caret and selection.
- System design: component library, monitoring SDK, global dialog.

## Guide

- `file-upload`: large-file design and key code.
- `massive-data-rendering`: huge lists and scheduling.
- `permission-system`: permission model and login flows.
- `complex-interaction`: drag-sort and rich-text hard parts.
- `system-design`: three frontend system-design templates.
