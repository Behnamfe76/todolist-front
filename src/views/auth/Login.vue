<script setup lang="ts">
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthBase from '@/layouts/AuthLayout.vue';
import { LoaderCircle } from 'lucide-vue-next';
import { reactive } from 'vue';
import { useAuth } from '@/composables/useAuth';
import { useRouter } from 'vue-router';

const { login, loading, error } = useAuth();
const router = useRouter();
// defineProps<{
//     status?: string;
//     canResetPassword: boolean;
// }>();

const form = reactive({
    email: '',
    password: '',
    remember: false,
});

const submit = async () => {
    try {
        await login({
            email: form.email,
            password: form.password,
            remember: form.remember,
        });

        router.push('/dashboard');
    } catch (err) {
        console.error('Login error:', err);
    }
};
</script>

<template>
    <AuthBase title="Log in to your account" description="Enter your email and password below to log in">
        <div v-if="error" class="mb-4 text-center text-sm font-medium text-red-600">
            {{ error }}
        </div>

        <form @submit.prevent="submit" class="flex flex-col gap-6">
            <div class="grid gap-6">
                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input id="email" type="email" required autofocus :tabindex="1" autocomplete="email"
                        v-model="form.email" placeholder="email@example.com" />
                </div>

                <div class="grid gap-2">
                    <div class="flex items-center justify-between">
                        <Label for="password">Password</Label>
                        <TextLink href="passwordrequest" class="text-sm" :tabindex="5">
                            Forgot password?
                        </TextLink>
                    </div>
                    <Input id="password" type="password" required :tabindex="2" autocomplete="current-password"
                        v-model="form.password" placeholder="Password" />
                </div>

                <div class="flex items-center justify-between" :tabindex="3">
                    <Label for="remember" class="flex items-center space-x-3">
                        <Checkbox id="remember" v-model:checked="form.remember" :tabindex="4" />
                        <span>Remember me</span>
                    </Label>
                </div>

                <Button type="submit" class="mt-4 w-full bg-black text-white cursor-pointer" :tabindex="4"
                    :disabled="loading">
                    <LoaderCircle v-if="loading" class="h-4 w-4 animate-spin" />
                    Log in
                </Button>
            </div>

            <div class="text-center text-sm text-muted-foreground">
                Don't have an account?
                <TextLink href="register" :tabindex="5">Sign up</TextLink>
            </div>
        </form>
    </AuthBase>
</template>
