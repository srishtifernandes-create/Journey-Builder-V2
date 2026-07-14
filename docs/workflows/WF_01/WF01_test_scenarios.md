# WF01 — RM Assisted Consent Journey
## Test Scenarios

Version: 1.0

Purpose:
Validate that the authored workflow behaves exactly as described in the PRD and workflow contract.

---

# Positive Scenarios

---

## POS-001

Title

Customer successfully provides consent through SMS.

Preconditions

• Customer Mobile exists
• RM opens journey
• Consent not previously received

Steps

1. RM opens Consent Screen
2. Mobile number displayed
3. Click Send Consent
4. Child Journey created
5. SMS delivered
6. Customer opens consent link
7. Customer accepts
8. Runtime receives callback

Expected

✓ Consent Status = RECEIVED

✓ Continue enabled

✓ Workflow navigates to WF02

---

## POS-002

Title

Customer provides consent through Email.

Expected

Same behaviour as POS-001.

---

## POS-003

Title

Customer has both Mobile and Email.

Expected

Consent through either channel resumes workflow.

---

# Validation Scenarios

---

## VAL-001

Customer Mobile empty

Expected

Validation shown.

Send Consent disabled.

---

## VAL-002

Customer Email invalid

Expected

Email validation shown.

---

## VAL-003

Mandatory fields incomplete

Expected

Continue disabled.

---

# Notification Scenarios

---

## NOT-001

SMS delivery successful

Expected

Notification node succeeds.

---

## NOT-002

Email delivery successful

Expected

Notification node succeeds.

---

## NOT-003

SMS provider unavailable

Expected

Retry available.

Failure logged.

---

## NOT-004

Email provider unavailable

Expected

Retry available.

Failure logged.

---

# Retry Scenarios

---

## RET-001

Consent not received

Expected

Retry path followed.

---

## RET-002

Consent received after retry

Expected

Workflow resumes.

---

## RET-003

Maximum retries reached

Expected

Journey blocked.

---

# API Scenarios

---

## API-001

Create Child Journey succeeds

Expected

Child Journey ID stored.

Consent URL generated.

---

## API-002

Child Journey creation fails

Expected

Error displayed.

Journey paused.

---

# Decision Scenarios

---

## DEC-001

Consent Received

Expected

Navigate to WF02.

---

## DEC-002

Consent Pending

Expected

Retry.

---

## DEC-003

Retry Threshold Exceeded

Expected

Blocked.

---

# Persistence Scenarios

---

## PER-001

Refresh browser

Expected

Journey restored.

---

## PER-002

Inspector state restored

Expected

Selected node retained.

---

## Authoring Scenarios

---

## AUT-001

Author builds workflow from scratch.

Expected

No validation errors.

---

## AUT-002

Author deletes API node.

Expected

Publishing blocked.

---

## AUT-003

Author leaves Decision disconnected.

Expected

Publishing blocked.

---

## AUT-004

Author reconnects graph.

Expected

Validation clears.

---

# Edge Cases

---

EDGE-001

Customer opens expired link.

Expected

Expired message.

Retry available.

---

EDGE-002

Customer changes mobile number before resend.

Expected

New consent sent.

Old link invalidated.

---

EDGE-003

Customer submits after third retry.

Expected

Journey remains blocked.

---

EDGE-004

Network interruption while polling.

Expected

Automatic retry.

No duplicate events.

---

# Publishing Acceptance

Lock publishing if:

✓ Start missing

✓ Terminal missing

✓ Orphan nodes exist

✓ Disconnected graph

✓ Validation fails

✓ Build or lint fails
