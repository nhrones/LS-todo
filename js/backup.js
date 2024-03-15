import { restoreCache, todoCache } from './dbCache.js';

/**NEW
 * export data from persitence
 * @returns void - calls saveDataFile()
 */
export function backupData() {
   // get all todo records
   const jsonData = JSON.stringify(Array.from(todoCache.entries()));
   const link = document.createElement("a");
   const file = new Blob([jsonData], { type: 'application/json' });
   link.href = URL.createObjectURL(file);
   link.download = "backup.json";
   link.click();
   URL.revokeObjectURL(link.href);
}

/**
 * Restore data
 *
 * @export
 */
export function restoreData() {

   /** @type {HTMLElement | HTMLInputElement | null} */
   const fileload = document.getElementById('fileload');
   const fileloadInput = /** @type {HTMLInputElement} */  (fileload) // type coersion
   fileloadInput.click();
   fileloadInput.addEventListener('change', function () {
      
      /** @type {FileReader} */
      const reader = new FileReader();
      reader.onload = function () {
         console.log('backup -> restoring')
         restoreCache(/**@type{string}*/ (reader.result));
         window.location.reload();
      };
      if( fileload && fileloadInput.files ) {
         reader.readAsText(fileloadInput.files[0]);
      }
   });
}
