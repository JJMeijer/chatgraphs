const createChatAnchorElement = (): HTMLSpanElement => {
    const chatAnchorElement = document.createElement('span');
    chatAnchorElement.classList.add('chat-anchor');

    return chatAnchorElement;
};

export class ChatAnchor {
    element: HTMLSpanElement;

    constructor() {
        this.element = createChatAnchorElement();
    }

    isVisible(): boolean {
        const { top: anchorTop } = this.element.getBoundingClientRect();

        const parent = this.element.parentElement;
        if (parent === null) {
            throw new Error('chat anchor does not have parent');
        }

        const { bottom: parentBottom } = parent.getBoundingClientRect();

        return anchorTop < parentBottom;
    }
}
