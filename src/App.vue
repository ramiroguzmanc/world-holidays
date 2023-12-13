<script setup lang="ts">
import { ref, computed } from 'vue'
import { holidaysApi } from '@/api';
import type { AvailableCountries, PublicHolidays } from './interface';

interface ApiYearError {
  response: {
    data: {
      errors: {
        year: string[];
      };
    };
  };
}

const countries = ref<AvailableCountries[]>([])
const holidays = ref<PublicHolidays[]>([])
const nextHoliday = ref<PublicHolidays | null>(null)
const nextHolidayDate = computed(() => new Date(`${nextHoliday.value?.date}T00:00:00`))
const selectedCountry = ref<string>('CO')
const selectedYear = ref<number>(new Date().getFullYear())
const toast = ref({
  show: false,
  message: '',
})

const showToast = (message: string) => {
  toast.value = {
    show: true,
    message: message,
  }
}

const closeToast = () => {
  toast.value = {
    show: false,
    message: '',
  }
}

const fetchCountries = async () => {
  try {
    const { data } = await holidaysApi.get<AvailableCountries[]>('/AvailableCountries')
    countries.value = data
  } catch (error) {
    showToast('Error fetching countries')
  }
}

const fetchHolidays = async () => {
  try {
    const { data } = await holidaysApi.get<PublicHolidays[]>(`/PublicHolidays/${selectedYear.value}/${selectedCountry.value}`)
    holidays.value = data
    toast.value = {
      show: false,
      message: '',
    }
  } catch (error) {
    const apiError = error as ApiYearError
    showToast(apiError.response.data.errors.year[0])
  }
}

const fetchNextHoliday = async () => {
  try {
    const { data } = await holidaysApi.get<PublicHolidays[]>(`/NextPublicHolidays/${selectedCountry.value}`)
    nextHoliday.value = data[0]
  } catch (error) {
    showToast('Error fetching next holiday')
  }
}

const handleHolidaySearch = () => {
  fetchHolidays()
  fetchNextHoliday()
}

fetchCountries()

</script>

<template>
  <header class="text-center flex flex-col justify-center items-center">
    <h1 class="text-4xl dark:text-white font-semibold my-8">World Holidays</h1>
    <section class="items-end max-w-lg justify-center space-y-4 w-full md:space-y-0 md:space-x-8 md:max-w-4xl md:flex">
      <div>
        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
        <select id="countries" v-model="selectedCountry"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500">
          <option v-for="(country) in countries" :key="country.countryCode" :value="country.countryCode">
            {{ country.name }}
          </option>
        </select>
      </div>
      <div>
        <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
        <input type="number" id="year" v-model="selectedYear"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-red-500 dark:focus:border-red-500">
      </div>
      <button @click="handleHolidaySearch" class="bg-red-700 hover:bg-red-500 text-white font-bold py-2 px-8 rounded-lg">
        Search
      </button>
    </section>
  </header>
  <main class="mt-16 mb-8 lg:flex xl:h-[73vh] dark:text-white" v-if="!!holidays.length">
    <section class="text-center lg:text-start lg:place-content-center lg:w-4/6 lg:grid">
      <h1 class="text-4xl">Next holiday...</h1>
      <div class="flex flex-col lg:flex-row items-center py-4 lg:p-8 lg:items-end">
        <div class="bg-red-900 h-52 w-52 flex items-center justify-center text-9xl text-white rounded-lg">
          <span>{{ nextHolidayDate.getDate() }}</span>
        </div>
        <div class="ml-2">
          <p class="text-7xl capitalize font-semibold">
            {{ nextHolidayDate.toLocaleString('default', { month: 'long' }) }}
          </p>
          <p class="text-3xl"> {{ new Date(nextHoliday?.date || '').getFullYear() }} - {{ nextHoliday?.localName }}</p>
        </div>
      </div>
    </section>
    <section class="lg:w-3/6 mt-8 lg:mt-0">
      <h1 class="text-3xl text-center lg:text-start lg:mb-1.5">
        {{ countries.find(country => country.countryCode === nextHoliday?.countryCode)?.name }}
        {{ new Date(`${holidays[0].date}T00:00:00`).getFullYear() }} Holidays
        ({{ holidays.length }})
      </h1>
      <div class="max-w-xl mx-auto xl:max-h-[90%] overflow-y-auto scroll">
        <div>
          <div class="flex items-center justify-between px-4 py-2 border-b">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Date</p>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Holiday</p>
          </div>
          <div v-for="holiday in holidays" :key="holiday.date" class="flex items-center justify-between px-4 py-2"
            :class="{ 'rounded bg-red-900 text-white': holiday.date === nextHoliday?.date }">
            <p class="">{{ (holiday.date) }}</p>
            <p class=" text-end max-w-[70%]">{{ holiday.localName }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
  <div v-show="toast.show" id="toast-top-left"
    class="fixed flex justify-between items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-gray-200 rounded-lg shadow top-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800"
    role="alert">
    <div
      class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
      <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
      </svg>
      <span class="sr-only">Error icon</span>
    </div>
    <div class="ms-3 text-sm font-normal">{{ toast.message }}</div>
    <button type="button"
      class="border ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
      data-dismiss-target="#toast-danger" aria-label="Close" @click="closeToast">
      <span class="sr-only">Close</span>
      <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
      </svg>
    </button>
  </div>
</template>

<style scoped></style>
