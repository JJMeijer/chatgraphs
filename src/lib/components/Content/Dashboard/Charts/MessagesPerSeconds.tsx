import { Bar } from "react-chartjs-2";
import { ChartOptions, ChartData } from "chart.js";

import { UseDataStore } from "@types";
import { ChartWrapper } from "./ChartWrapper";

interface MessagesPerSecondsProps {
    useDataStore: UseDataStore;
}

const options: ChartOptions<"bar"> = {
    scales: {
        x: {
            type: "timeseries",
            time: {
                unit: "second",
                tooltipFormat: "HH:mm:ss",
                displayFormats: {
                    second: "HH:mm:ss",
                },
            },
            ticks: {
                stepSize: 30,
                source: "data",
            },
        },
        y: {
            type: "linear",
            min: 0,
            beginAtZero: true,
            ticks: {
                stepSize: 1,
            },
        },
    },
    interaction: {
        intersect: true,
    },
    plugins: {
        title: {
            text: "Messages per Second",
        },
    },
};

export const MessagesPerSeconds = (props: MessagesPerSecondsProps): JSX.Element => {
    const { useDataStore } = props;

    const messagesPerSecond = useDataStore((state) => state.messagesPerSecond);

    const chartData: ChartData<"bar"> = {
        labels: messagesPerSecond.map((m) => m.x),
        datasets: [
            {
                data: messagesPerSecond.map((m) => m.y),
            },
        ],
    };
    return (
        <ChartWrapper>
            <Bar options={options} updateMode="none" data={chartData} />
        </ChartWrapper>
    );
};
