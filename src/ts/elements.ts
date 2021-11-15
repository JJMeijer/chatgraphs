export const createNewTab = (number: number): HTMLLabelElement => {
    const label = document.createElement('label');
    label.classList.add('group', 'w-36', 'flex');
    label.htmlFor = `tab-input-${number}`;

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'tabs';
    input.id = `tab-input-${number}`;
    input.classList.add('peer', 'hidden');
    input.checked = true;

    const spanClose = document.createElement('span');
    spanClose.tabIndex = 0;
    spanClose.id = `tab-close-${number}`;
    spanClose.classList.add(
        'float-right',
        'text-gray-400',
        'cursor-pointer',
        'text-base',
        'text-transparent',
        'group-hover:text-gray-400',
    );
    spanClose.innerHTML = 'X';

    const spanContent = document.createElement('span');
    spanContent.tabIndex = 0;
    spanContent.classList.add(
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
    spanContent.innerHTML = `Tab ${number} ${spanClose.outerHTML}`;

    label.appendChild(input);
    label.appendChild(spanContent);

    return label;
};
