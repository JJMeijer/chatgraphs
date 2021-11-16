const createContentElement = (): HTMLDivElement => {
    const contentWrapper = document.createElement('div');
    contentWrapper.classList.add(
        'content-wrapper',
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
        'h-full',
    );

    const searchWrapper = document.createElement('div');
    searchWrapper.classList.add('mb-[5%]', 'border-b', 'border-gray-700');

    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.autocomplete = 'off';
    searchBar.placeholder = 'Channel...';
    searchBar.spellcheck = false;
    searchBar.classList.add(
        'placeholder-gray-500',
        'caret-gray-500',
        'bg-gray-800',
        'outline-none',
        'text-3xl',
        'w-96',
        'p-2',
    );

    const submitButton = document.createElement('span');
    submitButton.tabIndex = 0;
    submitButton.classList.add(
        'submit-button',
        'text-3xl',
        'cursor-pointer',
        'hover:text-gray-100',
        'focus:text-gray-100',
        'outline-none',
    );
    submitButton.innerHTML = '&#8594;';

    searchWrapper.appendChild(searchBar);
    searchWrapper.appendChild(submitButton);

    contentWrapper.appendChild(searchWrapper);

    return contentWrapper;
};

export class Content {
    element: HTMLDivElement;

    constructor() {
        this.element = createContentElement();
    }

    static hideAll() {
        // Hide other content wrappers
        const allContentWrappers = document.querySelectorAll('.content-wrapper');
        allContentWrappers.forEach((element) => element.classList.replace('flex', 'hidden'));
    }

    show() {
        Content.hideAll();

        // Show this content wrapper
        this.element.classList.replace('hidden', 'flex');
    }

    delete() {
        this.element.remove();
    }

    onSubmit(callback: (value: string) => void): void {
        const submitButton = this.element.querySelector('.submit-button') as HTMLSpanElement;
        const inputElement = this.element.querySelector('input') as HTMLInputElement;

        submitButton.addEventListener('click', () => callback(inputElement.value));
        submitButton.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                callback(inputElement.value);
            }
        });

        inputElement.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                callback(inputElement.value);
            }
        });
    }

    render() {
        Content.hideAll();

        const contentContainer = document.getElementById('content') as HTMLDivElement;
        contentContainer.appendChild(this.element);
        this.element.focus();
    }
}
