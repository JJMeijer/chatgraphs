import { CHANNEL_SUBMIT } from '../../constants';
import { EventBus } from '../EventBus';

const createChannelSelectElement = (): HTMLDivElement => {
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('mb-[5%]', 'border-b', 'border-gray-700');

    const input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = 'Channel...';
    input.spellcheck = false;
    input.classList.add(
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

    inputWrapper.appendChild(input);
    inputWrapper.appendChild(submitButton);

    return inputWrapper;
};

export class ChannelSelect {
    eventBus: EventBus;
    element: HTMLDivElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createChannelSelectElement();

        this.setListeners();
    }

    setListeners(): void {
        const submitCallback = (channel: string) => {
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
}
