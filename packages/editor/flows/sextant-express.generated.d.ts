import {
  SextantAllEventsToActor,
  SextantActors,
  SextantFeatures,
  SextantEvent,
} from './sextant-types.generated';
import { RequestHandler } from 'express';

/**
 * An express request handler that can handle
 * all events from one actor to another
 */
export type SextantExpressSingleActorHandler<
  IFrom extends keyof SextantActors,
  ITo extends keyof SextantActors[IFrom]['to'] = any
> = RequestHandler<
  any,
  // @ts-ignore
  SextantAllEventsToActor<ITo, IFrom>,
  // @ts-ignore
  SextantAllEventsToActor<IFrom, ITo>
>;

/**
 * An express request handler that handles one feature only
 */
export type SextantExpressHandler<
  IFeature extends keyof SextantFeatures,
  IFrom extends keyof SextantFeatures[IFeature]['actors'] = any,
  // @ts-ignore
  ITarget extends keyof SextantFeatures[IFeature]['actors'][IFrom]['from'] = any
> = RequestHandler<
  any,
  // @ts-ignore
  SextantEvent<IFeature, ITarget, IFrom>,
  SextantEvent<IFeature, IFrom, ITarget>
>;

/**
 * Build multiple express request handlers by passing in
 * implementation details per feature
 */
export function makeExpressHandlers<
  IFrom extends keyof SextantActors,
  ITo extends keyof SextantActors[IFrom]['to'] = any
>(
  from: IFrom,
  to: ITo,
  params: {
    // @ts-ignore
    [K in keyof SextantFeatures]?: SextantExpressHandler<K, IFrom, ITo>;
  },
): { feature: keyof SextantFeatures; handler: RequestHandler }[];

export function makeSextantExpressSdk<
  IFrom extends keyof SextantActors,
  ITo extends keyof SextantActors[IFrom]['to'] = any
>(
  from: IFrom,
  to: ITo,
  fetcher: <IFeature extends keyof SextantFeatures>(
    feature: IFeature,
    // @ts-ignore
    event: SextantEvent<IFeature, IFrom, ITo>,
  ) => //
  // @ts-ignore
  Promise<SextantEvent<IFeature, ITo, IFrom>>,
): <IFeature extends keyof SextantFeatures>(
  feature: IFeature,
  // @ts-ignore
  event: SextantEvent<IFeature, IFrom, ITo>,
) => //
// @ts-ignore
Promise<SextantEvent<IFeature, ITo, IFrom>>;