<script setup lang="ts">
import { Input } from '@/components/ui/input';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { Trash, Plus, LoaderCircle } from "lucide-vue-next"
import { Checkbox } from '@/components/ui/checkbox';
import * as yup from 'yup';
import moment from 'moment';
import { useApi } from '@/composables/useApi';
import { useRouter, type Router } from 'vue-router';
import { inject, onBeforeMount, reactive, type Reactive } from 'vue';
const props = defineProps<{
    uuid: string;
}>();

interface SubTasks {
    text: string,
    uuid: string;
    is_completed: boolean;
}

const subTasks: Reactive<Array<SubTasks>> = reactive([]);
const router: Router = useRouter();
const schema = toTypedSchema(
    yup.object({
        subTask: yup.string().required('Sub task is required'),
    })
);
const { errors, handleSubmit, defineField } = useForm({
    validationSchema: schema,
});
const [subTask, subTaskAttrs] = defineField('subTask');
const { postRequest, patchRequest, getRequest, error, loading, success, deleteRequest, data } = useApi()
const Swal = inject('$swal');

const submit = handleSubmit(async (values) => {
    try {
        const payload = {
            text: values.subTask,
        };
        await postRequest(`/tasks/sub-tasks/${props.uuid}`, payload, { withAuth: true });

        subTasks.unshift({
            text: data.value.data.text,
            uuid: data.value.data.uuid,
            isCompleted: data.value.data.is_completed
        })
        subTask.value = '';
    } catch (error) {
        console.error('Submission failed:', error);
    }
});

const deleteSubTask = async (uuid: string) => {
    Swal.fire({
        title: "Are you sure?",
        text: "The sub task would be deleted permanently. Do you want to?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then(async (result: { isConfirmed: boolean }) => {
        if (result.isConfirmed) {
            try {
                await deleteRequest(`/tasks/sub-tasks/${uuid}`, { withAuth: true });

                if (success.value) {
                    const index = subTasks.findIndex(task => task.uuid === uuid);
                    if (index !== -1) {
                        subTasks.splice(index, 1);
                    }
                }
            } catch (error) {
                console.log(error)
            }

        }
    });
}

const changeSubTaskCompletion = async (uuid: string) => {
    try {

        await patchRequest(`/tasks/sub-tasks/${uuid}`, {}, { withAuth: true });
    } catch (error) {
        console.error('fetching failed:', error);
    }
};

const getSubTasks = async () => {
    try {

        await getRequest(`/tasks/sub-tasks/${props.uuid}`, { withAuth: true });

        initializeSubTasks()
    } catch (error) {
        console.error('fetching failed:', error);
    }
};

const initializeSubTasks = () => {
    try {
        data.value.data.forEach((element: SubTasks) => {
            subTasks.unshift({
                text: element.text,
                uuid: element.uuid,
                is_completed: element.is_completed
            })
        });
    } catch (error) {
        console.error('fetching failed:', error);
    }
};


onBeforeMount(async () => {
    await getSubTasks()
});

</script>

<template>
    <div
        class="mt-4 block p-6 bg-white border border-gray-200 rounded-lg shadow-sm  dark:bg-gray-800 dark:border-gray-700 ">
        <div class="grid gap-2 relative">
            <Input :disabled="loading" @keyup.enter="submit" id="title" v-model="subTask" v-bind="subTaskAttrs"
                placeholder="New sub task..." />
            <Plus @click="submit" class="h-5 w-5 cursor-pointer absolute right-3 top-[50%] translate-y-[-50%]" />

        </div>

        <div class="my-2">
            <div v-if="loading" class="flex items-center gap-2">
                Loading ...
                <LoaderCircle class="h-4 w-4 animate-spin" />
            </div>
        </div>

        <ul class="space-y-2">
            <li class="border-b flex py-1 justify-between items-center" v-for="subTask in subTasks" :key="subTask.uuid">
                <div class="flex items-center gap-2">
                    <Checkbox :disabled="loading" @update:checked="changeSubTaskCompletion(subTask.uuid)" id="remember"
                        v-model:checked="subTask.is_completed" :tabindex="4" />
                    <span :class="[subTask.is_completed && 'line-through']">{{ subTask.text }}</span>
                </div>
                <div>
                    <Trash class="h-5 w-5 cursor-pointer" @click="deleteSubTask(subTask.uuid)" />
                </div>
            </li>
        </ul>
    </div>
</template>
