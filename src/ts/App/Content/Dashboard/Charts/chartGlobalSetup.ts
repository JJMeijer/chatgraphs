import {
    Chart,
    TimeScale,
    BarController,
    LineController,
    DoughnutController,
    PointElement,
    LineElement,
    ArcElement,
    LinearScale,
    CategoryScale,
    BarElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
Chart.register(
    TimeScale,
    BarController,
    LineController,
    DoughnutController,
    LineElement,
    ArcElement,
    PointElement,
    LinearScale,
    CategoryScale,
    BarElement,
    Title,
    Tooltip,
    Filler,
    Legend,
);

Chart.defaults.color = '#9CA3AF';
Chart.defaults.backgroundColor = '#9CA3AF';
Chart.defaults.elements.line.borderColor = '#9CA3AF';
Chart.defaults.elements.line.borderWidth = 2;
Chart.defaults.elements.line.tension = 0.6;
Chart.defaults.responsive = true;
Chart.defaults.maintainAspectRatio = false;
