// TODO: Add events for labels
// TODO: link events (color, width)
export enum DiagramEventType {
  DRAGGED = 'dragged',
  LINKS_UPDATED = 'linksUpdated',
  LOCK_CHANGED = 'lockChanged',
  NODES_UPDATED = 'nodesUpdated',
  POSITION_CHANGED = 'positionChanged',
  SELECTION_CHANGED = 'selectionChanged',
  SOURCE_PORT_CHANGED = 'sourcePortChanged',
  TARGET_PORT_CHANGED = 'targetPortChanged',
  TEXT_CHANGED = 'textChanged',
  TITLE_CHANGED = 'titleChanged',
}
