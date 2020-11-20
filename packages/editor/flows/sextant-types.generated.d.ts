



export type Props__ADD_PROP = {};

export type Props__PROP_ADDED = {};

export type Props__UPDATE_PROP = {};

export type Props__PROP_UPDATED = {};

export type Props__REMOVE_PROP = {};

export type Props__PROP_REMOVED = {};

export interface SextantFeatures {
  'props': {
    scenarios:
      | "add"
      | "update"
      | "remove"
    events: {
      'ADD_PROP': Props__ADD_PROP & { type: "ADD_PROP" }
      'PROP_ADDED': Props__PROP_ADDED & { type: "PROP_ADDED" }
      'UPDATE_PROP': Props__UPDATE_PROP & { type: "UPDATE_PROP" }
      'PROP_UPDATED': Props__PROP_UPDATED & { type: "PROP_UPDATED" }
      'REMOVE_PROP': Props__REMOVE_PROP & { type: "REMOVE_PROP" }
      'PROP_REMOVED': Props__PROP_REMOVED & { type: "PROP_REMOVED" }
    }
    actors: {
      'frontend': {
        from: {
          'server': {
            in:
              | Props__PROP_ADDED & { type: "PROP_ADDED" }
              | Props__PROP_UPDATED & { type: "PROP_UPDATED" }
              | Props__PROP_REMOVED & { type: "PROP_REMOVED" }
            
            out:
              | Props__ADD_PROP & { type: "ADD_PROP" }
              | Props__UPDATE_PROP & { type: "UPDATE_PROP" }
              | Props__REMOVE_PROP & { type: "REMOVE_PROP" }
            
          }
        }
        to: {
          'server': {
            in:
              | Props__ADD_PROP & { type: "ADD_PROP" }
              | Props__UPDATE_PROP & { type: "UPDATE_PROP" }
              | Props__REMOVE_PROP & { type: "REMOVE_PROP" }
            
            out:
              | Props__PROP_ADDED & { type: "PROP_ADDED" }
              | Props__PROP_UPDATED & { type: "PROP_UPDATED" }
              | Props__PROP_REMOVED & { type: "PROP_REMOVED" }
            
          }
        }
      }
      'server': {
        from: {
          'frontend': {
            in:
              | Props__ADD_PROP & { type: "ADD_PROP" }
              | Props__UPDATE_PROP & { type: "UPDATE_PROP" }
              | Props__REMOVE_PROP & { type: "REMOVE_PROP" }
            
            out:
              | Props__PROP_ADDED & { type: "PROP_ADDED" }
              | Props__PROP_UPDATED & { type: "PROP_UPDATED" }
              | Props__PROP_REMOVED & { type: "PROP_REMOVED" }
            
          }
        }
        to: {
          'frontend': {
            in:
              | Props__PROP_ADDED & { type: "PROP_ADDED" }
              | Props__PROP_UPDATED & { type: "PROP_UPDATED" }
              | Props__PROP_REMOVED & { type: "PROP_REMOVED" }
            
            out:
              | Props__ADD_PROP & { type: "ADD_PROP" }
              | Props__UPDATE_PROP & { type: "UPDATE_PROP" }
              | Props__REMOVE_PROP & { type: "REMOVE_PROP" }
            
          }
        }
      }
    }
  }
}

