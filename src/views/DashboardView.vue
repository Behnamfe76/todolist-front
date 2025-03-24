<script setup lang="ts">
import { Button } from '@/components/ui/button';
import auth from '@/lib/authentication';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = async () => {
    try {
        await auth.logout();
        router.push('/login');
    } catch (error) {
        console.error('Logout failed:', error);
    }
};
</script>

<template>
    <div class="container mx-auto p-6">
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold">Dashboard</h1>
            <Button @click="handleLogout" variant="outline">Logout</Button>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h2 class="text-xl font-semibold mb-4">Welcome to your dashboard!</h2>
            <p class="text-gray-600 dark:text-gray-300">
                You are now logged in. This is a protected route that only authenticated users can access.
            </p>
        </div>
    </div>
</template> 