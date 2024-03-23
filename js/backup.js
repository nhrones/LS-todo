import { restoreCache, todoCache } from './dbCache.js';

/**
 * export data from persitence
 * @returns void - calls saveDataFile()
 */
export function backupData() {
   // get all todo records as a string
   const jsonData = JSON.stringify(Array.from(todoCache.entries()));
   // create a dummy anchor element
   const link = document.createElement("a");
   // create the file blob from the data
   const file = new Blob([jsonData], { type: 'application/json' });
   // create a file url 
   link.href = URL.createObjectURL(file);
   // force the link to down load as file name 'backup.json'
   link.download = "backup.json";
   // stimulate the anchor click event
   link.click();
   // cleanup the url object (file)
   URL.revokeObjectURL(link.href);
}

/**
 * Restore data
 */
export function restoreData() {

   /** @type {HTMLElement | HTMLInputElement | null} */
   const fileload = document.getElementById('fileload');
   // inline type cast (coersion)
   const fileloadInput = /** @type {HTMLInputElement} */ (fileload)
   // simulate a user click event 
   fileloadInput.click();
   // handle user action (file select)
   fileloadInput.addEventListener('change', function () {     
      /** @type {FileReader} */
      const reader = new FileReader();
      reader.onload = function () {
         // inline type cast
         restoreCache(/**@type{string}*/ (reader.result));
         // refresh the app to see the restored data
         window.location.reload();
      };
      // read the first selected json file
      if ( fileload && fileloadInput.files ) {
         reader.readAsText(fileloadInput.files[0]);
      }
   });
}
