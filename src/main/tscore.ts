/** Data **/
/// <reference path="TSCore/Data/Collection/Set.ts" />
/// <reference path="TSCore/Data/Collection/Collection.ts" />
/// <reference path="TSCore/Data/Collection/SortedCollection.ts" />
/// <reference path="TSCore/Data/Collection/Dictionary.ts" />
/// <reference path="TSCore/Data/Collection/Queue.ts" />
/// <reference path="TSCore/Data/Collection/Grid.ts" />

/** Model **/
/// <reference path="TSCore/Data/Model/Model.ts" />

/** DateTime **/
/// <reference path="TSCore/DateTime/DateTime.ts" />
/// <reference path="TSCore/DateTime/DateFormatter.ts" />
/// <reference path="TSCore/DateTime/Timer.ts" />

/** Geometry **/
/// <reference path="TSCore/Geometry/Point.ts" />
/// <reference path="TSCore/Geometry/Size.ts" />
/// <reference path="TSCore/Geometry/Rect.ts" />

/** Exception **/
/// <reference path="TSCore/Exception/Exception.ts" />
/// <reference path="TSCore/Exception/ArgumentException.ts" />

/** Event **/
/// <reference path="TSCore/Event/EventEmitter.ts" />

/** Text **/
/// <reference path="TSCore/Text/Format.ts" />
/// <reference path="TSCore/Text/Language.ts" />
/// <reference path="TSCore/Text/Random.ts" />
/// <reference path="TSCore/Text/URL.ts" />

/** Model **/
/// <reference path="TSCore/DI.ts" />


module TSCore {

    export interface IKeyValuePair {
        key:any,
        value:any
    }
}