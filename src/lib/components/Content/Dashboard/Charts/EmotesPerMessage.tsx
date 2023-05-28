import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";

import { ChartWrapper } from "./ChartWrapper";
import { ChartProps } from "@types";

const options: ChartOptions<"line"> = {
    scales: {
        x: {
            type: "time",
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
            min: 0,
            max: 1,
            ticks: {
                stepSize: 0.2,
                callback: (value: string | number) => {
                    const numValue = typeof value === "string" ? parseInt(value) : value;
                    return (numValue * 100).toFixed(0) + "%";
                },
            },
        },
    },
    plugins: {
        title: {
            text: "Emotes % per message",
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    const numValue = typeof context.parsed.y === "string" ? parseFloat(context.parsed.y) : context.parsed.y;
                    return (numValue * 100).toFixed(1) + "%";
                },
            },
        },
    },
};

export const EmotesPerMessage = (props: ChartProps): JSX.Element => {
    const { useDataStore } = props;

    const emotesPerMessage = useDataStore((state) => state.emotesPerMessage);

    const data: ChartData<"line"> = {
        datasets: [
            {
                data: emotesPerMessage,
                fill: true,
            },
        ],
    };

    return (
        <ChartWrapper>
            <Line options={options} data={data} updateMode="none" />
        </ChartWrapper>
    );
};
