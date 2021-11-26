export const createElementFromHtml = <T extends HTMLElement>(html: string): T => {
    const template = document.createElement('template');
    template.innerHTML = html.trim();

    return template.content.firstChild as T;
};
