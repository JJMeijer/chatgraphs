import { Bar } from "react-chartjs-2";

import { ChartProps } from "@types";
import { ChartWrapper } from "./ChartWrapper";
import { ChartOptions } from "chart.js";

const options: ChartOptions<"bar"> = {
    scales: {
        x: {
            type: "time",
            time: {
                unit: "minute",
                tooltipFormat: "HH:mm",
                displayFormats: {
                    minute: "HH:mm",
                },
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
            text: "Subscription notices",
        },
        legend: {
            labels: {
                padding: 20,
            },
            display: true,
            position: "bottom",
        },
    },
};

export const Subscriptions = (props: ChartProps): JSX.Element => {
    const { useDataStore } = props;

    const subscriptions = useDataStore((state) => state.subscriptions);
    const primeSubscriptions = useDataStore((state) => state.primeSubscriptions);
    const giftedSubscriptions = useDataStore((state) => state.giftedSubscriptions);

    const data = {
        labels: subscriptions.map((s) => s.x),
        datasets: [
            {
                label: "Subscriptions",
                data: subscriptions.map((s) => s.y),
                backgroundColor: "rgba(153, 102, 255, 0.8)",
            },
            {
                label: "Prime Subscriptions",
                data: primeSubscriptions.map((s) => s.y),
                backgroundColor: "rgba(255, 99, 132, 0.8)",
            },
            {
                label: "Gifted Subscriptions",
                data: giftedSubscriptions.map((s) => s.y),
                backgroundColor: "rgba(29, 138, 34, 0.8)",
            },
        ],
    };

    return (
        <ChartWrapper>
            <Bar options={options} data={data} updateMode="none" />
        </ChartWrapper>
    );
};
