<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { RouterLink, useRoute } from 'vue-router'

interface Link {
    label: string,
    url: string,
}

defineProps({
    links: Array
})
const route = useRoute();

function isNext(link: Link) {
    return link.label && (link.label.includes('Next') || link.label.includes('next'))
}

function isPrevious(link: Link) {
    return link.label && (link.label.includes('Previous') || link.label.includes('previous'))
}

const routeRsolver = (apiRoute: string | null) => {
    if (!apiRoute) {
        return null;
    }

    const temp = apiRoute.split('?');

    return `${route.path}?${temp[1]}`
}

</script>

<template>
    <nav v-if="links.length > 3"
        class="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0 font-sans-fa mt-4">
        <template v-for="(link, p) in links" :key="'pre-' + p">
            <div v-if="isPrevious(link)" class="-mt-px flex w-0 flex-1">
                <div v-if="link.url === null"
                    class="inline-flex items-center border-t-2 border-transparent pl-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                    <ChevronLeft class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    previous
                </div>
                <RouterLink preserve-scroll v-else
                    class="inline-flex items-center border-t-2 pl-4 pt-4 text-sm font-medium"
                    :class="link.active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                    :to="routeRsolver(link.url)">
                    <ChevronLeft class="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                    previous
                </RouterLink>
            </div>
        </template>
        <div class="hidden md:-mt-px md:flex">
            <template v-for="(link, p) in links" :key="'nex-' + p">
                <template v-if="!isNext(link) && !isPrevious(link)">
                    <div v-if="link.url === null"
                        class="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        v-html="link.label" />
                    <RouterLink preserve-scroll v-else
                        class="inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium"
                        :class="link.active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                        :to="routeRsolver(link.url)" v-html="link.label"></RouterLink>
                </template>
            </template>

        </div>
        <template v-for="(link, p) in links" :key="'nex-' + p">
            <div v-if="isNext(link)" class="-mt-px flex w-0 flex-1 justify-end">

                <div v-if="link.url === null"
                    class="inline-flex items-center border-t-2 border-transparent pr-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                    next
                    <ChevronRight class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <RouterLink preserve-scroll v-else
                    class="inline-flex items-center border-t-2 pr-4 pt-4 text-sm font-medium"
                    :class="link.active ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
                    :to="routeRsolver(link.url)">
                    next
                    <ChevronRight class="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
                </RouterLink>
            </div>
        </template>
    </nav>
</template>

<style scoped></style>
