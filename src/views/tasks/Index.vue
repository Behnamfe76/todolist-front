<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import TaskListTable from "@/components/tables/TaskListTable.vue"
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/composables/useApi';
import Pagination from '@/components/Pagination.vue';
import { Select } from '@/components/ui/select';
import { LoaderCircle } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import debounce from 'debounce';
const route = useRoute();
const router = useRouter();
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];
const taskSearch = ref();
const { getRequest, loading, error, data } = useApi();
const taskStatuses = reactive([
    { label: 'All', value: 'all' },
    { label: 'Todo', value: 'todo' },
    { label: 'On Progress', value: 'on_progress' },
    { label: 'Done', value: 'done' },
    { label: 'Expired', value: 'expired' },
]);

const taskIsCompleted = reactive([
    { label: 'All', value: 'all' },
    { label: 'Completed', value: 'completed' },
    { label: 'Not Completed', value: 'not_completed' },
]);
const selectOptions = reactive({
    status: taskStatuses[0],
    completed: taskIsCompleted[0],
});
const initTaskList = async (query: string = '', status: string = 'all', completed: string = 'all') => {
    try {
        await getRequest(`/tasks?page=${route.query.page ?? 1}&query=${query}&status=${status}&completed=${completed}`, { withAuth: true });

        if (query) {
            document.getElementById('search-input')?.focus();
        }
    } catch (err) {
        console.log("failed to relative tasks: " + err)
    }
}
const pushRouter = () => {
    router.push(`/tasks?page=${route.query.page ?? 1}&query=${taskSearch.value}&status=${selectOptions.status.value}&completed=${selectOptions.completed.value}`);
}
onBeforeMount(async () => {
    await initTaskList();
});

watch(route, async () => {
    await initTaskList(taskSearch.value, selectOptions.status.value, selectOptions.completed.value);
})

watch(taskSearch, debounce(() => {
    pushRouter()
}, 1000));

watch(selectOptions, debounce(() => {
    pushRouter()
}, 1000));

</script>

<template>

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl py-4 px-8">
            <!-- table data -->
            <div v-if="!loading">

                <!-- search/filter section -->
                <div class="text-gray-900 dark:text-gray-100 mb-2 mx-8">
                    <div class="flex items-end justify-between gap-4">

                        <div class="flex flex-col gap-4 w-full">
                            <Label for="search-input">Search</Label>
                            <Input ref="taskSearchInput" class="h-[36px]"
                                placeholder="looking for a task's title or description?" id="search-input"
                                v-model="taskSearch" />

                        </div>

                        <div class="flex flex-col gap-4 w-full">
                            <Label for="statuses">Status</Label>
                            <Select :options="taskStatuses" v-model="selectOptions.status"
                                placeholder="select a type..." />
                        </div>

                        <div class="flex flex-col gap-4 w-full">
                            <Label for="statuses">Completed</Label>
                            <Select :options="taskIsCompleted" v-model="selectOptions.completed"
                                placeholder="select a type..." />
                        </div>


                        <div class="">
                            <Button @click="router.push('/tasks/create')" class="mt-4" :tabindex="4">
                                Create
                            </Button>
                        </div>
                    </div>
                </div>

                <div v-if="data.data.data.length">
                    <task-list-table :data="data.data.data" />
                    <Pagination :links="data.data.links" />
                </div>
                <div v-else class="flex justify-center">
                    No Records found, <button class="hover:underline px-2" @click="router.push('/tasks/create')">Create
                        One</button>
                </div>
            </div>
            <div v-else>
                Loading...
            </div>
        </div>
    </AppLayout>
</template>
