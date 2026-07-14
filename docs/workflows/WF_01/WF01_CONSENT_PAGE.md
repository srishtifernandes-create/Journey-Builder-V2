# WF01 — RM Assisted Consent Workflow

**Workflow ID:** WF01  
**Journey:** CUB RM Assisted Account Opening  
**Version:** 1.0  
**Status:** Draft (Implementation Specification)  
**Owner:** Product Design  
**Implementation Status:** Not Implemented  
**Last Updated:** DD/MM/YYYY

---

# 1. Business Context

The RM Assisted Consent Workflow is the first customer-facing interaction in the CUB onboarding journey.

Before any customer onboarding activity can begin, explicit customer consent must be obtained. This workflow enables the Relationship Manager (RM) to capture or verify the customer's contact information and initiate the consent request through IDfy's Child Journey infrastructure.

The workflow acts as the gateway into the remainder of the onboarding journey.

Without successful completion of this workflow:

- no customer onboarding journey may begin
- no subsequent screens become available
- no KYC or verification APIs are executed
- no downstream business process is initiated

This workflow therefore represents the entry point into the complete onboarding graph.

---

# 2. Business Objective

Enable a Relationship Manager to securely obtain customer consent before initiating account onboarding.

The workflow must support:

- Customer Mobile Consent
- Customer Email Consent
- Child Journey Creation
- Consent Link Delivery
- Consent Retry Logic
- Consent Status Tracking
- Journey Blocking
- Journey Continuation

The workflow should minimise RM effort while ensuring regulatory compliance and complete auditability.

---

# 3. Personas

## Primary Persona

### Relationship Manager (RM)

Responsible for:

- initiating onboarding
- verifying customer details
- requesting consent
- monitoring consent status
- proceeding only after consent

---

## Secondary Persona

### Customer

Receives consent request through:

- SMS

or

- Email

The customer completes consent outside the RM Assisted application through the Child Journey.

---

## Supporting Systems

### IDfy Journey Builder

Responsible for:

- rendering workflow
- executing rules
- orchestrating APIs
- maintaining workflow state

---

### Child Journey Service

Responsible for:

- generating customer journey
- generating consent URL
- tracking consent completion

---

### Notification Services

Responsible for:

- SMS Delivery

- Email Delivery

---

# 4. Workflow Scope

## Included

✔ Display Consent Screen

✔ Validate mandatory customer details

✔ Enable / Disable Send Consent action

✔ Create Child Journey

✔ Send Consent through SMS

✔ Send Consent through Email

✔ Wait for customer response

✔ Poll consent status

✔ Retry consent

✔ Block journey after retry threshold

✔ Continue onboarding after consent

---

## Out of Scope

The following workflows are implemented separately.

- PAN Collection

- Aadhaar Collection

- CKYC

- Document Upload

- Face Capture

- Video KYC

- Account Opening

- Final Submission

These workflows are referenced by WF01 but are not implemented here.

---

# 5. Success Criteria

The workflow is considered successful when:

1.

The RM successfully initiates a consent request.

2.

The customer provides consent.

3.

The Child Journey reports successful completion.

4.

The onboarding workflow automatically proceeds to the next journey stage.

---

The workflow is considered unsuccessful when:

- customer never provides consent
- maximum retry threshold is exceeded
- child journey creation fails
- notification delivery fails permanently
- mandatory customer information is unavailable

---

# 6. Workflow Overview

The Consent Workflow is represented by the following business flow.

```
Journey Start

↓

Consent Screen

↓

Validate Mandatory Information

↓

Enable Send Consent

↓

Create Child Journey

↓

Generate Consent Link

↓

Send Notification

↓

Wait For Customer

↓

Consent Status Received?

        │
   Yes  │  No
        │
        ▼
Continue Journey

        │

OR

Retry Consent

        │

Maximum Retries Exceeded?

        │
   Yes  │  No

        ▼

Journey Blocked
```

The workflow is intentionally linear until customer interaction occurs.

After notification delivery the workflow becomes event-driven, responding to consent status updates from the Child Journey service.

---

# 7. Canvas Representation

Within Journey Builder, WF01 is authored using reusable workflow nodes.

The canvas should visually represent the business flow rather than implementation details.

The expected authoring graph is:

