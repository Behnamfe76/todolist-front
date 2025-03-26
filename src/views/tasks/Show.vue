<script setup lang="ts">
import { useApi } from '@/composables/useApi';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Datepicker } from '@/components/ui/Datepicker';
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { Icon } from '@iconify/vue'
import { CircleCheck, CircleX, Pen, LoaderCircle } from "lucide-vue-next"
import { useRoute } from 'vue-router';
import moment from 'moment';
import { statusClassAttributes, priorityClassAttributes } from '@/helpers/helper';
import {
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuRoot,
    DropdownMenuTrigger,
} from 'radix-vue'
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';


const editMode = ref(false)
const { getRequest, patchRequest, loading, error: apiErrors, data } = useApi();
const route = useRoute();
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Show',
        href: '/tasks/show',
    },
];
const toggleStates = reactive({
    type: false,
    status: false,
    priority: false,
})
const uuid = route.params.uuid;
const taskTypes = reactive([
    { label: 'Internal', value: 'internal' },
    { label: 'External', value: 'external' },
]);
const taskStatuses = reactive([
    { label: 'Todo', value: 'todo' },
    { label: 'On Progress', value: 'on_progress' },
    { label: 'Done', value: 'done' },
    { label: 'Expired', value: 'expired' },
]);
const taskPriorities = reactive([
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' },
    { label: 'Urgent', value: 'urgent' },
]);

// Define the validation schema
const schema = toTypedSchema(
    yup.object({
        title: yup.string().required('Title is required'),
        date: yup.date().required('Date is required'),
        description: yup.string().nullable(),
    })
);

// Initialize useForm with the schema
const { errors, handleSubmit, defineField } = useForm({
    validationSchema: schema,
});
const [title, titleAttrs] = defineField('title');
const [description, descriptionAttrs] = defineField('description');
const [date, dateAttrs] = defineField('date');


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
const handleTaskStatus = async (status: string) => {
    try {
        await patchRequest(`/tasks/${uuid}/update-status`, { status }, { withAuth: true });
    } catch (err) {
        console.log('failed to fetch task data: ' + err)
    }
}
const handleTaskPriority = async (priority: string) => {
    try {
        await patchRequest(`/tasks/${uuid}/update-priority`, { priority }, { withAuth: true });
    } catch (err) {
        console.log('failed to fetch task data: ' + err)
    }
}
const submit = handleSubmit(async (values) => {
    try {
        const payload = {
            title: values.title,
            description: values.description,
            date: moment(date.value).format('YYYY-MM-DD HH:mm:ss'),

        };
        await patchRequest(`/tasks/${uuid}/update-info`, payload, { withAuth: true });
        editMode.value = false;
    } catch (error) {
        console.error('Submission failed:', error);
    }
});


onBeforeMount(async () => {
    await initializePageData();
});

watch(editMode, (value) => {
    if (value) {
        title.value = data.value?.data.title;
        description.value = data.value?.data.description;
        date.value = new Date(data.value?.data.due_date);
    }
})
</script>

