import { createElementFromHtml } from 'common/element';
import { CHANNEL_SUBMIT } from '../../constants';
import { EventBus } from '../EventBus';

const html = /*html*/ `
    <div
        class="
            absolute
            border-b border-gray-700
            h-full
            w-full
            flex flex-col
            justify-center
            items-center
            bg-gray-800
            transition-opacity
            duration-500
        "
    >
        <div class="mb-[5%] border-b border-gray-700">
            <input
                type="text"
                autocomplete="off"
                placeholder="Channel..."
                spellcheck="false"
                class="
                    h-12
                    placeholder-gray-500
                    caret-gray-500
                    bg-gray-800
                    outline-none
                    text-3xl
                    w-96
                    p-2
                "
            />
            <span
                tabindex="0"
                class="
                    submit-button
                    text-3xl
                    cursor-pointer
                    hover:text-gray-100
                    focus:text-gray-100
                    outline-none
                "
            >
                &#8594;
            </span>
        </div>
    </div>
`;

export class ChannelSelect {
    eventBus: EventBus;
    element: HTMLDivElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createElementFromHtml<HTMLDivElement>(html);

        this.setListeners();
    }

    setListeners(): void {
        const submitCallback = (channel: string) => {
            this.element.classList.add('opacity-0');

            setTimeout(() => {
                this.element.classList.replace('flex', 'hidden');
            }, 500);

            this.eventBus.publish({
                eventName: CHANNEL_SUBMIT,
                eventData: {
                    channel,
                },
            });
        };

        const submitButton = this.element.querySelector('.submit-button') as HTMLSpanElement;
        const inputElement = this.element.querySelector('input') as HTMLInputElement;

        submitButton.addEventListener('click', () => submitCallback(inputElement.value));
        submitButton.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                submitCallback(inputElement.value);
            }
        });

        inputElement.addEventListener('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                submitCallback(inputElement.value);
            }
        });
    }

    focus(): void {
        const inputElement = this.element.querySelector('input') as HTMLInputElement;
        inputElement.focus();
    }
}
