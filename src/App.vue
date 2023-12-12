<script setup lang="ts">
import { ref, computed } from 'vue'
import { holidaysApi } from '@/api';
import type { AvailableCountries, PublicHolidays } from './interface';

const countries = ref<AvailableCountries[]>([])
const holidays = ref<PublicHolidays[]>([])
const nextHoliday = ref<PublicHolidays | null>(null)
const nextHolidayDate = computed(() => new Date(`${nextHoliday.value?.date}T00:00:00`))
const selectedCountry = ref<string>('CO')
const selectedYear = ref<number>(new Date().getFullYear())

const fetchCountries = async () => {
  const { data } = await holidaysApi.get<AvailableCountries[]>('/AvailableCountries')
  countries.value = data
}

const fetchHolidays = async () => {
  const { data } = await holidaysApi.get<PublicHolidays[]>(`/PublicHolidays/${selectedYear.value}/${selectedCountry.value}`)
  holidays.value = data
}

const fetchNextHoliday = async () => {
  const { data } = await holidaysApi.get<PublicHolidays[]>(`/NextPublicHolidays/${selectedCountry.value}`)
  nextHoliday.value = data[0]
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
</template>

<style scoped></style>
