<script setup lang="ts">
import InputError from '@/components/InputError.vue';
import TextLink from '@/components/TextLink.vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthBase from '@/layouts/AuthLayout.vue';
import { LoaderCircle } from 'lucide-vue-next';
import { reactive } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { useRouter } from 'vue-router';
import { useApi } from '@/composables/useApi';


// Define the validation schema
const schema = toTypedSchema(
    yup.object({
        name: yup.string()
            .required('Name is required')
            .min(2, 'Name must be at least 2 characters'),
        email: yup.string()
            .required('Email is required')
            .email('Must be a valid email address'),
        password: yup.string()
            .required('Password is required')
            .min(8, 'Password must be at least 8 characters'),
        password_confirmation: yup.string()
            .required('Password confirmation is required')
            .oneOf([yup.ref('password')], 'Passwords must match'),
    })
);

// Initialize useForm with the schema
const { errors, handleSubmit, defineField } = useForm({
    validationSchema: schema,
});

// Define form fields with validation
const [name, nameAttrs] = defineField('name');
const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [password_confirmation, passwordConfirmationAttrs] = defineField('password_confirmation');

const { loading, postRequest, error: apiErrors, success } = useApi();
const router = useRouter();

const submit = handleSubmit(async (values) => {
    try {

        const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            password_confirmation: values.password_confirmation,
        };

        await postRequest('/register', payload);

        if (success.value) {
            router.push('/dashboard');
        }
    } catch (err) {
        console.error('Submission failed:', err);
    }
});

</script>

<template>
    <AuthBase title="Create an account" description="Enter your details below to create your account">
        <form @submit.prevent="submit" class="flex flex-col gap-6">
            <div class="grid gap-6">
                <div class="grid gap-2">
                    <Label for="name">Name</Label>
                    <Input id="name" type="text" autofocus :tabindex="1" autocomplete="name" v-model="name"
                        v-bind="nameAttrs" placeholder="Full name" />
                    <InputError :message="apiErrors?.errors?.name?.join('') ?? errors.name" />
                </div>

                <div class="grid gap-2">
                    <Label for="email">Email address</Label>
                    <Input id="email" type="email" :tabindex="2" autocomplete="email" v-model="email"
                        v-bind="emailAttrs" placeholder=" email@example.com" />
                    <InputError :message="apiErrors?.errors?.email?.join('') ?? errors.email" />
                </div>
                <div class="grid gap-2">
                    <Label for="password">Password</Label>
                    <Input id="password" type="password" :tabindex="3" autocomplete="new-password" v-model="password"
                        v-bind="passwordAttrs" placeholder="Password" />
                    <InputError :message="apiErrors?.errors?.password?.join('') ?? errors.password" />
                </div>

                <div class="grid gap-2">
                    <Label for="password_confirmation">Confirm password</Label>
                    <Input id="password_confirmation" type="password" :tabindex="4" autocomplete="new-password"
                        v-model="password_confirmation" v-bind="passwordConfirmationAttrs"
                        placeholder="Confirm password" />
                    <InputError
                        :message="apiErrors?.errors?.password_confirmation?.join('') ?? errors.password_confirmation" />
                </div>

                <Button type="submit" class="mt-2 w-full" tabindex="5" :disabled="loading">
                    <LoaderCircle v-if="loading" class="h-4 w-4 animate-spin" />
                    Create account
                </Button>
            </div>

            <div class="text-center text-sm text-muted-foreground">
                Already have an account?
                <TextLink href="login" class="underline underline-offset-4" :tabindex="6">Log in</TextLink>
            </div>
        </form>
    </AuthBase>
</template>
