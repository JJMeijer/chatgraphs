import { App } from './App';

const init = () => {
    const app = new App();
    app.render();

    const addTabElement = document.getElementById('add-tab') as HTMLDivElement;

    addTabElement.addEventListener('click', () => {
        const story = new App();
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
