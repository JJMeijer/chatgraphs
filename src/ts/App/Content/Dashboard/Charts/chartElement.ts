import { createElementFromHtml } from 'common/element';

export const getChartElement = (): HTMLDivElement => {
    const html = /*html*/ `
        <div class="flex items-center justify-center w-1/2 h-1/3 px-2 border-r border-b border-gray-700">
            <canvas></canvas>
        </div>
    `;

    return createElementFromHtml<HTMLDivElement>(html);
};
