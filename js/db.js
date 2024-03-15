
import { addOptionGroup, resetTopicSelect } from './selectBuilder.js';
import { refreshDisplay, setTasks, tasks } from './tasks.js';
import { currentTopic, popupText, popupDialog } from './dom.js';
import { initCache, getFromCache, setCache } from './dbCache.js';
import { restoreData } from './backup.js'
/** 
 * db module
 * @module DBModule - the db module
 * @description - The db module (db.js) is responsible for communicating with the persistance layer.
 */

/**@type {string}*/
let thisKeyName = ''

/**
 * Hydrates cache data from IDB
 * @export
 * @async
 * @returns {Promise<void>}
 */
export async function initDB() {
   // hydrate from db
   await initCache();
}

/**
 * Retrieve array of tasks from the service
 * or initialize an empty task array
 * @param {string} [key] optional name of the record to fetch (data-key)
 */
export function getTasks(key) {
   thisKeyName = key || "";
   if (thisKeyName.length) {

      /** @type {Array<string>} */
      let data = getFromCache(thisKeyName) ?? [];
      if (data === null) {
         console.log(`No data found for ${thisKeyName}`);
         data = [];
      }
      setTasks(data);
      refreshDisplay();
   }
}

/**
 * build a set of select options
 */
export function buildTopics() {
   /** @type {Array<string>} */
   const data = getFromCache("topics");
   resetTopicSelect();
   if (data && data.length > 0) {
      for (let i = 0; i < data.length; i++) {
         const parsedTopics = parseTopics(data[i]);
         addOptionGroup(parsedTopics.group, parsedTopics.entries);
      }
   } else {
      restoreData()
   }
}
/**
 * parseTopics
 * @param {*} topics 
 * @returns array
 */
// deno-lint-ignore no-explicit-any
function parseTopics(topics) {
   const topicObject = { group: "", entries: [] };
   const thisTopic = topics;
   const txt = thisTopic.text;
   const lines = txt.split('\n');
   topicObject.group = lines[0].trim();
   for (let i = 1; i < lines.length; i++) {
      const newObj = { title: "", key: "" };
      const element = lines[i];
      const items = element.split(',');
      const title = items[0];
      const keyName = items[1].trim();
      newObj.title = title;
      newObj.key = keyName;
      // @ts-ignore
      topicObject.entries[i - 1] = newObj;
   }
   return topicObject;
}

/**
 * Save all tasks
 * @export
 * @param {boolean} topicChanged
 */
export function saveTasks(topicChanged) {
   setCache(thisKeyName, tasks, topicChanged);
}

/**@typedef {{disabled: boolean, text: string}} Task*/
/**
 * Delete completed tasks
 */
export function deleteCompleted() {
   /** @type {Task[]} */
   const savedtasks = [];
   let numberDeleted = 0;
   tasks.forEach((/**@type {Task} */ task) => {
      if (task.disabled === false) {
         savedtasks.push(task);
      } else {
         numberDeleted++;
      }
   });
   setTasks(savedtasks);
   saveTasks((currentTopic === 'topics'));

   popupText.textContent = `Removed ${numberDeleted} tasks!`;
   // @ts-ignore
   popupDialog.showModal();
}
