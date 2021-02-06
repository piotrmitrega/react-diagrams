/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  DiagramEvent,
  PositionChangedEventHandler,
  SelectionChangedEventHandler,
  LinksUpdatedEventHandler,
  LockChangedEventHandler,
  NodesUpdatedEventHandler,
  PortChangedEventHandler,
  DraggedEventHandler,
  TextChangedEventHandler,
  TitleChangedEventHandler,
} from './Types';
import { DiagramEventType } from './DiagramEventType';
import { BaseEvent, BaseObserver } from '../core/BaseObserver';
type ListenerMap = {
  [DiagramEventType.DRAGGED]: DraggedEventHandler;
  [DiagramEventType.LINKS_UPDATED]: LinksUpdatedEventHandler;
  [DiagramEventType.LOCK_CHANGED]: LockChangedEventHandler;
  [DiagramEventType.NODES_UPDATED]: NodesUpdatedEventHandler;
  [DiagramEventType.POSITION_CHANGED]: PositionChangedEventHandler;
  [DiagramEventType.SELECTION_CHANGED]: SelectionChangedEventHandler;
  [DiagramEventType.SOURCE_PORT_CHANGED]: PortChangedEventHandler;
  [DiagramEventType.TARGET_PORT_CHANGED]: PortChangedEventHandler;
  [DiagramEventType.TEXT_CHANGED]: TextChangedEventHandler;
  [DiagramEventType.TITLE_CHANGED]: TitleChangedEventHandler;
};

export class EventEmitter {
  private handlers: { [K in keyof ListenerMap]: ListenerMap[K][] } = {
    [DiagramEventType.DRAGGED]: [],
    [DiagramEventType.LINKS_UPDATED]: [],
    [DiagramEventType.LOCK_CHANGED]: [],
    [DiagramEventType.NODES_UPDATED]: [],
    [DiagramEventType.POSITION_CHANGED]: [],
    [DiagramEventType.SELECTION_CHANGED]: [],
    [DiagramEventType.SOURCE_PORT_CHANGED]: [],
    [DiagramEventType.TARGET_PORT_CHANGED]: [],
    [DiagramEventType.TEXT_CHANGED]: [],
    [DiagramEventType.TITLE_CHANGED]: [],
  };

  addListener = <T extends keyof ListenerMap>(
    eventType: T,
    handler: ListenerMap[T],
  ) => {
    // @ts-ignore
    this.handlers[eventType].push(handler);
  };

  registerListeners = (observer: BaseObserver): void => {
    observer.registerListener({
      eventDidFire: (event: BaseEvent) => {
        this.onEvent(event as DiagramEvent);
      },
    });
  };

  getHandlersForType = <T extends keyof ListenerMap>(
    eventType: string,
  ): ListenerMap[T][] => {
    const key = eventType as T;
    // @ts-ignore
    return this.handlers[key];
  };

  private onEvent = (event: DiagramEvent): void => {
    const { function: eventFunction } = event;

    const handlers = this.getHandlersForType(eventFunction);

    if (!handlers || !handlers.length) {
      // eslint-disable-next-line no-console
      console.log('Unhandled event ', eventFunction);
      return;
    }

    // @ts-ignore
    handlers.forEach((handler) => handler(event));
  };
}