```
Start

↓

Consent Screen

↓

Mandatory Validation

↓

Enable Consent Action

↓

Create Child Journey

↓

Generate Consent URL

↓

Send SMS / Email

↓

Wait

↓

Consent Received?

├──────────────► Continue Journey

└──────────────► Retry

                    │

                    ▼

          Retry Threshold Reached?

               │

      No ◄─────┘

               │

              Yes

               ▼

         Journey Blocked
```

Every box above is an independent reusable Journey Builder node.

No business logic should be embedded directly inside another node.

Each node owns its own:

- configuration
- inspector
- validation
- runtime behaviour
- rule evaluation

---

# 8. Workflow Outcomes

## Success

Customer Consent Received

↓

Journey advances automatically to WF02.

---

## Retry

Customer has not yet consented.

↓

Retry logic executes.

↓

Notification may be resent.

---

## Failure

Consent cannot be obtained.

↓

Journey enters Blocked state.

↓

Further onboarding is prevented until manual intervention.

---

# 9. Node Inventory

WF01 introduces the following reusable nodes into the Journey Builder library.

| Node | Category | Purpose |
|-------|----------|---------|
| Start | Lifecycle | Entry point into workflow |
| Consent Screen | Screen | Display consent UI |
| Mandatory Validation | Validation | Verify required fields |
| Enable Consent Action | Action | Enable Send Consent CTA |
| Create Child Journey | API | Generate Child Journey |
| Generate Consent URL | Action | Produce customer link |
| Send Notification | Communication | Deliver SMS or Email |
| Wait | Flow | Pause execution |
| Consent Received? | Decision | Evaluate consent status |
| Retry Consent | Action | Increment retry |
| Retry Threshold | Decision | Maximum resend check |
| Journey Blocked | Terminal | End workflow |
| Continue Journey | Navigation | Move to WF02 |

The detailed contract for every node is defined in the following section.

# 10. Node Contracts

This section defines every reusable node introduced by WF01.

These node contracts become the source of truth for:

- Canvas rendering
- Inspector generation
- Configuration
- Runtime execution
- Validation
- Rule evaluation
- Publishing validation

---

# NC001 — Start

## Category

Lifecycle

## Purpose

Represents the entry point into a Journey.

Every workflow must contain exactly one Start node.

---

## Inputs

None

---

## Outputs

One

---

## Allowed Connections

May connect to:

- Screen
- API
- Decision
- Action

May NOT connect to:

- Terminal
- Another Start

---

## Configuration

None

---

## Inspector

Overview

Displays:

- Node Name
- Journey Name
- Workflow Version

No editable properties.

---

## Validation

Journey must contain exactly one Start node.

---

## Runtime Behaviour

Triggers execution of the workflow.

---

# NC002 — Consent Screen

## Category

Screen

## Purpose

Displays the Consent interface used by the Relationship Manager.

Allows the RM to verify customer information and initiate customer consent.

---

## Inputs

One

---

## Outputs

One

---

## Allowed Connections

Incoming

- Start
- Decision

Outgoing

- API
- Decision

---

## Variables Consumed

Application Number

Account Mode

Lead Creator

Lead Generator

Customer Name

Customer Mobile

Customer Email

---

## Variables Produced

Consent Requested

Consent Attempt Count

Consent Timestamp

---

## Configuration

### General

Screen Title

Screen Subtitle

Branding Theme

---

### Fields

Customer Name

Customer Mobile

Customer Email

Lead Creator

Lead Generator

Application Number

Account Mode

Editable

Read Only

Hidden

Mandatory

---

### Buttons

Send Consent

Continue

Cancel

Visibility

Enabled State

Loading State

---

### Behaviour

Auto Focus

Disable Continue

Disable Send Consent

Consent Expiry

Maximum Attempts

---

## Inspector

Overview

↓

Fields

↓

Buttons

↓

Validation

↓

Rules

↓

Branding

↓

Advanced

---

## Validation

Customer Mobile OR Email required

Mandatory fields complete

Maximum consent attempts not exceeded

---

## Business Rules

Continue disabled until consent received.

Send Consent disabled while request pending.

Maximum resend attempts configurable.

---

## Runtime Behaviour

Render screen.

Validate mandatory fields.

Enable Send Consent.

Wait for user action.

