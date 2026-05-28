<script setup lang="ts">
import { useAssessmentStore } from '~/stores/assessment'

withDefaults(defineProps<{ label?: string }>(), {
  label: '清除目前答題狀態',
})

const store = useAssessmentStore()

const clear = () => {
  if (!import.meta.client) { return }
  const ok = window.confirm('確定要清除目前所有答題狀態嗎？此動作無法復原。')
  if (ok) { store.reset() }
}
</script>

<template>
  <button
    v-if="store.answeredCount > 0"
    type="button"
    class="btn-ghost border-red-200 text-red-600 hover:bg-red-50"
    @click="clear"
  >
    {{ label }}
  </button>
</template>
