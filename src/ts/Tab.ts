const createTabElement = (): HTMLLabelElement => {
    const radioId = Math.random().toString(36).substring(2, 8);

    const tab = document.createElement('label');
    tab.classList.add('group', 'w-36', 'flex');
    tab.htmlFor = radioId;

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'tabs';
    radio.id = radioId;
    radio.classList.add('peer', 'hidden');
    radio.checked = true;

    const tabContent = document.createElement('div');
    tabContent.tabIndex = 0;
    tabContent.classList.add(
        'w-full',
        'p-2',
        'text-center',
        'border-gray-700',
        'border-r',
        'border-l',
        'cursor-pointer',
        'peer-checked:bg-gray-700',
        'peer-checked:cursor-default',
        'hover:bg-gray-600',
    );

    const tabTitle = document.createElement('span');
    tabTitle.classList.add('title');
    tabTitle.innerHTML = 'New Tab';

    const tabClose = document.createElement('span');
    tabClose.tabIndex = 0;
    tabClose.classList.add(
        'close-button',
        'float-right',
        'text-gray-400',
        'cursor-pointer',
        'text-base',
        'text-transparent',
        'group-hover:text-gray-400',
        'hover:text-gray-200',
    );
    tabClose.innerHTML = 'X';

    tabContent.appendChild(tabTitle);
    tabContent.appendChild(tabClose);

    tab.appendChild(radio);
    tab.appendChild(tabContent);

    return tab;
};

export class Tab {
    element: HTMLLabelElement;

    constructor() {
        this.element = createTabElement();
    }

    setTabTitle(newTitle: string): void {
        const titleElement = this.element.querySelector('.title') as HTMLSpanElement;
        titleElement.innerHTML = newTitle;
    }

    onClose(callback: () => void): void {
        const closeElement = this.element.querySelector('.close-button') as HTMLSpanElement;
        closeElement.addEventListener('click', callback);
    }

    onClick(callback: () => void): void {
        const radioElement = this.element.querySelector('input[type="radio"]') as HTMLInputElement;
        radioElement.addEventListener('click', callback);
        radioElement.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                callback();
            }
        });
    }

    delete(): void {
        this.element.remove();
    }

    render(): void {
        const addTabElement = document.getElementById('add-tab') as HTMLDivElement;
        const tabs = document.getElementById('tabs') as HTMLDivElement;

        tabs.insertBefore(this.element, addTabElement);
    }
}