<template>

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl py-4 px-8">
            <div v-if="!loading">

                <div
                    class="block p-6 bg-white border border-gray-200 rounded-lg shadow-sm  dark:bg-gray-800 dark:border-gray-700 ">
                    <!-- task title and description -->
                    <div v-if="!editMode" class="border-b pb-4 mb-4">
                        <p class="text-lg font-bold text-slate-800 dark:text-slate-100">{{ data.data.title }}</p>
                        <p class="text-slate-600 dark:text-slate-300">{{ data.data.description }}</p>
                    </div>
                    <div v-else class="border-b pb-4 mb-4 mt-10 space-y-4 sm:pb-0">
                        <form @submit="submit" class="space-y-4 mb-4">

                            <div class="grid gap-2 grid-cols-2 items-start">
                                <div class="grid gap-2">
                                    <Label for="title">Title</Label>
                                    <Input id="title" v-model="title" v-bind="titleAttrs" placeholder="title" />
                                    <InputError :message="apiErrors?.errors?.title?.join('') ?? errors.title" />
                                </div>
                                <div class="grid gap-2">
                                    <Label for="date">Date</Label>
                                    <Datepicker id="date" v-model="date" v-bind="dateAttrs" />
                                    <InputError :message="apiErrors?.errors?.date?.join('') ?? errors.date" />

                                </div>
                            </div>

                            <div class="grid gap-2">
                                <Label for="description">Description</Label>
                                <Textarea id="description" v-model="description" v-bind="descriptionAttrs"
                                    placeholder="description" />
                                <InputError :message="apiErrors?.errors?.description?.join('') ?? errors.description" />

                            </div>

                            <div class="mt-6 flex items-center justify-end gap-x-6">

                                <Button type="submit" :disabled="loading">
                                    <LoaderCircle v-if="loading" class="h-4 w-4 animate-spin" />
                                    Save
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div class="flex items-start justify-between">
                        <div class="flex divide-x-2 divide-gray-400 rounded">

                            <!-- task type -->
                            <span class="pe-6 flex flex-col gap-3">
                                <DropdownMenuRoot v-model:open="toggleStates.type">
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
                                    {{taskTypes.filter((t) => t.value === data.data.type)[0].label}}
                                </span>
                            </span>

                            <!-- task status -->
                            <span class="px-6 flex flex-col gap-3">
                                <DropdownMenuRoot v-model:open="toggleStates.status">
                                    <DropdownMenuTrigger class="flex items-center gap-2">
                                        <span>Status</span>
                                        <Icon icon="radix-icons:chevron-down" />
                                    </DropdownMenuTrigger>

                                    <DropdownMenuPortal>
                                        <DropdownMenuContent
                                            class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                            :side-offset="5">

                                            <DropdownMenuItem v-for="status in taskStatuses" :key="status.label"
                                                :value="status.label"
                                                class="group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center justify-between h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 hover:text-white hover:bg-black"
                                                @click="handleTaskStatus(status.value)">
                                                <span>
                                                    {{ status.label }}
                                                </span>
                                                <Icon v-if="status.value == data.data.status"
                                                    icon="radix-icons:check" />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuRoot>
                                <span :class="[statusClassAttributes[data.data.status]]"
                                    class="flex justify-center text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
                                    {{taskStatuses.filter((s) => s.value === data.data.status)[0].label}}
                                </span>
                            </span>

                            <!-- task priority -->
                            <span class="px-6 flex flex-col gap-3">
                                <DropdownMenuRoot v-model:open="toggleStates.priority">
                                    <DropdownMenuTrigger class="flex items-center gap-2">
                                        <span>Priority</span>
                                        <Icon icon="radix-icons:chevron-down" />
                                    </DropdownMenuTrigger>

                                    <DropdownMenuPortal>
                                        <DropdownMenuContent
                                            class="min-w-[220px] outline-none bg-white rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
                                            :side-offset="5">

                                            <DropdownMenuItem v-for="priority in taskPriorities" :key="priority.label"
                                                :value="priority.label"
                                                class="group text-[13px] leading-none text-grass11 rounded-[3px] flex items-center justify-between h-[25px] px-[5px] relative pl-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-green9 data-[highlighted]:text-green1 hover:text-white hover:bg-black"
                                                @click="handleTaskPriority(priority.value)">
                                                <span>
                                                    {{ priority.label }}
                                                </span>
                                                <Icon v-if="priority.value == data.data.priority"
                                                    icon="radix-icons:check" />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenuPortal>
                                </DropdownMenuRoot>
                                <span :class="[priorityClassAttributes[data.data.priority]]"
                                    class="flex justify-center text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm">
                                    {{taskPriorities.filter((p) => p.value === data.data.priority)[0].label}}
                                </span>
                            </span>

                            <!-- task situation ==> close or open -->
                            <span class="px-6 flex flex-col gap-3">
                                <span>Completed</span>
                                <span class="flex justify-center">
                                    <CircleCheck class="h-4 w-4 text-teal-500" v-if="data.data.is_completed" />
                                    <CircleX class="h-4 w-4 text-rose-500" v-else />
                                </span>
                            </span>

                            <!-- showing the tasks's due_date -->
                            <span class="px-6 flex flex-col gap-3">
                                <span>Due Date</span>
                                <span class="flex justify-center">
                                    {{ moment(data.data.due_date).calendar() }}
                                </span>
                            </span>

                            <!-- showing the tasks's done date -->
                            <span v-if="data.data.status === 'done' || data.data.status === 'expired'"
                                class="px-6 flex flex-col gap-3">
                                <span>Done Date</span>
                                <span class="flex justify-center">
                                    {{ moment(data.data.done_date).calendar() }}
                                </span>
                            </span>
                        </div>

                        <div>
                            <Pen class="h-5 w-5 cursor-pointer" v-if="!editMode" @click="editMode = !editMode" />
                            <CircleX class="h-5 w-5 cursor-pointer" v-if="editMode" @click="editMode = !editMode" />
                        </div>
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
