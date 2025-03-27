<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import TaskListTable from "@/components/tables/TaskListTable.vue"
import { onBeforeMount, watch } from 'vue';
import { useApi } from '@/composables/useApi';
import Pagination from '@/components/Pagination.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];

const { getRequest, loading, error, data } = useApi();

const initTaskList = async () => {
    try {
        await getRequest(`/tasks?page=${route.query.page ?? 1}`, { withAuth: true });
    } catch (err) {
        console.log("failed to relative tasks: " + err)
    }
}

onBeforeMount(async () => {
    await initTaskList();
});

watch(route, async ()=>{
    await initTaskList();
})

</script>

<template>

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl py-4 px-8">
            <!-- table data -->
             <div v-if="!loading">
                 <task-list-table :data="data.data.data" />
                 <Pagination :links="data.data.links" />
             </div>
            <div v-else>
                Loading...
            </div>
        </div>
    </AppLayout>
</template>
