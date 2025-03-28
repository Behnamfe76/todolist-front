<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue';

import DeleteUser from '@/components/DeleteUser.vue';
import HeadingSmall from '@/components/HeadingSmall.vue';
import InputError from '@/components/InputError.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { useAuth } from '@/composables/useAuth';
import { reactive } from 'vue';
import { useApi } from '@/composables/useApi';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: '/settings/profile',
    },
];
const { user } = useAuth();
const { patchRequest, loading, success } = useApi();
const userData = user.value as User;

const form = reactive({
    name: userData.name,
    email: userData.email,
});

const submit = () => {
    patchRequest('/settings/profile', {
        name: form.name,
        email: form.email,
    }, {
        withAuth: true
    })
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbs">

        <Head title="Profile settings" />

        <SettingsLayout>
            <div class="flex flex-col space-y-6">
                <HeadingSmall title="Profile information" description="Update your name and email address" />

                <form @submit.prevent="submit" class="space-y-6">
                    <div class="grid gap-2">
                        <Label for="name">Name</Label>
                        <Input id="name" class="mt-1 block w-full" v-model="form.name" required autocomplete="name"
                            placeholder="Full name" />
                        <!-- <InputError class="mt-2" :message="form.errors.name" /> -->
                    </div>

                    <div class="grid gap-2">
                        <Label for="email">Email address</Label>
                        <Input id="email" type="email" class="mt-1 block w-full" v-model="form.email" required
                            autocomplete="username" placeholder="Email address" />
                        <!-- <InputError class="mt-2" :message="form.errors.email" /> -->
                    </div>


                    <div class="flex items-center gap-4">
                        <Button :disabled="loading">Save</Button>

                        <TransitionRoot :show="success" enter="transition ease-in-out" enter-from="opacity-0"
                            leave="transition ease-in-out" leave-to="opacity-0">
                            <p class="text-sm text-neutral-600">Saved.</p>
                        </TransitionRoot>
                    </div>
                </form>
            </div>

            <DeleteUser />
        </SettingsLayout>
    </AppLayout>
</template>
