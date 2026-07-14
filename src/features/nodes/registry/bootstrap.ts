import { NodeRegistry } from './NodeRegistry'
import { RendererRegistry } from './RendererRegistry'
import { ScreenNodeRenderer } from '../renderers/ScreenNodeRenderer'
import { TerminalNodeRenderer } from '../renderers/TerminalNodeRenderer'
import { FlowNodeRenderer } from '../renderers/FlowNodeRenderer'
import { ApiNodeRenderer } from '../renderers/ApiNodeRenderer'
import { ActionNodeRenderer } from '../renderers/ActionNodeRenderer'
import { DecisionNodeRenderer } from '../renderers/DecisionNodeRenderer'

export function bootstrapNodeFoundation() {
  console.log('Bootstrapping Node Foundation for WF01...')

  // 1. Start (Lifecycle)
  NodeRegistry.registerNode({
    type: 'start',
    metadata: {
      type: 'start',
      displayName: 'Start',
      description: 'Entry point into workflow',
      category: 'Lifecycle',
      group: 'lifecycle',
      icon: 'Play',
      keywords: ['start', 'lifecycle'],
      tags: ['start'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: true, isIntegration: false, isTerminal: false },
    defaultConfig: { title: 'Start' },
    initialPorts: [{ id: 'out', type: 'output' }],
  })
  RendererRegistry.registerRenderer({
    type: 'start',
    component: ActionNodeRenderer,
    defaultWidth: 148,
    defaultHeight: 46,
    minWidth: 140,
    minHeight: 40,
    supportsPorts: ['bottom'],
    resizePolicy: 'fixed',
  })

  // 2. Consent Screen (Screen)
  NodeRegistry.registerNode({
    type: 'consent_screen',
    metadata: {
      type: 'consent_screen',
      displayName: 'Consent Screen',
      description: 'Display consent UI',
      category: 'Screen',
      group: 'screens',
      icon: 'Monitor',
      keywords: ['consent', 'screen', 'ui'],
      tags: ['screen'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: true, isIntegration: false, isTerminal: false },
    defaultConfig: { title: 'Consent Screen' },
    initialPorts: [{ id: 'in', type: 'input' }, { id: 'out', type: 'output' }],
  })
  RendererRegistry.registerRenderer({
    type: 'consent_screen',
    component: ScreenNodeRenderer,
    defaultWidth: 184,
    defaultHeight: 92,
    minWidth: 140,
    minHeight: 80,
    supportsPorts: ['top', 'bottom'],
    resizePolicy: 'fixed',
  })

  // 3. Mandatory Validation (Validation)
  NodeRegistry.registerNode({
    type: 'mandatory_validation',
    metadata: {
      type: 'mandatory_validation',
      displayName: 'Mandatory Validation',
      description: 'Verify required fields',
      category: 'Validation',
      group: 'validation',
      icon: 'CheckSquare',
      keywords: ['validation', 'mandatory'],
      tags: ['validation'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: false, isIntegration: false, isTerminal: false },
    defaultConfig: { title: 'Mandatory Validation' },
    initialPorts: [{ id: 'in', type: 'input' }, { id: 'out', type: 'output' }],
  })
  RendererRegistry.registerRenderer({
    type: 'mandatory_validation',
    component: ActionNodeRenderer,
    defaultWidth: 148,
    defaultHeight: 46,
    minWidth: 140,
    minHeight: 40,
    supportsPorts: ['top', 'bottom'],
    resizePolicy: 'fixed',
  })

  // 4. Enable Consent Action (Action)
  NodeRegistry.registerNode({
    type: 'enable_consent_action',
    metadata: {
      type: 'enable_consent_action',
      displayName: 'Enable Consent Action',
      description: 'Enable Send Consent CTA',
      category: 'Action',
      group: 'actions',
      icon: 'Unlock',
      keywords: ['enable', 'consent', 'action'],
      tags: ['action'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: false, isIntegration: false, isTerminal: false },
    defaultConfig: { title: 'Enable Consent Action' },
    initialPorts: [{ id: 'in', type: 'input' }, { id: 'out', type: 'output' }],
  })
  RendererRegistry.registerRenderer({
    type: 'enable_consent_action',
    component: ActionNodeRenderer,
    defaultWidth: 148,
    defaultHeight: 46,
    minWidth: 140,
    minHeight: 40,
    supportsPorts: ['top', 'bottom'],
    resizePolicy: 'fixed',
  })

  // 5. Create Child Journey (API)
  NodeRegistry.registerNode({
    type: 'create_child_journey',
    metadata: {
      type: 'create_child_journey',
      displayName: 'Create Child Journey',
      description: 'Generate Child Journey',
      category: 'API',
      group: 'api',
      icon: 'Webhook',
      keywords: ['create', 'child', 'journey', 'api'],
      tags: ['api'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: true, isIntegration: true, isTerminal: false },
    defaultConfig: { title: 'Create Child Journey', endpoint: 'POST /v1/journey/child' },
    initialPorts: [
      { id: 'in', type: 'input' },
      { id: 'success', type: 'output', label: 'Success' },
      { id: 'failure', type: 'output', label: 'Failure' },
    ],
  })
  RendererRegistry.registerRenderer({
    type: 'create_child_journey',
    component: ApiNodeRenderer,
    defaultWidth: 168,
    defaultHeight: 110,
    minWidth: 140,
    minHeight: 90,
    supportsPorts: ['top', 'bottom'],
    resizePolicy: 'fixed',
  })

  // 6. Generate Consent URL (Action)
  NodeRegistry.registerNode({
    type: 'generate_consent_url',
    metadata: {
      type: 'generate_consent_url',
      displayName: 'Generate Consent URL',
      description: 'Produce customer link',
      category: 'Action',
      group: 'actions',
      icon: 'Link',
      keywords: ['generate', 'consent', 'url'],
      tags: ['action'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: false, isIntegration: false, isTerminal: false },
    defaultConfig: { title: 'Generate Consent URL' },
    initialPorts: [{ id: 'in', type: 'input' }, { id: 'out', type: 'output' }],
  })
  RendererRegistry.registerRenderer({
    type: 'generate_consent_url',
    component: ActionNodeRenderer,
    defaultWidth: 148,
    defaultHeight: 46,
    minWidth: 140,
    minHeight: 40,
    supportsPorts: ['top', 'bottom'],
    resizePolicy: 'fixed',
  })

  // 7. Send Notification (Communication)
  NodeRegistry.registerNode({
    type: 'send_notification',
    metadata: {
      type: 'send_notification',
      displayName: 'Send Notification',
      description: 'Deliver SMS or Email',
      category: 'Communication',
      group: 'communication',
      icon: 'MessageSquare',
      keywords: ['send', 'notification', 'sms', 'email'],
      tags: ['communication'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: true, isIntegration: false, isTerminal: false },
    defaultConfig: { title: 'Send Notification' },
    initialPorts: [
      { id: 'in', type: 'input' },
      { id: 'delivered', type: 'output', label: 'Delivered' },
      { id: 'failed', type: 'output', label: 'Failed' },
    ],
  })
  RendererRegistry.registerRenderer({
    type: 'send_notification',
    component: ScreenNodeRenderer,
    defaultWidth: 184,
    defaultHeight: 92,
    minWidth: 140,
    minHeight: 80,
    supportsPorts: ['top', 'bottom'],
    resizePolicy: 'fixed',
  })

  // 8. Wait (Flow)
  NodeRegistry.registerNode({
    type: 'wait',
    metadata: {
      type: 'wait',
      displayName: 'Wait',
      description: 'Pause execution',
      category: 'Flow',
      group: 'flow',
      icon: 'Clock',
      keywords: ['wait', 'flow', 'delay'],
      tags: ['flow'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: false, isIntegration: false, isTerminal: false },
    defaultConfig: { title: 'Wait' },
    initialPorts: [{ id: 'in', type: 'input' }, { id: 'out', type: 'output' }],
  })
  RendererRegistry.registerRenderer({
    type: 'wait',
    component: FlowNodeRenderer,
    defaultWidth: 184,
    defaultHeight: 92,
    minWidth: 140,
    minHeight: 80,
    supportsPorts: ['top', 'bottom'],
    resizePolicy: 'fixed',
  })

  // 9. Consent Received? (Decision)
  NodeRegistry.registerNode({
    type: 'consent_received',
    metadata: {
      type: 'consent_received',
      displayName: 'Consent Received?',
      description: 'Evaluate consent status',
      category: 'Decision',
      group: 'decision',
      icon: 'GitBranch',
      keywords: ['consent', 'received', 'decision'],
      tags: ['decision'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: true, isIntegration: false, isTerminal: false },
    defaultConfig: { title: 'Consent Received?' },
    initialPorts: [
      { id: 'in', type: 'input' },
      { id: 'yes', type: 'output', label: 'Yes' },
      { id: 'no', type: 'output', label: 'No' },
    ],
  })
  RendererRegistry.registerRenderer({
    type: 'consent_received',
    component: DecisionNodeRenderer,
    defaultWidth: 138,
    defaultHeight: 60,
    minWidth: 120,
    minHeight: 50,
    supportsPorts: ['top', 'bottom'],
    resizePolicy: 'fixed',
  })

  // 10. Retry Consent (Action)
  NodeRegistry.registerNode({
    type: 'retry_consent',
    metadata: {
      type: 'retry_consent',
      displayName: 'Retry Consent',
      description: 'Increment retry',
      category: 'Action',
      group: 'actions',
      icon: 'RotateCcw',
      keywords: ['retry', 'consent', 'action'],
      tags: ['action'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: true, isIntegration: false, isTerminal: false },
    defaultConfig: { title: 'Retry Consent' },
    initialPorts: [
      { id: 'in', type: 'input' },
      { id: 'continue', type: 'output', label: 'Continue' },
      { id: 'blocked', type: 'output', label: 'Blocked' },
    ],
  })
  RendererRegistry.registerRenderer({
    type: 'retry_consent',
    component: ActionNodeRenderer,
    defaultWidth: 148,
    defaultHeight: 46,
    minWidth: 140,
    minHeight: 40,
    supportsPorts: ['top', 'bottom'],
    resizePolicy: 'fixed',
  })

  // 11. Retry Threshold (Decision)
  NodeRegistry.registerNode({
    type: 'retry_threshold',
    metadata: {
      type: 'retry_threshold',
      displayName: 'Retry Threshold',
      description: 'Maximum resend check',
      category: 'Decision',
      group: 'decision',
      icon: 'GitBranch',
      keywords: ['retry', 'threshold', 'decision'],
      tags: ['decision'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: true, isIntegration: false, isTerminal: false },
    defaultConfig: { title: 'Retry Threshold' },
    initialPorts: [
      { id: 'in', type: 'input' },
      { id: 'yes', type: 'output', label: 'Yes' },
      { id: 'no', type: 'output', label: 'No' },
    ],
  })
  RendererRegistry.registerRenderer({
    type: 'retry_threshold',
    component: DecisionNodeRenderer,
    defaultWidth: 138,
    defaultHeight: 60,
    minWidth: 120,
    minHeight: 50,
    supportsPorts: ['top', 'bottom'],
    resizePolicy: 'fixed',
  })

  // 12. Journey Blocked (Terminal)
  NodeRegistry.registerNode({
    type: 'journey_blocked',
    metadata: {
      type: 'journey_blocked',
      displayName: 'Journey Blocked',
      description: 'End workflow',
      category: 'Terminal',
      group: 'terminal',
      icon: 'XCircle',
      keywords: ['journey', 'blocked', 'terminal'],
      tags: ['terminal'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: false, isIntegration: false, isTerminal: true },
    defaultConfig: { title: 'Journey Blocked' },
    initialPorts: [{ id: 'in', type: 'input' }],
  })
  RendererRegistry.registerRenderer({
    type: 'journey_blocked',
    component: TerminalNodeRenderer,
    defaultWidth: 184,
    defaultHeight: 92,
    minWidth: 140,
    minHeight: 80,
    supportsPorts: ['top'],
    resizePolicy: 'fixed',
  })

  // 13. Continue Journey (Navigation)
  NodeRegistry.registerNode({
    type: 'continue_journey',
    metadata: {
      type: 'continue_journey',
      displayName: 'Continue Journey',
      description: 'Move to WF02',
      category: 'Navigation',
      group: 'navigation',
      icon: 'CheckCircle2',
      keywords: ['continue', 'journey', 'navigation'],
      tags: ['navigation'],
      schemaVersion: 1,
    },
    capabilities: { canHaveFields: false, canRoute: false, isIntegration: false, isTerminal: true },
    defaultConfig: { title: 'Continue Journey' },
    initialPorts: [{ id: 'in', type: 'input' }],
  })
  RendererRegistry.registerRenderer({
    type: 'continue_journey',
    component: TerminalNodeRenderer,
    defaultWidth: 184,
    defaultHeight: 92,
    minWidth: 140,
    minHeight: 80,
    supportsPorts: ['top'],
    resizePolicy: 'fixed',
  })

  console.log('Node Foundation bootstrapped successfully for WF01.')
}
