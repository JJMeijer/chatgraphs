import { setListeners } from './listeners';

if (document.readyState !== 'loading') {
    setListeners();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        setListeners();
    });
}
