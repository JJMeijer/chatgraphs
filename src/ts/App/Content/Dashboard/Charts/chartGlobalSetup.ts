import {
    Chart,
    TimeScale,
    BarController,
    LineController,
    PointElement,
    LineElement,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Filler,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
Chart.register(
    TimeScale,
    BarController,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Filler,
);

Chart.defaults.color = '#9CA3AF';
Chart.defaults.backgroundColor = '#9CA3AF';
Chart.defaults.elements.line.borderColor = '#9CA3AF';
Chart.defaults.elements.line.borderWidth = 2;
Chart.defaults.elements.line.tension = 0.5;
