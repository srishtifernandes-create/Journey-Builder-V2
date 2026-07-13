import { NodeRegistry } from './NodeRegistry'
import { RendererRegistry } from './RendererRegistry'
import { ScreenNodeRenderer } from '../renderers/ScreenNodeRenderer'
import { TerminalNodeRenderer } from '../renderers/TerminalNodeRenderer'

export function bootstrapNodeFoundation() {
  console.log('Bootstrapping Node Foundation...')

  // 1. Register Screen Node Metadata & Capabilities
  NodeRegistry.registerNode({
    type: 'screen',
    metadata: {
      type: 'screen',
      displayName: 'Screen',
      description: 'A single UI step visible to applicants.',
      category: 'flow',
      group: 'forms',
      icon: 'Monitor',
      keywords: ['form', 'screen', 'input', 'ui'],
      tags: ['core', 'ui'],
      schemaVersion: 1,
    },
    capabilities: {
      canHaveFields: true,
      canRoute: false,
      isIntegration: false,
      isTerminal: false,
    },
    defaultConfig: {
      title: 'Form Screen',
      mobileTitle: 'Form',
      pageId: 'form_screen',
      triggerVisibility: {
        assisted: true,
        cta_clicked: true,
        qr_scanned: true,
      },
      fields: [],
    },
    initialPorts: [
      { id: 'in', type: 'input' },
      { id: 'out', type: 'output' },
    ],
  })

  // 2. Register Terminal Node Metadata & Capabilities
  NodeRegistry.registerNode({
    type: 'terminal',
    metadata: {
      type: 'terminal',
      displayName: 'Terminal',
      description: 'End point of a journey.',
      category: 'flow',
      group: 'routing',
      icon: 'Flag',
      keywords: ['end', 'complete', 'terminal', 'exit'],
      tags: ['core', 'routing'],
      schemaVersion: 1,
    },
    capabilities: {
      canHaveFields: false,
      canRoute: false,
      isIntegration: false,
      isTerminal: true,
    },
    defaultConfig: {
      title: 'Journey Complete',
    },
    initialPorts: [
      { id: 'in', type: 'input' },
    ],
  })

  // 3. Register Screen Node Renderer
  RendererRegistry.registerRenderer({
    type: 'screen',
    component: ScreenNodeRenderer,
    defaultWidth: 180,
    defaultHeight: 72,
  })

  // 4. Register Terminal Node Renderer
  RendererRegistry.registerRenderer({
    type: 'terminal',
    component: TerminalNodeRenderer,
    defaultWidth: 120,
    defaultHeight: 48,
  })

  console.log('Node Foundation bootstrapped successfully.')
}