---

## Failure Behaviour

Display validation errors.

Prevent continuation.

---

# NC003 — Create Child Journey

## Category

API

## Purpose

Creates an IDfy Child Journey used to capture customer consent.

---

## Inputs

One

---

## Outputs

Success

Failure

---

## Allowed Connections

Incoming

Screen

Decision

Outgoing

Notification

Decision

---

## Variables Consumed

Application ID

Customer Mobile

Customer Email

Journey Metadata

---

## Variables Produced

Child Journey ID

Consent URL

Request Timestamp

---

## Configuration

API Endpoint

Authentication

Retry Count

Retry Delay

Timeout

Failure Strategy

---

## Inspector

Overview

↓

API Configuration

↓

Headers

↓

Payload Mapping

↓

Retry Policy

↓

Rules

↓ Advanced

---

## Validation

Endpoint configured

Authentication valid

Payload mapping complete

---

## Runtime Behaviour

Call Child Journey service.

Receive Journey ID.

Generate Consent URL.

Publish variables.

---

## Failure Behaviour

Retry.

Escalate.

Terminate.

---

# NC004 — Send Notification

## Category

Communication

## Purpose

Delivers the consent request to the customer.

---

## Inputs

One

---

## Outputs

Delivered

Failed

---

## Allowed Connections

Incoming

API

Outgoing

Wait

Decision

---

## Variables Consumed

Consent URL

Customer Mobile

Customer Email

---

## Variables Produced

Notification Status

Delivery Timestamp

---

## Configuration

Delivery Channel

SMS

Email

Both

Template

Retry

Fallback Channel

---

## Inspector

Overview

↓

Delivery

↓

Template

↓

Rules

↓ Advanced

---

## Validation

At least one delivery channel selected.

Template configured.

Recipient available.

---

## Runtime Behaviour

Send notification.

Publish delivery result.

---

# NC005 — Wait

## Category

Flow

## Purpose

Pauses workflow execution while waiting for customer interaction.

---

## Inputs

One

---

## Outputs

One

---

## Allowed Connections

Incoming

Notification

Outgoing

Decision

---

## Configuration

Timeout

Polling Interval

Maximum Wait

Continue Behaviour

---

## Inspector

Overview

↓

Timing

↓

Polling

↓

Rules

---

## Runtime Behaviour

Suspend execution.

Poll consent status.

Resume after event.

---

# NC006 — Consent Received?

## Category

Decision

## Purpose

Evaluates customer consent status.

---

## Inputs

One

---

## Outputs

Yes

No

---

## Allowed Connections

Incoming

Wait

Outgoing

Continue

Retry

Blocked

---

## Variables Consumed

Consent Status

Consent Timestamp

Retry Count

---

## Configuration

Decision Expression

Default Path

Evaluation Strategy

---

## Inspector

Overview

↓

Decision Logic

↓

Outputs

↓

Rules

↓ Advanced

---

## Validation

Expression required.

Every output connected.

---

## Runtime Behaviour

Evaluate consent state.

Route workflow.

---

# NC007 — Retry Consent

## Category

Action

## Purpose

Initiates another consent request.

---

## Configuration

Increment Retry

Delay

Maximum Attempts

---

## Outputs

Continue

Blocked

---

## Runtime Behaviour

Increase retry counter.

Return to Send Notification.

---

# NC008 — Journey Blocked

## Category

Terminal

## Purpose

Ends workflow because consent could not be obtained.

---

## Configuration

Reason Code

Display Message

Audit Code

---

## Runtime Behaviour

Terminate execution.

Record audit trail.

---

# NC009 — Continue Journey

## Category

Navigation

## Purpose

Transfers execution to WF02.

---

## Configuration

Target Workflow

Transition Mode

Context Transfer

---

## Runtime Behaviour

Pass workflow variables.

Launch WF02.

# 11. Variable Catalogue

Variables are the shared language of the workflow.

Nodes consume and produce variables.

Nodes should NEVER directly read another node's internal state.

Every dependency must occur through variables.

---

## Variable Categories

Variables belong to one of the following categories.

### Journey Variables

Persist for the lifetime of the journey.

Examples

- applicationId
- journeyId
- journeyStatus
- journeyVersion

---

### Customer Variables

Represent customer information.

Examples

