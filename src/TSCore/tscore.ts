/** Third-party **/
/// <reference path="../../typings/tsd.d.ts" />

/** Data **/
/// <reference path="Data/Collection/Set.ts" />
/// <reference path="Data/Collection/Collection.ts" />
/// <reference path="Data/Collection/SortedCollection.ts" />
/// <reference path="Data/Collection/Dictionary.ts" />
/// <reference path="Data/Collection/Queue.ts" />
/// <reference path="Data/Collection/Grid.ts" />

/** Model **/
/// <reference path="Data/Model/Model.ts" />

/** DateTime **/
/// <reference path="DateTime/DateTime.ts" />
/// <reference path="DateTime/DateFormatter.ts" />
/// <reference path="DateTime/Timer.ts" />

/** Geometry **/
/// <reference path="Geometry/Point.ts" />
/// <reference path="Geometry/Size.ts" />
/// <reference path="Geometry/Rect.ts" />

/** Exception **/
/// <reference path="Exception/Exception.ts" />
/// <reference path="Exception/ArgumentException.ts" />

/** Event **/
/// <reference path="Event/EventEmitter.ts" />

/** Text **/
/// <reference path="Text/Format.ts" />
/// <reference path="Text/Language.ts" />
/// <reference path="Text/Random.ts" />
/// <reference path="Text/URL.ts" />

/** Model **/
/// <reference path="DI.ts" />

module TSCore {

    export interface IKeyValuePair {
        key:any,
        value:any
    }
}