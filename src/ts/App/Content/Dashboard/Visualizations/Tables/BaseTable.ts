import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

import { BaseVizualization } from '../BaseVisualization';
import { TableData } from 'common/types';

const html = /*html*/ `
    <div class="w-full h-full justify-content border border-gray-700">
        <p class='table-title text-center font-bold text-sm'></p>
        <table></table>
    </div>
`;

export class BaseTable extends BaseVizualization {
    data: TableData[] = [];

    tableWrapper = createElementFromHtml<HTMLDivElement>(html);
    tableTitle = this.tableWrapper.querySelector('.table-title') as HTMLParagraphElement;

    constructor(eventBus: EventBus, title: string) {
        super(eventBus);

        this.tableTitle.innerText = title;

        this.render();
    }

    render(): void {
        this.element.appendChild(this.tableWrapper);
    }
}
