import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import Streamer from "../interfaces/Streamer";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
const Graph = ({ data }: any) => {
    const [graphData, setGraphData] = useState({ labels: [], datasets: [] });
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: "",
            },
        },
    };
    useEffect(() => {
        console.log("DATA: ", data);
    });
    useEffect(() => {
        console.log("DATA: ", data);
        const points:any = [];
        const datasets: any = [];
        const labels = data.map((streamer: any) => {
            points.push(Math.floor(streamer.totalPoints));
            return streamer.username;
        });
        datasets.push({
            label: 'Points',
            data: points,
            backgroundColor: "red",
        });
        setGraphData({
            labels,
            datasets,
        });
    }, [data]);

    return <Bar options={options} data={graphData} />;
};

export default Graph;
