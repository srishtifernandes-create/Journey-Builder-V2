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
    { type: 'otp', title: 'OTP Verification', desc: 'One-time password input screen', icon: 'Key' },
    { type: 'pan', title: 'PAN Collection', desc: 'Collect and verify PAN details', icon: 'CreditCard' },
    { type: 'aadhaar', title: 'Aadhaar eKYC', desc: 'Aadhaar biometric or OTP verification', icon: 'Fingerprint' },
    { type: 'ocr', title: 'Document OCR', desc: 'Scan and extract data from documents', icon: 'Scan' },
    { type: 'facematch', title: 'Face Match', desc: 'Liveness check and face matching', icon: 'UserCircle' },
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
  NodeRegistry.registerNode({
    type: 'ckyc',
    metadata: {
      type: 'ckyc',
      displayName: 'CKYC Fetch',
      description: 'Fetch Central KYC records',
      category: 'Backend',
      group: 'integration',
      icon: 'Database',
      keywords: ['ckyc', 'fetch', 'kyc'],
      tags: ['integration'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: false, isIntegration: true, isTerminal: false },
    defaultConfig: { title: 'CKYC Fetch' },
    initialPorts: [{ id: 'in', type: 'input' }, { id: 'out', type: 'output' }],
  })
  RendererRegistry.registerRenderer({
    type: 'ckyc',
    component: BackendNodeRenderer,
    defaultWidth: 180,
    defaultHeight: 72,
    minWidth: 140,
    minHeight: 64,
    supportsPorts: ['top', 'bottom'],
    resizePolicy: 'fixed',
  })

  // FLOW
  const flows = [
    { type: 'decision', title: 'Decision', desc: 'Branch based on rules', icon: 'GitBranch' },
    { type: 'switch', title: 'Switch', desc: 'Multi-path routing', icon: 'Waypoints' },
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
  NodeRegistry.registerNode({
    type: 'manual_review',
    metadata: {
      type: 'manual_review',
      displayName: 'Manual Review',
      description: 'Send application for manual review',
      category: 'Ending',
      group: 'terminal',
      icon: 'Flag',
      keywords: ['review', 'end'],
      tags: ['terminal'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: false, isIntegration: false, isTerminal: true },
    defaultConfig: { title: 'Manual Review' },
    initialPorts: [{ id: 'in', type: 'input' }],
  })
  RendererRegistry.registerRenderer({
    type: 'manual_review',
    component: TerminalNodeRenderer,
    defaultWidth: 180,
    defaultHeight: 72,
    minWidth: 140,
    minHeight: 64,
    supportsPorts: ['top'],
    resizePolicy: 'fixed',
  })

  console.log('Node Foundation bootstrapped successfully.')
}
