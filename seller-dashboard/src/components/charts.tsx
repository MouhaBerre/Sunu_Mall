import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

interface SeriesChartProps {
  labels: string[];
  data: number[];
  label: string;
}

export function LineChart({ labels, data, label }: SeriesChartProps) {
  return (
    <Line
      data={{ labels, datasets: [{ label, data, borderColor: "#4f46e5", backgroundColor: "#4f46e5" }] }}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  );
}

export function BarChart({ labels, data, label }: SeriesChartProps) {
  return (
    <Bar
      data={{ labels, datasets: [{ label, data, backgroundColor: "#4f46e5" }] }}
      options={{ responsive: true, plugins: { legend: { display: false } } }}
    />
  );
}
