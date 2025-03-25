<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { LoaderCircle } from 'lucide-vue-next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useApi } from '@/composables/useApi';
import { useRouter } from 'vue-router';
import { reactive } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { watch } from 'vue';

// Define the validation schema
const schema = toTypedSchema(
    yup.object({
        title: yup.string().required('Title is required'),
        description: yup.string().nullable(),
        type: yup.object().required('Type is required'),
        status: yup.object().required('Status is required'),
        priority: yup.object().required('Priority is required'),
    })
);

// Initialize useForm with the schema
const { errors, handleSubmit, defineField } = useForm({
    validationSchema: schema,
    initialValues: {
        title: '',
        description: '',
        type: { label: 'Internal', value: 'internal' },
        status: { label: 'Todo', value: 'todo' },
        priority: { label: 'Medium', value: 'medium' },
    },
});

// Define form fields with validation
const [title, titleAttrs] = defineField('title');
const [description, descriptionAttrs] = defineField('description');
const [type] = defineField('type');
const [status] = defineField('status');
const [priority] = defineField('priority');

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

const selectOptions = reactive({
    type: taskTypes[0],
    status: taskStatuses[0],
    priority: taskPriorities[1],
});

const { loading, postRequest, errors: apiErrors, success } = useApi();
const router = useRouter();
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Tasks',
        href: '/tasks/create',
    },
];

const submit = handleSubmit(async (values) => {
    try {

        const payload = {
            title: values.title,
            description: values.description,
            type: values.type.value,
            status: values.status.value,
            priority: values.priority.value,
        };

        await postRequest('/tasks', payload, { withAuth: true });

        if (success.value) {
            router.push('/tasks');
        }
    } catch (error) {
        console.error('Submission failed:', error);
    }
});

</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl py-4 px-8">
            <form @submit="submit">
                <div class="space-y-12 sm:space-y-16">
                    <div>
                        <h2 class="text-base/7 font-semibold text-gray-900">Task Information</h2>
                        <p class="mt-1 max-w-2xl text-sm/6 text-gray-600">
                            Enter the task details below.
                        </p>

                        <div class="mt-10 space-y-4 pb-12 sm:pb-0">
                            <div class="grid gap-2">
                                <Label for="title">Title</Label>
                                <Input id="title" v-model="title" v-bind="titleAttrs" placeholder="title" />
                                <span v-if="errors.title" class="text-red-500 text-sm">
                                    {{ errors.title }}
                                </span>
                            </div>

                            <div class="grid gap-2">
                                <Label for="description">Description</Label>
                                <Textarea id="description" v-model="description" v-bind="descriptionAttrs"
                                    placeholder="description" />
                                <span v-if="errors.description" class="text-red-500 text-sm">
                                    {{ errors.description }}
                                </span>
                            </div>

                            <div class="grid gap-2 grid-cols-3">
                                <div class="grid gap-2">
                                    <Label for="types">Type</Label>
                                    <Select @update:modelValue="(e) => type = e" :options="taskTypes"
                                        v-model="selectOptions.type" placeholder="select a type..." />
                                    <span v-if="errors.type" class="text-red-500 text-sm">
                                        {{ errors.type }}
                                    </span>
                                </div>

                                <div class="grid gap-2">
                                    <Label for="statuses">Status</Label>
                                    <Select @update:modelValue="(e) => status = e" :options="taskStatuses"
                                        v-model="selectOptions.status" placeholder="select a status..." />
                                    <span v-if="errors.status" class="text-red-500 text-sm">
                                        {{ errors.status }}
                                    </span>
                                </div>

                                <div class="grid gap-2">
                                    <Label for="priorities">Priority</Label>
                                    <Select @update:modelValue="(e) => priority = e" :options="taskPriorities"
                                        v-model="selectOptions.priority" placeholder="select a priority..." />
                                    <span v-if="errors.priority" class="text-red-500 text-sm">
                                        {{ errors.priority }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex items-center justify-end gap-x-6">
                    <button @click="router.push('/tasks')" type="button" class="text-sm/6 font-semibold text-gray-900">
                        Cancel
                    </button>
                    <Button type="submit" :disabled="loading">
                        <LoaderCircle v-if="loading" class="h-4 w-4 animate-spin" />
                        Save
                    </Button>
                </div>
            </form>
        </div>
    </AppLayout>
</template>
