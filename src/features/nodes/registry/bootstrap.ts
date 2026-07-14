import { NodeRegistry } from './NodeRegistry'
import { RendererRegistry } from './RendererRegistry'
import { ScreenNodeRenderer } from '../renderers/ScreenNodeRenderer'
import { TerminalNodeRenderer } from '../renderers/TerminalNodeRenderer'
import { FlowNodeRenderer } from '../renderers/FlowNodeRenderer'
import { BackendNodeRenderer } from '../renderers/BackendNodeRenderer'

export function bootstrapNodeFoundation() {
  console.log('Bootstrapping Node Foundation...')

  // SCREENS
  const screens = [
    { type: 'welcome', title: 'Welcome', desc: 'Greeting and initial instructions', icon: 'Smile' },
    { type: 'otp', title: 'OTP Verification', desc: 'One-time password input screen', icon: 'Key' },
    { type: 'pan', title: 'PAN Collection', desc: 'Collect and verify PAN details', icon: 'CreditCard' },
    { type: 'aadhaar', title: 'Aadhaar eKYC', desc: 'Aadhaar biometric or OTP verification', icon: 'Fingerprint' },
    { type: 'personal_details', title: 'Personal Details', desc: 'Collect personal information', icon: 'User' },
    { type: 'address', title: 'Address', desc: 'Collect residential address', icon: 'MapPin' },
    { type: 'document_upload', title: 'Document Upload', desc: 'Upload required documents', icon: 'Upload' },
    { type: 'selfie', title: 'Selfie', desc: 'Capture user selfie', icon: 'Camera' },
    { type: 'face_capture', title: 'Face Capture', desc: 'Advanced face capture with liveness', icon: 'UserFocus' },
    { type: 'video_kyc', title: 'Video KYC', desc: 'Live agent video verification', icon: 'Video' },
    { type: 'review', title: 'Review', desc: 'Review submitted information', icon: 'ClipboardCheck' },
    { type: 'success', title: 'Success', desc: 'Application approved confirmation', icon: 'CheckCircle' },
  ]

  screens.forEach(s => {
    NodeRegistry.registerNode({
      type: s.type,
      metadata: {
        type: s.type,
        displayName: s.title,
        description: s.desc,
        category: 'Screens',
        group: 'forms',
        icon: s.icon,
        keywords: [s.type, 'screen'],
        tags: ['core', 'ui'],
        schemaVersion: 1,
      },
      capabilities: { canHaveFields: true, canRoute: false, isIntegration: false, isTerminal: false },
      defaultConfig: { title: s.title },
      initialPorts: [{ id: 'in', type: 'input' }, { id: 'out', type: 'output' }],
    })
    RendererRegistry.registerRenderer({
      type: s.type,
      component: ScreenNodeRenderer,
      defaultWidth: 180,
      defaultHeight: 72,
      minWidth: 140,
      minHeight: 64,
      supportsPorts: ['top', 'bottom'],
      resizePolicy: 'fixed',
    })
  })

  // BACKEND
  const backendNodes = [
    { type: 'ocr', title: 'OCR Extraction', desc: 'Extract data from document images', icon: 'ScanText' },
    { type: 'pan_verification', title: 'PAN Verification', desc: 'Verify PAN with NSDL', icon: 'ShieldCheck' },
    { type: 'aadhaar_verification', title: 'Aadhaar Verification', desc: 'Verify Aadhaar with UIDAI', icon: 'ShieldCheck' },
    { type: 'ckyc', title: 'CKYC Fetch', desc: 'Fetch Central KYC records', icon: 'Database' },
    { type: 'aml', title: 'AML Check', desc: 'Anti-Money Laundering screening', icon: 'Search' },
    { type: 'face_match', title: 'Face Match', desc: 'Compare selfie with document photo', icon: 'ScanFace' },
    { type: 'fraud_check', title: 'Fraud Check', desc: 'Evaluate application for fraud signals', icon: 'AlertTriangle' },
    { type: 'risk_engine', title: 'Risk Engine', desc: 'Calculate credit and approval risk', icon: 'Gauge' },
    { type: 'api_call', title: 'API Call', desc: 'Make a generic HTTP request', icon: 'Webhook' },
    { type: 'webhook', title: 'Webhook', desc: 'Trigger an external webhook', icon: 'Link2' },
  ]

  backendNodes.forEach(b => {
    NodeRegistry.registerNode({
      type: b.type,
      metadata: {
        type: b.type,
        displayName: b.title,
        description: b.desc,
        category: 'Backend',
        group: 'integration',
        icon: b.icon,
        keywords: [b.type, 'integration', 'backend'],
        tags: ['integration'],
        schemaVersion: 1,
      },
      capabilities: { canHaveFields: false, canRoute: false, isIntegration: true, isTerminal: false },
      defaultConfig: { title: b.title },
      initialPorts: [{ id: 'in', type: 'input' }, { id: 'out', type: 'output' }],
    })
    RendererRegistry.registerRenderer({
      type: b.type,
      component: BackendNodeRenderer,
      defaultWidth: 180,
      defaultHeight: 72,
      minWidth: 140,
      minHeight: 64,
      supportsPorts: ['top', 'bottom'],
      resizePolicy: 'fixed',
    })
  })

  // FLOW
  const flows = [
    { type: 'decision', title: 'Decision', desc: 'Branch based on rules', icon: 'GitBranch' },
    { type: 'branch', title: 'Branch', desc: 'Multi-path routing', icon: 'Waypoints' },
    { type: 'parallel', title: 'Parallel', desc: 'Execute multiple paths simultaneously', icon: 'Split' },
    { type: 'retry', title: 'Retry', desc: 'Retry a failed block', icon: 'RotateCcw' },
    { type: 'wait', title: 'Wait', desc: 'Pause execution for a duration', icon: 'Clock' },
    { type: 'loop', title: 'Loop', desc: 'Iterate over a collection', icon: 'Repeat' },
    { type: 'child_journey', title: 'Child Journey', desc: 'Invoke another journey as a sub-process', icon: 'Network' },
    { type: 'redirect', title: 'Redirect', desc: 'Redirect user to an external URL', icon: 'ExternalLink' },
  ]

  flows.forEach(f => {
    NodeRegistry.registerNode({
      type: f.type,
      metadata: {
        type: f.type,
        displayName: f.title,
        description: f.desc,
        category: 'Flow',
        group: 'routing',
        icon: f.icon,
        keywords: [f.type, 'route'],
        tags: ['routing'],
        schemaVersion: 1,
      },
      capabilities: { canHaveFields: false, canRoute: true, isIntegration: false, isTerminal: false },
      defaultConfig: { title: f.title },
      initialPorts: [{ id: 'in', type: 'input' }, { id: 'out1', type: 'output' }, { id: 'out2', type: 'output' }],
    })
    RendererRegistry.registerRenderer({
      type: f.type,
      component: FlowNodeRenderer,
      defaultWidth: 180,
      defaultHeight: 72,
      minWidth: 140,
      minHeight: 64,
      supportsPorts: ['top', 'bottom'],
      resizePolicy: 'fixed',
    })
  })

  // ENDING
  const endings = [
    { type: 'approved', title: 'Approved', desc: 'Journey ends with approval', icon: 'CheckCircle2' },
    { type: 'rejected', title: 'Rejected', desc: 'Journey ends with rejection', icon: 'XCircle' },
    { type: 'manual_review', title: 'Manual Review', desc: 'Send application for manual review', icon: 'Flag' },
    { type: 'expired', title: 'Expired', desc: 'Journey timed out or expired', icon: 'Hourglass' },
  ]

  endings.forEach(e => {
    NodeRegistry.registerNode({
      type: e.type,
      metadata: {
        type: e.type,
        displayName: e.title,
        description: e.desc,
        category: 'Ending',
        group: 'terminal',
        icon: e.icon,
        keywords: [e.type, 'end', 'terminal'],
        tags: ['terminal'],
        schemaVersion: 1,
      },
      capabilities: { canHaveFields: false, canRoute: false, isIntegration: false, isTerminal: true },
      defaultConfig: { title: e.title },
      initialPorts: [{ id: 'in', type: 'input' }],
    })
    RendererRegistry.registerRenderer({
      type: e.type,
      component: TerminalNodeRenderer,
      defaultWidth: 180,
      defaultHeight: 72,
      minWidth: 140,
      minHeight: 64,
      supportsPorts: ['top'],
      resizePolicy: 'fixed',
    })
  })

  console.log('Node Foundation bootstrapped successfully.')
}
