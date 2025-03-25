<script setup lang="ts">
import { cn } from '@/lib/utils';
import { useVModel } from '@vueuse/core';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
    defaultValue?: Date;
    modelValue?: Date;
    class?: HTMLAttributes['class'];
}>();

const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void;
}>();

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
});
</script>

<template>
    <VueDatePicker v-model="modelValue" :class="cn(
        'px-[2px]',
        props.class,
    )
        " />
</template>

<style>
.dp__pointer {
    padding-top: 7px !important;
    padding-bottom: 7px !important;
}
</style>