export interface SextantActors {
  'frontend': {
    from: {
      'server': {
        in:
          | Props__PROP_ADDED & { type: "props.PROP_ADDED" }
          | Props__PROP_UPDATED & { type: "props.PROP_UPDATED" }
          | Props__PROP_REMOVED & { type: "props.PROP_REMOVED" }
        
        out:
          | Props__ADD_PROP & { type: "props.ADD_PROP" }
          | Props__UPDATE_PROP & { type: "props.UPDATE_PROP" }
          | Props__REMOVE_PROP & { type: "props.REMOVE_PROP" }
        
      }
    }
    to: {
      'server': {
        in:
          | Props__ADD_PROP & { type: "props.ADD_PROP" }
          | Props__UPDATE_PROP & { type: "props.UPDATE_PROP" }
          | Props__REMOVE_PROP & { type: "props.REMOVE_PROP" }
        
        out:
          | Props__PROP_ADDED & { type: "props.PROP_ADDED" }
          | Props__PROP_UPDATED & { type: "props.PROP_UPDATED" }
          | Props__PROP_REMOVED & { type: "props.PROP_REMOVED" }
        
      }
    }
  };
  'server': {
    from: {
      'frontend': {
        in:
          | Props__ADD_PROP & { type: "props.ADD_PROP" }
          | Props__UPDATE_PROP & { type: "props.UPDATE_PROP" }
          | Props__REMOVE_PROP & { type: "props.REMOVE_PROP" }
        
        out:
          | Props__PROP_ADDED & { type: "props.PROP_ADDED" }
          | Props__PROP_UPDATED & { type: "props.PROP_UPDATED" }
          | Props__PROP_REMOVED & { type: "props.PROP_REMOVED" }
        
      }
    }
    to: {
      'frontend': {
        in:
          | Props__PROP_ADDED & { type: "props.PROP_ADDED" }
          | Props__PROP_UPDATED & { type: "props.PROP_UPDATED" }
          | Props__PROP_REMOVED & { type: "props.PROP_REMOVED" }
        
        out:
          | Props__ADD_PROP & { type: "props.ADD_PROP" }
          | Props__UPDATE_PROP & { type: "props.UPDATE_PROP" }
          | Props__REMOVE_PROP & { type: "props.REMOVE_PROP" }
        
      }
    }
  };
}

export interface EventConfig {
  in: { type: string };
  out: { type: string };
}

type MaybePromise<T> = Promise<T> | T;

type SextantPromise<TEventConfig extends EventConfig> = (
  event: TEventConfig['in'],
) => MaybePromise<
  TEventConfig['out'] extends never ? void : TEventConfig['out']
>;

/**
 * A handler type built by Sextant.
 *
 * Usage:
 *
 * ```ts
 * const handler: SextantHandler<
 *   'featureName',
 *   'fromThisActor',
 *   'toThisActor',
 * > = () => {};
 * ```
 */
export type SextantHandler<
  IFeature extends keyof SextantFeatures,
  IFrom extends keyof SextantFeatures[IFeature]["actors"] = any,
  // @ts-ignore
  ITarget extends keyof SextantFeatures[IFeature]["actors"][IFrom]["from"] = any
> = SextantPromise<
  // @ts-ignore
  SextantFeatures[IFeature]["actors"][IFrom]["to"][ITarget]
>;

/**
 * An event type built by Sextant.
 *
 * Usage:
 *
 * ```ts
 * const event: SextantEvent<'featureName', 'fromThisActor', 'toThisActor'>;
 * const specificEvent: SextantEvent<
 *   'featureName',
 *   'fromThisActor',
 *   'toThisActor',
 *   'SPECIFIC_EVENT_TYPE'
 * >;
 * ```
 */
export type SextantEvent<
  IFeature extends keyof SextantFeatures,
  IFrom extends keyof SextantFeatures[IFeature]["actors"] = any,
  // @ts-ignore
  ITarget extends keyof SextantFeatures[IFeature]["actors"][IFrom]["from"] = any,
  // @ts-ignore
  IType extends SextantFeatures[IFeature]["actors"][IFrom]["to"][ITarget]["in"]["type"] = any
> = Extract<
  // @ts-ignore
  SextantFeatures[IFeature]["actors"][IFrom]["to"][ITarget]["in"],
  { type: IType }
>;

export type SextantEventByFeature<
  IFeature extends keyof SextantFeatures,
  IType extends keyof SextantFeatures[IFeature]['events']
> = SextantFeatures[IFeature]['events'][IType];

/**
 * Fetch all events from an environment to another environment,
 * across features
 */
export type SextantAllEventsToActor<
  IFrom extends keyof SextantActors,
  ITo extends keyof SextantActors[IFrom]['from'] = any,
  // @ts-ignore
  IType extends SextantActors[IFrom]['from'][ITo]['out']['type'] = any
> = Extract<
  // @ts-ignore
  SextantActors[IFrom]['from'][ITo]['out'],
  { type: IType }
>;

export const sextantScenarios: {
  'props': [
    'add',
    'update',
    'remove',
  ],
};