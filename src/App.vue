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
  <section class="text-center flex flex-col justify-center h-[16.67vh] pt-8">
    <h1 class="text-4xl text-white font-semibold">World Holidays</h1>
    <section class="flex items-center justify-center mx-auto space-x-8 mt-8 max-w-4xl">
      <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Country</label>
      <select id="countries" v-model="selectedCountry"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option v-for="(country) in countries" :key="country.countryCode" :value="country.countryCode">
          {{ country.name }}
        </option>
      </select>
      <label for="countries" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Year</label>
      <input type="number" id="year" v-model="selectedYear"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <button @click="handleHolidaySearch"
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg">
        Search
      </button>
    </section>
  </section>
  <section class="h-[83.2vh] overflow-y-hidden flex" v-if="!!holidays.length">
    <div class="w-1/2 h-full grid place-content-center">
      <h1 class="text-4xl">Next holiday...</h1>
      <div class="flex items-end p-8">
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
    </div>
    <div class="w-1/2 my-16 ">
      <h1 class="mb-4 text-3xl h-[4%]">
        {{ countries.find(country => country.countryCode === nextHoliday?.countryCode)?.name }}
        {{ new Date(`${holidays[0].date}T00:00:00`).getFullYear() }} Holidays
        ({{ holidays.length }})
      </h1>
      <div class="max-w-xl mx-auto h-[93%] overflow-y-auto scroll">
        <div>
          <div class="flex items-center justify-between px-4 py-2 border-b">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Date</p>
            <p class="text-sm font-medium text-gray-900 dark:text-white">Holiday</p>
          </div>
          <div v-for="holiday in holidays" :key="holiday.date" class="flex items-center justify-between px-4 py-2"
            :class="{ 'bg-red-900 rounded': holiday.date === nextHoliday?.date }">
            <p class="text-sm text-gray-900 dark:text-white">{{ (holiday.date) }}</p>
            <p class="text-sm text-gray-900 dark:text-white">{{ holiday.localName }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
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
