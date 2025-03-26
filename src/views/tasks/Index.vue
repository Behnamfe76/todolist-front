<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import TaskListTable from "@/components/tables/TaskListTable.vue"
import { onBeforeMount } from 'vue';
import { useApi } from '@/composables/useApi';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

const { getRequest, loading, error, data } = useApi();

const initTaskList = async () => {
    try {
        await getRequest('/tasks', { withAuth: true });
    } catch (err) {
        console.log("failed to relative tasks: " + err)
    }
}

onBeforeMount(async () => {
    await initTaskList();
});

</script>

<template>

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl py-4 px-8">
            <!-- table data -->
            <task-list-table v-if="!loading" :data="data.data.data" />
            <div v-else>
                Loading...
            </div>
        </div>
    </AppLayout>
</template>
