<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import SettingsLayout from '@/layouts/settings/Layout.vue';
import { TransitionRoot } from '@headlessui/vue';
import { reactive, ref } from 'vue';

import HeadingSmall from '@/components/HeadingSmall.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type BreadcrumbItem } from '@/types';
import { useApi } from '@/composables/useApi';

const breadcrumbItems: BreadcrumbItem[] = [
    {
        title: 'Password settings',
        href: '/settings/password',
    },
];

const passwordInput = ref<HTMLInputElement | null>(null);
const currentPasswordInput = ref<HTMLInputElement | null>(null);
const { putRequest, loading, success } = useApi();
const form = reactive({
    current_password: '',
    password: '',
    password_confirmation: '',

    reset: () => {
        form.current_password = '';
        form.password = '';
        form.password_confirmation = '';
    },
});

const updatePassword = () => {
    putRequest('/settings/password', form, { withAuth: true });
};
</script>

<template>
    <AppLayout :breadcrumbs="breadcrumbItems">
        <SettingsLayout>
            <div class="space-y-6">
                <HeadingSmall title="Update password"
                    description="Ensure your account is using a long, random password to stay secure" />

                <form @submit.prevent="updatePassword" class="space-y-6">
                    <div class="grid gap-2">
                        <Label for="current_password">Current password</Label>
                        <Input id="current_password" ref="currentPasswordInput" v-model="form.current_password"
                            type="password" class="mt-1 block w-full" autocomplete="current-password"
                            placeholder="Current password" />
                        <!-- <InputError :message="form.errors.current_password" /> -->
                    </div>

                    <div class="grid gap-2">
                        <Label for="password">New password</Label>
                        <Input id="password" ref="passwordInput" v-model="form.password" type="password"
                            class="mt-1 block w-full" autocomplete="new-password" placeholder="New password" />
                        <!-- <InputError :message="form.errors.password" /> -->
                    </div>

                    <div class="grid gap-2">
                        <Label for="password_confirmation">Confirm password</Label>
                        <Input id="password_confirmation" v-model="form.password_confirmation" type="password"
                            class="mt-1 block w-full" autocomplete="new-password" placeholder="Confirm password" />
                        <!-- <InputError :message="form.errors.password_confirmation" /> -->
                    </div>

                    <div class="flex items-center gap-4">
                        <Button :disabled="loading">Save password</Button>

                        <TransitionRoot :show="success" enter="transition ease-in-out" enter-from="opacity-0"
                            leave="transition ease-in-out" leave-to="opacity-0">
                            <p class="text-sm text-neutral-600">Saved</p>
                        </TransitionRoot>
                    </div>
                </form>
            </div>
        </SettingsLayout>
    </AppLayout>
</template>
