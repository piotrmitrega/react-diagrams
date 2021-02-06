// import { BaseEntity, BaseEvent } from '@piotrmitrega/react-canvas-core';
// import {
//   LinkModel,
//   NodeModel,
//   PortModel,
// } from '@piotrmitrega/react-diagrams-core';

import { BaseEvent, BaseEntity } from '..';
import { Point } from '@piotrmitrega/geometry';

// TODO: Fix
type LinkModel = any;
type NodeModel = any;
type PortModel = any;

export type DiagramEvent = BaseEvent & {
  function: string;
};

export type EntityEvent<T extends BaseEntity = BaseEntity> = DiagramEvent & {
  entity: T;
};

export type LinksUpdatedEvent = EntityEvent & {
  link: LinkModel;
  isCreated: boolean;
};

export type LockChangedEvent = EntityEvent & {
  locked: boolean;
};

export type NodesUpdatedEvent = EntityEvent & {
  node: NodeModel;
  isCreated: boolean;
};

export type PositionChangedEvent = EntityEvent & {
  position: Point;
};

export type PortChangedEvent = EntityEvent<LinkModel> & {
  port: null | PortModel;
};

export type SelectionChangedEvent = EntityEvent & {
  isSelected: boolean;
};

export type DiagramEventHandler<Event extends DiagramEvent = DiagramEvent> = (
  event: Event,
) => void;

export type LinksUpdatedEventHandler = DiagramEventHandler<LinksUpdatedEvent>;

export type LockChangedEventHandler = DiagramEventHandler<LockChangedEvent>;

export type NodesUpdatedEventHandler = DiagramEventHandler<NodesUpdatedEvent>;

export type PositionChangedEventHandler = DiagramEventHandler<
  PositionChangedEvent
>;

export type SelectionChangedEventHandler = DiagramEventHandler<
  SelectionChangedEvent
>;

export type PortChangedEventHandler = DiagramEventHandler<PortChangedEvent>;

export type TextChangedEventHandler = DiagramEventHandler<EntityEvent>;

export type TitleChangedEventHandler = DiagramEventHandler<EntityEvent>;

export type DraggedEventHandler = DiagramEventHandler<EntityEvent>;
