import { CHANNEL_SUBMIT } from '../../constants';
import { EventBus } from '../EventBus';

const createChannelSelectElement = (): HTMLDivElement => {
    const container = document.createElement('div');
    container.classList.add(
        'absolute',
        'border-b',
        'border-gray-700',
        'h-full',
        'w-full',
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
        'bg-gray-800',
        'transition-opacity',
        'duration-500',
    );

    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('mb-[5%]', 'border-b', 'border-gray-700');

    const input = document.createElement('input');
    input.type = 'text';
    input.autocomplete = 'off';
    input.placeholder = 'Channel...';
    input.spellcheck = false;
    input.classList.add(
        'h-12',
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

    container.appendChild(inputWrapper);
    return container;
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
