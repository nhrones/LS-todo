
import { addTask, refreshDisplay } from './tasks.js';
import { deleteCompleted, initDB, getTasks } from './db.js';
import { backupData, restoreData } from './backup.js';

/** @type {string} */
export let currentTopic = "topics"

/** @param {string} topic */
export function setCurrentTopic(topic){
   currentTopic = topic
}


/** Shortcut for document.getElementById */
const $ = (/** @type {string} */id) => document.getElementById(id)

/** on - adds an event handler to an htmlElement */
const on = ( 
   /** @type {HTMLElement | null} */ elem, 
   /** @type {string} */ event, 
   /** @type {{ (evt: any): void; (): void; (): void; (event: any): void; (event: any): void; (evt: any): void; (event: any): void; (): void; (): void; }} */ listener) => {
   return elem?.addEventListener(event, listener)
}

/* create references for all UI elements */
export const backupBtn = /** @type {HTMLButtonElement} */ ($("backupbtn"));
export const restoreBtn = /** @type {HTMLButtonElement} */ ($("restorebtn"));
export const taskInput = /** @type {HTMLInputElement} */ ($("taskInput"));
export const todoCount = /** @type {HTMLSpanElement} */ ($("todoCount"));
export const todoList = /** @type {HTMLElement} */ ($("todoList"));
export const deleteCompletedBtn = /** @type {HTMLButtonElement} */ ($("deletecompleted"));
export const topicSelect = /** @type {HTMLSelectElement} */ ($('topicselect'));
export const popupDialog = /** @type {HTMLDialogElement} */ ($('popupDialog'));
export const pinInput = /** @type {HTMLInputElement} */ ($('pin'));   
export const myDialog = /** @type {HTMLDialogElement} */ ($('myDialog'));
export const popupText =  /** @type {HTMLElement} */ ($("popup_text"));

let pinOK = false
let pinTryCount = 0

/** initialize all UI and event handlers */
export async function initDom() {
   // initialize the local DB cache
   await initDB();
   // input keydown handler
   on(taskInput, "keydown", function (evt) {
      const { key } = evt;
      if (key === "Enter") {
         evt.preventDefault();
         const tc = taskInput.value;
         if (tc.length > 0) {
            addTask(tc, currentTopic === 'topics');
         }
      }
   });

   // topic select change handler
   on(topicSelect, 'change', () => {
      setCurrentTopic( topicSelect.value.toLowerCase());
      getTasks(currentTopic);
   });

   // delete completed button click handler
   on(deleteCompletedBtn, "click", () => {
      deleteCompleted();
      refreshDisplay();
   });

   // popup click handler
   on(popupDialog, 'click', (event) => {
      event.preventDefault();
      popupDialog.close();
   });

   // popup close handler
   on(popupDialog, 'close', (event) => {
      console.log('popupDialog close')
      event.preventDefault();
      if (!pinOK) myDialog.showModal()
   });

   // popup keyup handler
   on(popupDialog, "keyup", (evt) => {
      evt.preventDefault()
      popupDialog.close()
      if (!pinOK) myDialog.showModal()
   });

   // pin input keyup handler
   on(pinInput, 'keyup', (event) => {
      event.preventDefault()
      pinTryCount += 1
      console.log('pinInput key:', event.key)
      if (event.key === "Enter" || pinInput.value === "1313") {
         console.log('pinInput.value = ', pinInput.value)
         if (pinInput.value === "1313") {
            pinInput.value = ""
            pinOK = true
            myDialog.close()
         } else {
            myDialog.close()
            pinInput.value = ""
            pinOK = false
            popupText.textContent = (pinTryCount === 3)
               ?`Incorrect pin entered ${pinTryCount} times!
 Please close this Page!`
               : `Incorrect pin entered!`

             if  (pinTryCount === 3) {
               document.body.innerHTML = `
               <h1>Three failed PIN attempts!</h1>
               <h1>Please close this page!</h1>`
             } else {
               popupDialog.showModal()
             }
         }
      }
   })
   
   // backup button click handler
   on(backupBtn, 'click', () => {
      backupData();
   });

   // restore button click handler
   on(restoreBtn, 'click', () => {
      restoreData();
   });

   // initial display refresh
   refreshDisplay();

   // check search param to bypass pin input
   if (window.location.search !== '?ndh') {
      // initial pin input
      myDialog.showModal()
      //@ts-ignore focusVisible missing from  D.TS
      pinInput.focus({ focusVisible: true })
   } else {
      pinOK = true
   }
}