- customerName
- customerMobile
- customerEmail
- accountMode

---

### Runtime Variables

Created during execution.

Examples

- childJourneyId
- consentUrl
- consentStatus
- consentAttempts
- consentRequestedAt

---

### System Variables

Produced by Journey Builder.

Examples

- currentScreen
- currentNode
- currentTimestamp
- retryCount

---

# WF01 Variable Catalogue

| Variable | Type | Produced By | Consumed By |
|------------|---------|----------------|----------------|
| applicationId | String | Journey | Child Journey API |
| accountMode | Enum | Journey | Consent Screen |
| customerName | String | Journey | Consent Screen |
| customerMobile | String | Consent Screen | Notification |
| customerEmail | String | Consent Screen | Notification |
| childJourneyId | UUID | Create Child Journey | Runtime |
| consentUrl | URL | Create Child Journey | Notification |
| consentStatus | Enum | Runtime | Decision |
| consentAttempts | Integer | Retry | Decision |
| consentRequestedAt | DateTime | Create Child Journey | Runtime |
| consentCompletedAt | DateTime | Runtime | Navigation |

---

# Variable Lifecycle

Variables follow one lifecycle.

Create

↓

Update

↓

Consume

↓

Archive

Variables should never be overwritten unexpectedly.

History should remain auditable.

---

# 12. Rule Definitions

Rules determine business behaviour.

Rules are evaluated independently of rendering.

A node may expose multiple rule categories.

---

## Validation Rules

Determine whether user input is valid.

Examples

Customer Mobile mandatory

Customer Email format

Maximum retry count

Application Number required

---

## Visibility Rules

Determine whether UI elements are visible.

Examples

Continue Button hidden

Customer Email hidden

Lead Generator hidden

---

## Enablement Rules

Determine whether controls are enabled.

Examples

Send Consent enabled

Continue enabled

Retry enabled

---

## Navigation Rules

Determine workflow routing.

Examples

Consent Received

↓

Continue

Consent Not Received

↓

Retry

Maximum Retries

↓

Blocked

---

## Business Rules

Represent banking requirements.

Examples

Consent mandatory.

Maximum three requests.

Continue prohibited before consent.

Child Journey required.

---

# Rule Evaluation Order

Rules should execute in a deterministic order.

Validation

↓

Visibility

↓

Enablement

↓

Business Rules

↓

Navigation

Later rule groups may depend on earlier results.

---

# Rule Failure Behaviour

Rule failures never crash execution.

Instead

Validation

↓

Display error

↓

Prevent action

↓

Await correction

---

# 13. Connection Model

Connections are business relationships.

Connections are not merely visual edges.

Every connection must satisfy authoring rules.

---

## Allowed Connections

Start

↓

Screen

Screen

↓

API

Screen

↓

Decision

API

↓

Communication

Communication

↓

Wait

Wait

↓

Decision

Decision

↓

Screen

Decision

↓

Terminal

Decision

↓

Navigation

Terminal

↓

None

---

## Invalid Connections

Start

→

Terminal

Screen

→

Start

Terminal

→

Any Node

Node

→

Self

Duplicate Parallel Edge

Disconnected Output

---

## Port Behaviour

Each node owns explicit ports.

Incoming

Outgoing

Ports define connection capability.

Ports never appear dynamically.

---

# Edge Metadata

Every edge contains metadata.

id

sourceNode

targetNode

sourcePort

targetPort

label

condition

status

createdAt

updatedAt

Future workflows may add

priority

executionMode

analytics

---

# 14. Runtime Behaviour

Journey execution begins at Start.

Execution proceeds through connected nodes.

Every node executes independently.

---

## Runtime Sequence

Start

↓

Consent Screen

↓

User Action

↓

Validation

↓

Child Journey API

↓

Notification

↓

Wait

↓

Consent Decision

↓

Continue

OR

Retry

OR

Blocked

---

## Retry Behaviour

Retry Count

↓

Increment

↓

Evaluate Threshold

↓

Threshold exceeded?

↓

Yes

Blocked

↓

No

Send Notification

---

## Failure Behaviour

Every node must define

Recoverable Failure

Non-Recoverable Failure

Timeout

Retry

Escalation

Audit Event

---

# 15. Validation Matrix

