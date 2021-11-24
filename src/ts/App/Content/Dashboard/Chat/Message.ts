const createMessageElement = (time: string, color: string, userName: string, content: string) => {
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('inline', 'w-full', 'px-1');

    messageWrapper.innerHTML = `
        <span class="text-gray-500 mr-1">${time}</span>
        <span class="mr-1" style="color: ${color};">${userName}</span>
        <span>${content}</span>
    `;

    return messageWrapper;
};

export class Message {
    element: HTMLDivElement;

    constructor(time: string, color: string, userName: string, content: string) {
        this.element = createMessageElement(time, color, userName, content);
    }
}
