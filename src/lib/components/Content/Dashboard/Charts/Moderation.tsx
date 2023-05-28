import { ChartData, ChartOptions } from "chart.js";
import { Bar } from "react-chartjs-2";

import { ChartProps } from "@types";
import { ChartWrapper } from "./ChartWrapper";

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
            text: "Moderation",
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

export const Moderation = (props: ChartProps): JSX.Element => {
    const { useDataStore } = props;

    const bans = useDataStore((state) => state.bans);
    const timeouts = useDataStore((state) => state.timeouts);
    const msgRemovals = useDataStore((state) => state.msgRemovals);

    const data: ChartData<"bar"> = {
        labels: bans.map((b) => b.x),
        datasets: [
            {
                label: "Bans",
                data: bans.map((b) => b.y),
                backgroundColor: "rgba(255, 99, 132, 0.8)",
            },
            {
                label: "Timeouts",
                data: timeouts.map((t) => t.y),
                backgroundColor: "rgba(255, 159, 64, 0.8)",
            },
            {
                label: "Msg removals",
                data: msgRemovals.map((m) => m.y),
                backgroundColor: "rgba(255, 205, 86, 0.8)",
            },
        ],
    };

    return (
        <ChartWrapper>
            <Bar data={data} options={options} updateMode="none" />
        </ChartWrapper>
    );
};
