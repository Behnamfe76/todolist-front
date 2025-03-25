<script setup lang="ts">
import AppLayout from '@/layouts/AppLayout.vue';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'vue-router';

const router = useRouter();
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/tasks',
    },
];
</script>

<template>

    <AppLayout :breadcrumbs="breadcrumbs">
        <div class="flex h-full flex-1 flex-col gap-4 rounded-xl py-4 px-8">
            <div>
                <Button @click="router.push('/tasks/create')" class="mt-4" :tabindex="4" :disabled="loading">
                    Create
                </Button>
            </div>
        </div>
    </AppLayout>
</template>
