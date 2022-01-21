import { EventBus } from 'common/EventBus';
import { createElementFromHtml } from 'common/element';

import { BaseVizualization } from '../BaseVisualization';
import { TableData } from 'common/types';

const html = /*html*/ `
    <div class="w-full h-full justify-content">
        <p class='table-title text-center font-bold text-sm  pb-4'></p>
        <div class="overflow-auto h-[350px] scrollbar-thin scrollbar-thumb-gray-600 hover:scrollbar-thumb-gray-500">
            <table class="w-full">
                <thead>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
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

    initTable(colNames: string[]): void {
        const headerHtml = /*html*/ `
            <tr class="sticky top-0 h-10 bg-gray-600 rounded-t-md">
                ${colNames
                    .map((colName, ind) => {
                        const textDirection = ind !== colNames.length - 1 ? 'text-left' : 'text-right';
                        const colWidth = ind === 0 ? 'w-1/2' : '';

                        return `<th class="${textDirection} ${colWidth} px-4 py-2">${colName}</th>`;
                    })
                    .join('')}
            </tr>
        `;

        const headerElement = createElementFromHtml<HTMLTableRowElement>(headerHtml);
        this.tableHeader.appendChild(headerElement);
    }

    createRow(data: string[]): void {
        const rowHtml = /*html*/ `
            <tr class="h-8 text-left">
                ${data
                    .map((_, ind) => {
                        const textDirection = ind !== data.length - 1 ? 'text-left' : 'text-right';

                        return `<td class="${textDirection} px-4 py-1"></td>)`;
                    })
                    .join('')}
            </tr>
        `;

        const rowElement = createElementFromHtml<HTMLTableRowElement>(rowHtml);
        this.tableBody.appendChild(rowElement);
    }

    updateTable(): void {
        this.data.forEach((tableDataItem, rowInd) => {
            const rowCount = this.tableBody.childElementCount;

            if (rowInd + 1 > rowCount) {
                const data = Object.values(tableDataItem).map((x) => String(x));
                this.createRow(data);
                return;
            }

            Object.keys(tableDataItem).forEach((key, colInd) => {
                const newData = String(tableDataItem[key]);

                const tableCell = this.tableBody.querySelector(
                    `tr:nth-child(${rowInd + 1}) td:nth-child(${colInd + 1})`,
                ) as HTMLTableCellElement;

                const oldData = tableCell.innerHTML;

                if (newData !== oldData) {
                    tableCell.innerHTML = newData;
                }
            });
        });
    }
}