Publishing validation occurs before deployment.

---

## Workflow Validation

Exactly one Start.

At least one Terminal.

Every node connected.

No cycles.

No orphan nodes.

---

## Node Validation

Configuration complete.

Mandatory fields populated.

Inspector validation passes.

Required rules exist.

---

## Edge Validation

Valid connection.

Compatible ports.

No duplicates.

No invalid loops.

---

## Runtime Validation

Variables resolved.

API configuration complete.

Destination workflow exists.

Retry limits valid.

---

# Publishing Blockers

Publishing must fail when

Required configuration missing

Required rules missing

Disconnected graph

Missing terminal

Invalid decision

Unknown variables

Missing API configuration

---

# 16. Audit & Observability

Every execution produces audit events.

Minimum events

Journey Started

Consent Requested

Consent Delivered

Consent Failed

Consent Received

Retry Triggered

Journey Blocked

Journey Continued

Every audit event contains

Timestamp

Journey ID

Application ID

Node ID

Outcome

User

Correlation ID

---

# 17. Authoring Behaviour

This section defines Journey Builder behaviour.

Dragging

Creates node.

Selecting

Updates inspector.

Connecting

Creates edge.

Deleting

Removes node and edges.

Copy

Duplicates configuration.

Paste

Creates new node.

Undo

Restores previous state.

Redo

Reapplies state.

Validation

Runs continuously.

Publishing

Runs full workflow validation.

# 18. Inspector Definitions

The Properties Panel is the primary interaction surface for configuring workflow nodes.

The panel must be entirely schema-driven.

No node-specific logic should be hardcoded into the inspector.

Selecting a node loads the inspector definition associated with that node contract.

The inspector consists of reusable sections.

---

## Standard Inspector Layout

Every node inspector follows the same structure.

```
Overview

↓

Configuration

↓

Rules

↓

Variables

↓

Validation

↓

Advanced

↓

History
```

Sections are shown or hidden depending on node capabilities.

---

## Consent Screen Inspector

### Overview

Displays

- Node Name
- Screen Name
- Workflow
- Description

---

### Configuration

Editable Fields

- Screen Title
- Screen Subtitle
- Branding Theme
- Footer Text

Buttons

- Send Consent
- Continue
- Cancel

Behaviour

- Enable Continue
- Enable Send Consent
- Consent Expiry
- Maximum Attempts

---

### Rules

Display

Validation Rules

Visibility Rules

Enablement Rules

Navigation Rules

Business Rules

Each rule should be editable.

---

### Variables

Variables Consumed

Variables Produced

Variable Mapping

---

### Validation

Configuration Status

Publishing Status

Errors

Warnings

---

### Advanced

Analytics

Telemetry

Feature Flags

Future Extensions

---

## API Inspector

Overview

↓

Endpoint

↓

Authentication

↓

Headers

↓

Payload Mapping

↓

Retry

↓

Timeout

↓

Rules

↓ Variables

↓ History

---

## Decision Inspector

Overview

↓

Decision Expression

↓

Branches

↓

Default Route

↓

Variables

↓ Rules

↓ Advanced

---

## Wait Inspector

Overview

↓

Delay

↓ Polling

↓ Timeout

↓ Retry

↓ Variables

---

## Notification Inspector

Overview

↓ Channel

↓ Template

↓ Fallback

↓ Retry

↓ Variables

↓ History

---

## Terminal Inspector

Overview

↓ Outcome

↓ Audit Code

↓ Error Message

↓ Navigation

---

# 19. Canvas Behaviour

The canvas represents the workflow graph.

Authoring interactions must remain predictable and consistent.

---

## Node Creation

Nodes may be created by

- Drag from Node Library
- Double-click in Library
- Quick Add (future)

New nodes should

- Appear at drop position
- Become selected
- Open Properties Panel
- Receive default configuration

---

## Node Selection

Selecting a node

Highlights node

Highlights corresponding Screen Flow item

Loads inspector

Displays ports

---

## Multi Selection

Supported

Selection rectangle

Shift Click

Ctrl/Cmd Click

Future milestone.

---

## Connections

Dragging between compatible ports creates a connection.

During drag

Display preview edge.

Highlight compatible ports.

Reject invalid targets.

---

## Connection Validation

Prevent

