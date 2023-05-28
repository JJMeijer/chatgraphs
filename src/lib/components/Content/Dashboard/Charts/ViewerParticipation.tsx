import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";

import { ChartWrapper } from "./ChartWrapper";
import { ChartProps } from "@types";

const options: ChartOptions<"line"> = {
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
            min: 0,
            ticks: {
                stepSize: 0.02,
                callback: (value: string | number) => {
                    const numValue = typeof value === "string" ? parseInt(value) : value;
                    return (numValue * 100).toFixed(1) + "%";
                },
            },
        },
    },
    plugins: {
        title: {
            text: "Viewer Participation",
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

export const ViewerParticipation = (props: ChartProps): JSX.Element => {
    const { useDataStore } = props;

    const viewerParticipation = useDataStore((state) => state.viewerParticipation);

    const data: ChartData<"line"> = {
        datasets: [
            {
                data: viewerParticipation,
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
