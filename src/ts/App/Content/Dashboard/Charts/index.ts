import { EventBus } from '../../../EventBus';

const createChartsElement = () => {
    const chartsElement = document.createElement('div');
    chartsElement.classList.add(
        'flex',
        'flex-col',
        'h-full',
        'justify-center',
        'items-center',
        'w-3/4',
    );

    chartsElement.innerHTML = 'CHARTS';
    return chartsElement;
};

export class Charts {
    eventBus: EventBus;
    element: HTMLDivElement;

    constructor(eventBus: EventBus) {
        this.eventBus = eventBus;
        this.element = createChartsElement();
    }
}
