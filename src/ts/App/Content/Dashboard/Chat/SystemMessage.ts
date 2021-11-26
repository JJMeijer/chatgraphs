import { createElementFromHtml } from 'common/element';

const createSystemMessage = (message: string): HTMLDivElement => {
    const cleanMessage = message.replace(/\\s/g, ' ');

    const html = /*html*/ `
        <div class="message inline w-full px-1 my-1 text-center bg-gray-700">
            <span class="text-gray-300 p-2">${cleanMessage}</span>
        </div>
    `;

    return createElementFromHtml<HTMLDivElement>(html);
};

export class SystemMessage {
    element: HTMLDivElement;

    constructor(message: string) {
        this.element = createSystemMessage(message);
    }
}
