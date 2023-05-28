import { ChartWrapper } from "./ChartWrapper";
import { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

import { UseDataStore } from "@types";

interface MessagesPerMinuteProps {
    useDataStore: UseDataStore;
}

const options: ChartOptions<"bar"> = {
    scales: {
        x: {
            type: "timeseries",
            time: {
                unit: "minute",
                displayFormats: {
                    minute: "HH:mm",
                },
                tooltipFormat: "HH:mm",
            },
        },
        y: {
            type: "linear",
            min: 0,
            beginAtZero: true,
        },
    },
    interaction: {
        intersect: true,
    },
    plugins: {
        title: {
            text: "Messages per Minute",
        },
    },
};

export const MessagesPerMinute = (props: MessagesPerMinuteProps): JSX.Element => {
    const { useDataStore } = props;

    const messagesPerMinute = useDataStore((state) => state.messagesPerMinute);

    const data: ChartData<"bar"> = {
        labels: messagesPerMinute.map((m) => m.x),
        datasets: [
            {
                data: messagesPerMinute.map((m) => m.y),
            },
        ],
    };

    return (
        <ChartWrapper>
            <Bar options={options} data={data} />
        </ChartWrapper>
    );
};
