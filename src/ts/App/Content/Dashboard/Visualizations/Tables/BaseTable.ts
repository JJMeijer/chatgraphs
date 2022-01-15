import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

import { BaseVizualization } from '../BaseVisualization';
import { TableData } from 'common/types';

const html = /*html*/ `
    <div class="w-full h-full justify-content">
        <p class='table-title text-center font-bold text-sm'></p>
        <table class="w-full h-full">
            <thead>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
`;

export class BaseTable extends BaseVizualization {
    data: TableData[] = [];

    tableWrapper = createElementFromHtml<HTMLDivElement>(html);
    tableTitle = this.tableWrapper.querySelector('.table-title') as HTMLParagraphElement;
    tableHeader = this.tableWrapper.querySelector('thead') as HTMLTableSectionElement;
    tableBody = this.tableWrapper.querySelector('tbody') as HTMLTableSectionElement;

    constructor(eventBus: EventBus, title: string) {
        super(eventBus);

        this.tableTitle.innerText = title;

        this.render();
    }

    render(): void {
        this.element.appendChild(this.tableWrapper);
    }

    createTable(colNames: string[]): void {
        const headerHtml = /*html*/ `
            <tr class="border-b-2 border-gray-700 text-left">
                ${colNames.map((colName) => `<th>${colName}</th>`).join('')}
            </tr>
        `;

        const headerElement = createElementFromHtml<HTMLTableRowElement>(headerHtml);
        this.tableHeader.appendChild(headerElement);

        const rowHtml = /*html*/ `
            <tr class="text-left">
                ${colNames.map(() => `<td></td>)`).join('')}
            </tr>
        `;

        for (let i = 0; i < 10; i++) {
            const rowElement = createElementFromHtml<HTMLTableRowElement>(rowHtml);
            this.tableBody.appendChild(rowElement);
        }
    }

    updateTable(): void {
        this.data.forEach((tableDataElement, rowInd) => {
            Object.keys(tableDataElement).forEach((key, colInd) => {
                const newData = String(tableDataElement[key]);

                const tableCell = this.tableBody.querySelector(
                    `tr:nth-child(${rowInd + 1}) td:nth-child(${colInd + 1})`,
                ) as HTMLTableCellElement;

                const oldData = tableCell.innerText;

                if (newData !== oldData) {
                    tableCell.innerText = newData;
                }
            });
        });
    }
}