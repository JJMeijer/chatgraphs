import { Content } from './Content';
import { Tab } from './Tab';

export class Story {
    tab: Tab;
    content: Content;

    constructor() {
        this.tab = new Tab();
        this.content = new Content();

        this.setListeners();
    }

    render() {
        this.tab.render();
        this.content.render();
    }

    setListeners() {
        this.tab.onClick(() => {
            this.tab.element.setAttribute('checked', 'checked');
            this.content.show();
        });

        this.tab.onClose(() => {
            this.tab.delete();
            this.content.delete();
        });

        this.content.onSubmit((value) => {
            this.tab.setTabTitle(value);
        });
    }
}
