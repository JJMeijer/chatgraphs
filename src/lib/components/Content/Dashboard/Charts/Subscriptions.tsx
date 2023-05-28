import { Bar } from "react-chartjs-2";

import { ChartProps } from "@types";
import { ChartWrapper } from "./ChartWrapper";
import { ChartOptions } from "chart.js";

const options: ChartOptions<"bar"> = {
    scales: {
        x: {
            type: "timeseries",
            time: {
                unit: "minute",
                tooltipFormat: "HH:mm",
                displayFormats: {
                    second: "HH:mm",
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
    // layout: {
    //     padding: {
    //         top: 20,
    //     },
    // },
};

export const Subscriptions = (props: ChartProps): JSX.Element => {
    const { useDataStore } = props;

    const subscriptions = useDataStore((state) => state.subscriptions);
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
