<script setup>
import { Button } from '@/components/ui/button';
import moment from 'moment';
import { ExternalLink, CircleCheck, CircleX } from "lucide-vue-next"
import { ref, computed, onBeforeMount, reactive } from 'vue'
import { useRouter } from 'vue-router';
const props = defineProps({
    data: { required: true, type: Object }
});
const router = useRouter();

const tableHead = [
    {
        label: 'Title',
        name: 'title'
    },
    {
        label: 'Description',
        name: 'description'
    },
    {
        label: 'Closed',
        name: 'closed'
    },
    {
        label: 'Status',
        name: 'status'
    },
    {
        label: 'Progress',
        name: 'progress'
    },
    {
        label: 'Due Date',
        name: 'due_date'
    }
];
const statuses = {
    done: 'text-teal-400 bg-teal-400/10',
    todo: 'text-rose-400 bg-rose-400/10',
    on_progress: 'text-blue-400 bg-blue-400/10',
    expired: 'text-orange-400 bg-orange-400/10',
}

const tableBody = reactive([])

const tuneStatus = (status) => {
    return {
        label: status
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' '),
        name: status
    };
}

onBeforeMount(() => {
    props.data.forEach(item => {
        tableBody.push({
            uuid: item.uuid,
            title: item.title,
            description: item.description,
            closed: item.is_completed,
            status: tuneStatus(item.status),
            progress: item.sub_tasks ? (item.completed_sub_tasks / item.sub_tasks) * 100 : item.is_completed * 100,
            due_date: moment(item.due_date).format('YYYY-MM-DD'),
        });
    })
});

const selectedTask = ref([])
const indeterminate = computed(() => selectedTask.value.length > 0 && selectedTask.value.length < tableBody.length)
</script>

<template>
    <div class="px-4 sm:px-6 lg:px-8">
        <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
                <h1 class="text-base font-semibold text-gray-900">Tasks</h1>
                <p class="mt-2 text-sm text-gray-700">A list of all the tasks in your account.</p>
            </div>
            <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <Button @click="router.push('/tasks/create')" class="mt-4" :tabindex="4">
                    Create
                </Button>
            </div>
        </div>
        <div class="mt-8 flow-root">
            <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                    <div class="relative">
                        <div v-if="selectedTask.length > 0"
                            class="absolute left-14 top-0 flex h-12 items-center space-x-3 bg-white sm:left-12">
                            <button type="button"
                                class="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">Bulk
                                edit</button>
                            <button type="button"
                                class="inline-flex items-center rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-white">Delete
                                all</button>
                        </div>
                        <table class="min-w-full table-fixed divide-y divide-gray-300">
                            <thead>
                                <tr>
                                    <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
                                        <div class="group absolute left-4 top-1/2 -mt-2 grid size-4 grid-cols-1">
                                            <input type="checkbox"
                                                class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                :checked="indeterminate || selectedTask.length === tableBody.length"
                                                :indeterminate="indeterminate"
                                                @change="selectedTask = $event.target.checked ? tableBody.map((t) => t.uuid) : []" />
                                            <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                                viewBox="0 0 14 14" fill="none">
                                                <path class="opacity-0 group-has-[:checked]:opacity-100"
                                                    d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                                <path class="opacity-0 group-has-[:indeterminate]:opacity-100"
                                                    d="M3 7H11" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                    </th>
                                    <th v-for="item in tableHead" :key="item" scope="col"
                                        class="min-w-[5rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900"
                                        :class="[
                                            item.name === 'progress' && 'min-w-[10rem]',
                                        ]"

                                        >
                                        {{ item.label }}
                                    </th>

                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 bg-white">
                                <tr v-for="item in tableBody" :key="item.uuid"
                                    :class="[selectedTask.includes(item.uuid) && 'bg-gray-50']">
                                    <td class="relative px-7 sm:w-12 sm:px-6">
                                        <div v-if="selectedTask.includes(item.uuid)"
                                            class="absolute inset-y-0 left-0 w-0.5 bg-indigo-600"></div>
                                        <div class="group absolute left-4 top-1/2 -mt-2 grid size-4 grid-cols-1">
                                            <input type="checkbox"
                                                class="col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                                                :value="item.uuid" v-model="selectedTask" />
                                            <svg class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
                                                viewBox="0 0 14 14" fill="none">
                                                <path class="opacity-0 group-has-[:checked]:opacity-100"
                                                    d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                                <path class="opacity-0 group-has-[:indeterminate]:opacity-100"
                                                    d="M3 7H11" stroke-width="2" stroke-linecap="round"
                                                    stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                    </td>
                                    <td v-for="(thead, index) in tableHead" :key="thead + '-' + index"
                                        :class="['whitespace-nowrap py-4 pr-3 text-sm font-medium', selectedTask.includes(item.email) ? 'text-indigo-600' : 'text-gray-900']">
                                        <div class="flex gap-2 items-center w-full">
                                            <div class="flex gap-2 items-center justify-center"
                                                :class="thead.name == 'progress' ? ' w-full ' : ''">
                                                <!-- a blooming sign for the first td -->
                                                <div v-if="index == 0"
                                                    :class="[statuses[item.status.name], 'flex-none rounded-full p-1']">
                                                    <div class="size-1.5 rounded-full bg-current" />
                                                </div>

                                                <!-- showing the tasks's status if they are closed or not with icons -->
                                                <div v-if="thead.name == 'closed'">
                                                    <CircleCheck class="h-4 w-4 text-teal-500 cursor-pointer"
                                                        v-if="item[thead.name]" />
                                                    <CircleX class="h-4 w-4 text-rose-500 cursor-pointer" v-else />
                                                </div>

                                                <!-- showing the tasks's due_date -->
                                                <div v-else-if="thead.name == 'due_date'">
                                                    {{ moment(item[thead.name]).calendar() }}
                                                </div>

                                                <!-- showing the tasks's progress -->
                                                <div class="flex gap-2 w-full items-center"
                                                    v-else-if="thead.name == 'progress'">
                                                    <div class="text-xs">{{ item[thead.name] }}%</div>
                                                    <div class="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                                        <div class="bg-blue-600 h-2.5 rounded-full"
                                                            :style="{ width: `${item[thead.name]}%` }">
                                                        </div>
                                                    </div>
                                                </div>

                                                <!-- giving a badge style to statuses -->
                                                <div v-else
                                                    :class="[
                                                        thead.name == 'status' ? statuses[item.status.name] + ' px-2 py-[1px] rounded ' : '',
                                                        thead.name == 'description' ? ' w-[10rem] truncate ' : '',
                                                        thead.name == 'title' ? ' w-[15rem] truncate ' : '',
                                                    ]"

                                                    >
                                                    {{ item[thead.name]?.label ?? item[thead.name] }}
                                                </div>

                                            </div>

                                            <!-- external link to the first task -->
                                            <RouterLink :to="`/tasks/${item.uuid}`">
                                                <ExternalLink class="h-4 w-4 text-gray-500 cursor-pointer"
                                                    v-if="index == 0" />
                                            </RouterLink>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
