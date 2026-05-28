<script setup lang="ts">
const props = defineProps<{ value: number; label?: string }>();
const pct = computed(() => Math.round(props.value * 100));
</script>

<template>
  <div>
    <div v-if="label" class="mb-1 flex justify-between text-xs text-stone-500">
      <span>{{ label }}</span>
      <span class="font-semibold text-brand-600">{{ pct }}%</span>
    </div>
    <div class="h-2 w-full overflow-hidden rounded-full bg-stone-200">
      <div class="h-full rounded-full bg-brand-500 transition-all duration-300" :style="{ width: pct + '%' }" />
    </div>
  </div>
</template>
