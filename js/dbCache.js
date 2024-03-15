// deno-lint-ignore-file no-explicit-any
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
/** hydrate a dataset from a remote json file */
async function hydrate() {

   // make a call to get our json data
   //const result = await Git.readFile(ctx)
   let result = localStorage.getItem("todos");
   //const lastHash = localStorage.getItem("hash")

   // next check hash for change
   //const currentGitHash = await Git.getCurrentHash(ctx)
   //console.log(`gitHash: ${currentGitHash}
   //localHash ${lastHash} ` );

   // fetch any fresh data from github
   // if (lastHash === null || currentGitHash !== lastHash) {
   //    console.log(`data not fresh!`)
   //    result = await Git.readFile(ctx)
   //    // refresh the localStore hash
   //    localStorage.setItem("hash", currentGitHash)
   // }

   // load our local cache
   todoCache = new Map(JSON.parse(`${result}`));

   buildTopics();
}
/**
 * Persist the current todoCache to remote json file
 * This is called for any mutation of the todoCache (set/delete)
 */
async function persist() {

   // update git hash 
   //ctx.sha = await Git.getCurrentHash(ctx)
   
   // get cache-Map entries as array
   const todoJson = JSON.stringify(Array.from(todoCache.entries()));
   
   // persist local
   localStorage.setItem("todos", todoJson);
   
   // Write the cache to Github
   //const newHash = await Git.writeFile(ctx, todoJson)
   
   // update local hash
   //localStorage.setItem("hash", newHash);
}
