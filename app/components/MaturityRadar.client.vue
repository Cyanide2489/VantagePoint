<script setup lang="ts">
import { Radar } from "vue-chartjs";
import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend,
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const props = withDefaults(
  defineProps<{ labels: string[]; scores: number[]; dense?: boolean }>(),
  { dense: false }
);

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [
    {
      label: "成熟度",
      data: props.scores,
      backgroundColor: "rgba(255, 212, 184, 0.32)",
      borderColor: "rgba(201, 114, 53, 0.75)",
      pointBackgroundColor: "rgba(201, 114, 53, 0.9)",
      borderWidth: 2,
      pointRadius: props.dense ? 2 : 4,
    },
  ],
}));

const options = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    r: {
      min: 0,
      max: 5,
      ticks: { stepSize: 1, backdropColor: "transparent", color: "#a8a29e" },
      grid: { color: "#e7e1d8" },
      angleLines: { color: "#e7e1d8" },
      pointLabels: {
        font: { size: props.dense ? 11 : 13, weight: 600 as const },
        color: "#44403c",
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => `${ctx.label}：${Number(ctx.parsed.r).toFixed(1)} / 5`,
      },
    },
  },
}));
</script>

<template>
  <div :class="dense ? 'h-96 sm:h-[30rem]' : 'h-72 sm:h-96'">
    <Radar :data="chartData" :options="options" />
  </div>
</template>
