import { useJourneyStore } from '../../../app/store/journeyStore'

export type EmptyStateStage = 'true-empty' | 'first-node-placed' | 'normal'

const COACH_MARK_DISMISSED_KEY = 'jb:ftue:emptyStateCoachMarkDismissed'

export function useEmptyStateStage(): EmptyStateStage {
  const nodeCount = useJourneyStore((s) => s.nodes.length)

  if (nodeCount === 0) return 'true-empty'
  if (nodeCount === 1) return 'first-node-placed'
  return 'normal'
}

export function isCoachMarkDismissed(): boolean {
  return sessionStorage.getItem(COACH_MARK_DISMISSED_KEY) === 'true'
}

export function dismissCoachMark(): void {
  sessionStorage.setItem(COACH_MARK_DISMISSED_KEY, 'true')
}
