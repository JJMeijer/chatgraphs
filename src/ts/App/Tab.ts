import { createElementFromHtml } from 'common/element';
import { CHANNEL_SUBMIT, CLOSE_APP, TAB_CLICK } from '../constants';
import { EventBus } from './EventBus';

const createTabElement = (): HTMLLabelElement => {
    const radioId = Math.random().toString(36).substring(2, 8);

    const html = /*html*/ `
        <label class="group w-36 flex" for="${radioId}">
            <input type="radio" name="tabs" id="${radioId}" class="peer hidden" checked>
            <div tabindex="0" class="
                w-full
                p-2
                text-center
                border-gray-700
                border-r
                border-l
                cursor-pointer
                peer-checked:bg-gray-700
                peer-checked:cursor-default
                hover:bg-gray-600
            ">
                <span class="title">New Tab</span>
                <span tabindex="0" class="
                    close-button
                    float-right
                    text-gray-400
                    cursor-pointer
                    text-base
                    text-transparent
                    group-hover:text-gray-400
                    hover:!text-gray-100
                ">
                    X
                </span>
            </div>
        </label>
    `;

    return createElementFromHtml<HTMLLabelElement>(html);
};

export class Tab {
    element: HTMLLabelElement;
    eventBus: EventBus;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createTabElement();

        this.setListeners();
        this.setSubscribers();
    }

    setListeners(): void {
        const closeElement = this.element.querySelector('.close-button') as HTMLSpanElement;
        closeElement.addEventListener('click', () => {
            this.eventBus.publish({
                eventName: CLOSE_APP,
            });
        });

        const radioElement = this.element.querySelector('input[type="radio"]') as HTMLInputElement;
        const tabClickCallback = () => {
            this.eventBus.publish({
                eventName: TAB_CLICK,
            });
        };

        radioElement.addEventListener('click', tabClickCallback);
        radioElement.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                tabClickCallback();
            }
        });
    }

    setSubscribers(): void {
        this.eventBus.subscribe({
            eventName: CLOSE_APP,
            eventCallback: () => {
                this.delete();
            },
        });

        this.eventBus.subscribe({
            eventName: CHANNEL_SUBMIT,
            eventCallback: ({ channel }) => {
                this.setTabTitle(channel);
            },
        });
    }

    setTabTitle(newTitle: string): void {
        const titleElement = this.element.querySelector('.title') as HTMLSpanElement;
        titleElement.innerHTML = newTitle;
    }

    delete(): void {
        // Focus previousSibling before deleting
        const sibling = this.element.previousElementSibling;

        if (sibling instanceof HTMLLabelElement) {
            sibling.click();
        }

        this.element.remove();
    }

    render(): void {
        const addTabElement = document.getElementById('add-tab') as HTMLDivElement;
        const tabs = document.getElementById('tabs') as HTMLDivElement;

        tabs.insertBefore(this.element, addTabElement);
    }
}
