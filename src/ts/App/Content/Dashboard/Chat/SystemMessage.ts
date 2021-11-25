const createSystemMessage = (message: string): HTMLDivElement => {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('message', 'inline', 'w-full', 'px-1', 'my-1', 'text-center', 'bg-gray-700');

    const cleanMessage = message.replace(/\\s/g, ' ');

    messageWrapper.innerHTML = `<span class="text-gray-300 p-2">${cleanMessage}</span>`;

    return messageWrapper;
};

export class SystemMessage {
    element: HTMLDivElement;

    constructor(message: string) {
        this.element = createSystemMessage(message);
    }
}
