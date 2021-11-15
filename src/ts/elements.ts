export const createNewTab = (number: number): HTMLLabelElement => {
    const label = document.createElement('label');
    label.classList.add('w-32', 'flex');
    label.htmlFor = `tab-${number}`;

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'tabs';
    input.id = `tab-${number}`;
    input.classList.add('peer', 'hidden');
    input.checked = true;

    const span = document.createElement('span');
    span.tabIndex = 0;
    span.classList.add(
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
    span.innerHTML = `Tab ${number}`;

    label.appendChild(input);
    label.appendChild(span);

    return label;
};
