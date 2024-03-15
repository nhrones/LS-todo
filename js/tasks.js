// deno-lint-ignore-file
import { currentTopic, todoCount, taskInput, todoList } from './dom.js';
import { saveTasks } from './db.js';
import { taskTemplate } from './templates.js';

/** on - adds an event handler to an htmlElement */
const on = (
   /** @type {HTMLParagraphElement | HTMLTextAreaElement} */ elem,
   /** @type {string} */ event,
   /** @type {{ (e: any): void; (): void; (e: any): void; }} */ listener
) => {
   return elem.addEventListener(event, listener)
}

/**
 * @type {any[]}
 */
export let tasks = []
/**
 * @param {any[]} data
 */
export function setTasks(data) {
   tasks = data
}
/**
 * Add a new task
 * @param {string} newTask
 * @param {boolean} topics
 */
export function addTask(newTask, topics = false) {
   if (topics) {
      newTask = `${newTask}
      newTopic, newKey`;
   }
   console.log('added task ', newTask);
   tasks.unshift({ text: newTask, disabled: false });
   saveTasks(topics);
   // @ts-ignore
   taskInput.value = "";
   // @ts-ignore
   taskInput.focus();
   refreshDisplay();
}
/** Display all tasks */
export function refreshDisplay() {
   // @ts-ignore
   todoList.innerHTML = "";
   if (tasks && tasks.length > 0) {
      tasks.forEach((item, index) => {
         const p = document.createElement("p");
         p.innerHTML = taskTemplate(index, item);
         on(p, 'click', (e) => {
            // lets the checkbox-change handler below work
            if (e.target.type === 'checkbox')
               return;
            // ignore all `textarea` elements
            if (e.target.type === 'textarea')
               return;
            const todoItem = e.target;
            const existingText = tasks[index].text;
            const editElement = document.createElement("textarea");
            editElement.setAttribute("rows", "6");
            editElement.setAttribute("cols", "62");
            editElement.setAttribute("wrap", "hard");
            editElement.setAttribute("autocorrect", "on");
            editElement.value = existingText;
            todoItem.replaceWith(editElement);
            editElement.focus();
            on(editElement, "blur", function () {
               const updatedText = editElement.value.trim();
               if (updatedText.length > 0) {
                  tasks[index].text = updatedText;
                  saveTasks((currentTopic === 'topics'));
               }
               refreshDisplay();
            });
         });
         // handle the `completed` checkbox change event
         // @ts-ignore
         on(p.querySelector(".todo-checkbox"), "change", (e) => {
            e.preventDefault();
            const index = e.target.dataset.index;
            tasks[index].disabled = !tasks[index].disabled;
            saveTasks(false);
         });
         // @ts-ignore
         todoList.appendChild(p);
      });
   }
   // update the task count
   // @ts-ignore
   todoCount.textContent = "" + tasks.length;
}
