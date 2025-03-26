<script setup lang="ts">
import { useApi } from '@/composables/useApi';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { onBeforeMount, reactive, ref } from 'vue';
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router';
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRoot,
    DropdownMenuTrigger,
} from 'radix-vue'


const { getRequest, patchRequest, loading, error, data } = useApi();
const route = useRoute()
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Show',
        href: '/tasks/show',
    },
];
const toggleState = ref(false)
const uuid = route.params.uuid;
const taskTypes = reactive([
    { label: 'Internal', value: 'internal' },
    { label: 'External', value: 'external' },
]);


const initializePageData = async () => {
    try {
        await getRequest(`/tasks/${uuid}`, { withAuth: true });

    } catch (err) {
        console.log('failed to fetch task data: ' + err)
    }
}
const handleTaskType = async (type: string) => {
    try {
        await patchRequest(`/tasks/${uuid}/update-type`, { type }, { withAuth: true });
    } catch (err) {
        console.log('failed to fetch task data: ' + err)
    }
}


onBeforeMount(async () => {
    await initializePageData();
});


</script>

<template>

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl py-4 px-8">
            <div v-if="!loading">

                <div
                    class="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm  dark:bg-gray-800 dark:border-gray-700 ">
                    <!-- task title and description -->
                    <div class="border-b pb-4 mb-4">
                        <p class="text-lg font-bold text-slate-800 dark:text-slate-100">{{ data.data.title }}</p>
                        <p class="text-slate-600 dark:text-slate-300">{{ data.data.description }}</p>
                    </div>

                    <div class="flex divide-x-2 divide-gray-400 rounded">
                        <span class="pe-6 flex flex-col gap-3">
                            <DropdownMenuRoot v-model:open="toggleState">
                                <DropdownMenuTrigger class="flex items-center gap-2">
                                    <span>Type</span>
                                    <Icon icon="radix-icons:chevron-down" />
                                </DropdownMenuTrigger>

                                <DropdownMenuPortal>
                                    <DropdownMenuContent
                                        class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                        :side-offset="5">

                                        <DropdownMenuItem v-for="type in taskTypes" :key="type.label"
                                            :value="type.label"
                                            class="group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center justify-between h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 hover:text-white hover:bg-black"
                                            @click="handleTaskType(type.value)">
                                            <span>
                                                {{ type.label }}
                                            </span>
                                            <Icon v-if="type.value == data.data.type" icon="radix-icons:check" />
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenuPortal>
                            </DropdownMenuRoot>
                            <span
                                class="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-purple-900 dark:text-purple-300">
                                {{ data.data.type }}
                            </span>
                        </span>
                        <span class="px-6">
                            {{ data.data.status }}
                        </span>
                        <span class="px-6">
                            {{ data.data.priority }}
                        </span>
                    </div>
                </div>


                <div>
                    sub tasks
                </div>
            </div>
            <div v-else>loading...</div>
        </div>
    </AppLayout>
</template>
