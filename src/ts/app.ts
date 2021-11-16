import { Story } from './Story';

const init = () => {
    const story = new Story();
    story.render();

    const addTabElement = document.getElementById('add-tab') as HTMLDivElement;

    addTabElement.addEventListener('click', () => {
        const story = new Story();
        story.render();
    });
};

if (document.readyState !== 'loading') {
    init();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        init();
    });
}
