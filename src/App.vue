<script setup lang="ts">
import { ref } from 'vue'
import { holidaysApi } from '@/api';
import type { AvailableCountries, PublicHolidays } from './interface';

const countries = ref<AvailableCountries[]>([])
const holidays = ref<PublicHolidays[]>([])
const selectedCountry = ref<string>('CO')
const selectedYear = ref<number>(2024)

const fetchCountries = async () => {
  const { data } = await holidaysApi.get<AvailableCountries[]>('/AvailableCountries')
  countries.value = data
}

const fetchHolidays = async () => {
  const { data } = await holidaysApi.get<PublicHolidays[]>(`/PublicHolidays/${selectedYear.value}/${selectedCountry.value}`)
  holidays.value = data
}

fetchCountries()

</script>

<template>
  <section class="text-center my-8">
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
      <button @click="fetchHolidays" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded-lg">
        Search
      </button>
    </section>
  </section>
  <section class="max-w-2xl mx-auto">
    <div class="flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="shadow overflow-hidden border-b border-gray-200 dark:border-gray-700 sm:rounded-lg bg-white dark:bg-gray-800">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700 border-b">
                <tr>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Country
                  </th>
                </tr>
              </thead>
              <tbody class="bg-gray-700 divide-y divide-gray-200 dark:divide-gray">
                <tr v-for="(holiday) in holidays" :key="holiday.date.toString()"
                  class="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {{ holiday.date }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {{ holiday.localName }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    <!-- {{ holiday.type }} -->
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                    {{ holiday.countryCode }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
