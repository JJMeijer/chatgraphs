import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    TimeSeriesScale,
    LineElement,
    PointElement,
    Filler,
    Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    TimeSeriesScale,
    LineElement,
    PointElement,
    Filler,
    Legend,
);

ChartJS.defaults.plugins.title.display = true;
ChartJS.defaults.plugins.title.font = {
    size: 16,
    weight: "normal",
};
ChartJS.defaults.plugins.title.color = "#8d8d91";
ChartJS.defaults.plugins.title.fullSize = true;
ChartJS.defaults.plugins.title.position = "top";
ChartJS.defaults.plugins.title.align = "center";
ChartJS.defaults.plugins.title.padding = { bottom: 20, top: 10 };

ChartJS.defaults.plugins.legend.display = false;

ChartJS.defaults.interaction.intersect = true;
ChartJS.defaults.interaction.mode = "index";

ChartJS.defaults.backgroundColor = "#9146ff";

ChartJS.defaults.maintainAspectRatio = false;

ChartJS.defaults.elements.line.borderColor = "#a76bff";
ChartJS.defaults.elements.line.tension = 0.2;
ChartJS.defaults.elements.line.backgroundColor = "#9146ff33";
ChartJS.defaults.elements.point.backgroundColor = "#9146ff";
ChartJS.defaults.elements.point.pointStyle = "circle";
