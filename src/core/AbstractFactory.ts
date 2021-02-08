import { CanvasEngine } from '../CanvasEngine';
import { FactoryBank } from './FactoryBank';
import { EventEmitter } from '../events/EventEmitter';

/**
 * Base factory for all the different types of entities.
 * Gets registered with the engine, and is used to generate models
 */
export abstract class AbstractFactory<E extends CanvasEngine = CanvasEngine> {
  /**
   * Couples the factory with the models it generates
   */
  protected type: string;
  /**
   * The engine gets injected when the factory is registered
   */
  protected engine: E;
  protected bank: FactoryBank;

  protected eventEmitter: EventEmitter;

  constructor(type: string) {
    this.type = type;
  }

  setDiagramEngine(engine: E) {
    this.engine = engine;
    this.eventEmitter = engine.getEventEmitter();
  }

  setFactoryBank(bank: FactoryBank) {
    this.bank = bank;
  }

  getType(): string {
    return this.type;
  }
}
