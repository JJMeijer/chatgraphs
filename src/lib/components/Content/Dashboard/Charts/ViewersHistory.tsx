import { Line } from "react-chartjs-2";
import { ChartData, ChartOptions } from "chart.js";

import { UseDataStore } from "@types";
import { ChartWrapper } from "./ChartWrapper";

interface ViewersHistoryProps {
    useDataStore: UseDataStore;
}

const options: ChartOptions<"line"> = {
    elements: {
        line: {
            spanGaps: true,
        },
    },
    scales: {
        x: {
            type: "time",
            time: {
                unit: "minute",
                displayFormats: {
                    minute: "HH:mm",
                },
            },
        },
        y: {
            type: "linear",
            beginAtZero: true,
        },
    },
    plugins: {
        title: {
            text: "Viewers",
        },
    },
    spanGaps: false,
};

export const ViewersHistory = (props: ViewersHistoryProps): JSX.Element => {
    const { useDataStore } = props;

    const viewersHistory = useDataStore((state) => state.viewersHistory);

    const chartData: ChartData<"line"> = {
        datasets: [
            {
                data: viewersHistory,
                fill: true,
            },
        ],
    };

    return (
        <ChartWrapper>
            <Line options={options} data={chartData} />
        </ChartWrapper>
    );
};