- Self connection
- Duplicate edge
- Invalid node type
- Invalid port direction

Show inline validation.

---

## Deletion

Deleting a node

Removes associated edges.

Updates Screen Flow.

Updates validation.

Updates Properties Panel.

---

## Duplicate

Duplicated nodes receive

New ID

Default Position Offset

Copied Configuration

Rules

Variables

---

## Copy / Paste

Copy

Node configuration only.

Paste

Creates new node instance.

Future milestone.

---

# 20. UX States

Every node supports consistent UX states.

---

## Default

Standard appearance.

---

## Hover

Elevation increases.

Border darkens.

Ports become visible.

---

## Selected

Primary outline.

Inspector opens.

Screen Flow highlights.

---

## Focus

Keyboard focus ring.

Accessible.

---

## Disabled

Muted appearance.

Interactions blocked.

---

## Warning

Amber border.

Validation badge.

---

## Error

Red border.

Error icon.

Inspector displays issue.

---

## Loading

Spinner.

Busy indicator.

Execution disabled.

---

## Success

Green status indicator.

Runtime only.

---

# 21. Publishing Experience

Publishing performs complete workflow validation.

Validation should occur before deployment.

---

## Publishing Checklist

Journey contains Start.

Journey contains Terminal.

All nodes connected.

Required configuration complete.

Rules valid.

Variables resolved.

API configuration complete.

No orphan nodes.

No invalid edges.

No missing destinations.

---

## Validation Panel

Publishing failures appear as a checklist.

Example

❌ Consent Screen missing mandatory field

❌ API endpoint missing

❌ Wait node disconnected

Selecting an issue focuses the corresponding node.

---

# 22. Accessibility

Journey Builder must support keyboard-first authoring.

Requirements

Keyboard Navigation

Tab Order

Focus Indicators

Screen Reader Labels

Accessible Tooltips

ARIA Labels

High Contrast

Minimum Touch Targets

---

# 23. Accessibility

Journey Builder must support keyboard-first authoring.

Requirements

Keyboard Navigation

Tab Order

Focus Indicators

Screen Reader Labels

Accessible Tooltips

ARIA Labels

High Contrast

Minimum Touch Targets

---

# 24. Acceptance Criteria

WF01 is complete only when the following scenario succeeds without manual intervention.

---

## Authoring Scenario

Create Journey

↓

Add Start

↓

Add Consent Screen

↓

Configure Consent Screen

↓

Add Child Journey API

↓

Configure API

↓

Add Notification

↓

Configure SMS

↓

Add Wait

↓

Configure Polling

↓

Add Decision

↓

Configure Branches

↓

Connect all nodes

↓

Validation passes

↓

Save

↓

Reload

↓

Continue editing

Everything must remain intact.

---

## Runtime Scenario

Journey starts.

Consent Screen displayed.

Mandatory fields validated.

Child Journey created.

Consent URL generated.

Notification delivered.

Customer provides consent.

Workflow resumes.

Decision evaluates.

Journey proceeds to WF02.

---

## Failure Scenario

Consent not received.

Retry increments.

Threshold reached.

Journey blocked.

Audit event recorded.

---

## Definition of Done

WF01 is considered complete only if

`✔ Canvas matches workflow`

`✔ Screen Flow mirrors graph`

`✔ Every node has a dedicated inspector`

`✔ Configuration is schema-driven`

`✔ Rules are node-specific`

`✔ Variables flow correctly`

`✔ Runtime behaviour matches PRD`

`✔ Publishing validation succeeds`

`✔ No crashes`

`✔ No React warnings`

`✔ No console errors`

`✔ Build passes`

`✔ Lint passes`

`✔ Manual QA passes`

---

# 25. Future Extensibility

WF01 establishes the architectural pattern for all subsequent workflows.

Future workflows must reuse

- Node Contracts
- Inspector Framework
- Variable Engine
- Rule Engine
- Validation Engine
- Publishing Engine
- Runtime Engine

No future workflow should introduce bespoke implementations that bypass this contract.

Every new workflow should extend the platform through configuration and reusable node definitions rather than custom code.

---

# End of Workflow Contract

This document is the implementation source of truth for WF01.

The implementation must conform to this specification.

Any deviation from the workflow contract requires approval through the project's architectural decision process.
