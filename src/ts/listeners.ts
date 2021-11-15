import { createNewTab } from './elements';

const setAddTabListener = () => {
    const addTabElement = document.getElementById('add-tab') as HTMLDivElement;
    const tabs = document.getElementById('tabs') as HTMLDivElement;

    let tabCount = 1;

    addTabElement.addEventListener('click', () => {
        ++tabCount;
        const newTab = createNewTab(tabCount);

        tabs.insertBefore(newTab, addTabElement);
    });
};

const setTabClickListener = () => {
    const tabs = document.getElementById('tabs') as HTMLDivElement;

    tabs.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const { id } = target;

        if (id.match('^tab-input-[0-9]+')) {
            target.setAttribute('checked', 'checked');
        }

        if (id.match('^tab-close-[0-9]+')) {
            const closestLabel = target.closest('label') as HTMLLabelElement;
            closestLabel.remove();
        }
    });
};

export const setListeners = () => {
    setAddTabListener();
    setTabClickListener();
};
