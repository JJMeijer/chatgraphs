import { createNewTab } from './elements';

const setAddTabListener = () => {
    const addTabElement = document.getElementById('add-tab') as HTMLDivElement;
    const tabs = document.getElementById('tabs') as HTMLDivElement;

    addTabElement.addEventListener('click', () => {
        const tabNumber = document.querySelectorAll('[id^=tab-]').length + 1;
        const newTab = createNewTab(tabNumber);

        tabs.insertBefore(newTab, addTabElement);
    });
};

const setTabClickListener = () => {
    const tabs = document.getElementById('tabs') as HTMLDivElement;

    tabs.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const { id } = target;

        if (id.match('^tab-[0-9]+')) {
            target.setAttribute('checked', 'checked');
        }
    });
};

export const setListeners = () => {
    setAddTabListener();
    setTabClickListener();
};
