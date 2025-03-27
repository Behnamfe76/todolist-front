<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import TaskListTable from "@/components/tables/TaskListTable.vue"
import { onBeforeMount, ref, watch } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/composables/useApi';
import Pagination from '@/components/Pagination.vue';
import { LoaderCircle } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import debounce from 'debounce';
const route = useRoute();
const router = useRouter();
const taskSearchInput = ref();
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];
const taskSearch = ref();
const { getRequest, loading, error, data } = useApi();

const initTaskList = async (query: string = '') => {
    try {
        await getRequest(`/tasks?page=${route.query.page ?? 1}&query=${query}`, { withAuth: true });
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

watch(taskSearch, debounce(async (value) => {
    await initTaskList(value);

    document.getElementById('search-input')?.focus();
}, 1000));

</script>

<template>

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl py-4 px-8">
            <!-- table data -->
            <div v-if="!loading">

                <!-- search/filter section -->
                <div class="text-gray-900 dark:text-gray-100 mb-2 mx-8">
                    <div class="flex items-center justify-between">

                        <div class="flex flex-col gap-4 w-2/3">
                            <Label for="search-input">search</Label>
                            <Input ref="taskSearchInput" placeholder="looking for a task's title or description?"
                                id="search-input" v-model="taskSearch" />
                            <div class="flex gap-4 items-center">
                                <span class="flex items-center gap-2" v-if="loading">
                                    Loading ...
                                    <LoaderCircle v-if="loading" class="h-4 w-4 animate-spin" />

                                </span>
                            </div>
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
