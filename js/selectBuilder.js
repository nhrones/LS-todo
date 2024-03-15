import { topicSelect } from './dom.js';
export function resetTopicSelect() {
    topicSelect.innerHTML = '<option value="" disabled selected hidden>Select A Todo Topic</option>';
}
/**
 * Build selectTag option group.
 * @returns an HTMLOptGroupElement
 * @param {string} label
 * @param {string | any[]} options
 */
export function addOptionGroup(label, options) {
    const len = options.length;
    let optionElement;
    const optionGroup = document.createElement('optgroup');
    optionGroup.label = label;
    for (let i = 0; i < len; ++i) {
        optionElement = document.createElement('option');
        optionElement.textContent = options[i].title || 'fuck';
        optionElement.value = options[i].key || 'fuck';
        optionGroup.appendChild(optionElement);
    }
    topicSelect.appendChild(optionGroup);
    return optionGroup;
}
