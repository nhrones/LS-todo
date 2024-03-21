
import { buildTopics } from './db.js';

/**
 * @type {Object.<String, String>}
 */
export let todoCache = new Map();

/**
 * db init - Hydrates the complete DB 
 * @export
 * @async
 * @returns {Promise<void>}
 */
export async function initCache() {
   return await hydrate();
}

/**
 * restore our cache from a json backup
 * @param {string} records
 */
export function restoreCache(records) {
   const tasksObj = JSON.parse(records);
   todoCache = new Map(tasksObj);
   persist();
}

/**
 * The `remove` method mutates - will call the `persist` method.
 * @param {string} key
 */
export function removeFromCache(key) {
   const result = todoCache.delete(key);
   if (result === true) persist();
   return result;
}

/** The `get` method will not mutate records */
export const getFromCache = (/** @type {string} */ key) => {
   return todoCache.get(key);
};

/**
 * The `set` method mutates - will call the `persist` method.
 * @param {string} key
 * @param {any[]} value
 * @param {boolean} topicChanged
 */
export function setCache(key, value, topicChanged = false) {
   todoCache.set(key, value);
   persist();
   if (topicChanged) { 
      //TODO just reload topics
   }
}

/** 
 * hydrate a dataset from a remote json file 
 */
async function hydrate() {

   let result = localStorage.getItem("todos");
   // load our local cache
   todoCache = new Map(JSON.parse(`${result}`));

   buildTopics();
}
/**
 * Persist the current todoCache to remote json file
 * This is called for any mutation of the todoCache (set/delete)
 */
async function persist() {

   // get cache-Map entries as array
   const todoJson = JSON.stringify(Array.from(todoCache.entries()));
   
   // persist local
   localStorage.setItem("todos", todoJson);
}
