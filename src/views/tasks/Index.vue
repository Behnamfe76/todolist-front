<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import TaskListTable from "@/components/tables/TaskListTable.vue"
import { onBeforeMount, ref, watch } from 'vue';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/composables/useApi';
import Pagination from '@/components/Pagination.vue';
import { LoaderCircle } from 'lucide-vue-next';
import { useRoute } from 'vue-router';
import debounce from 'debounce';
const route = useRoute();
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];
const taskSearch = ref();
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

watch(route, async () => {
    await initTaskList();
})

watch(taskSearch, debounce((value) => {
    console.log(value)

}, 1000));

</script>

<template>

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl py-4 px-8">
            <!-- table data -->
            <div v-if="!loading">

                <!-- search/filter section -->
                <div class="py-4 text-gray-900 dark:text-gray-100">
                    <div class="mx-8 mt-4 flex flex-col gap-4">
                        <Label for="search-input">search</Label>
                        <Input placeholder="looking for a task's title or description?" id="search-input"
                            v-model="taskSearch" />
                        <div class="flex gap-4 items-center">
                            <span class="flex items-center gap-2" v-if="loading">
                                Loading ...
                                <LoaderCircle v-if="loading" class="h-4 w-4 animate-spin" />

                            </span>
                        </div>
                    </div>
                </div>

                <task-list-table :data="data.data.data" />
                <Pagination :links="data.data.links" />
            </div>
            <div v-else>
                Loading...
            </div>
        </div>
    </AppLayout>
</template>
