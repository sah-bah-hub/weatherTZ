import { defineStore } from 'pinia';
import {ref} from 'vue';
import { City, Weather } from "../assets/Classes";

export const useStore = defineStore('Store', () => {
    const locationArray: Ref<Weather[]> = ref([]);
    const measurement: Ref<string> = ref('C');
    const searchHistory: Ref<City[]> = ref([]);

    watch(
        locationArray,
        (newValue: Weather[]) => {
            window.localStorage.setItem("locations", JSON.stringify(newValue));
        },
        { deep: true }
    );
    watch(
        measurement,
        (newValue: string) => {
            window.localStorage.setItem("measurement", JSON.stringify(newValue));
        }
    );
    watch(
        searchHistory,
        (newValue: City[]) => {
            window.localStorage.setItem("searchHistory", JSON.stringify(newValue));            
        }, { deep: true }
    );

    const updateWeater = async (location: Weather): Promise<void> => {
        try {
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e8157b3a99bf0d5c82e7c5b17138366c&units=metric`;
            const { data, error } = await useFetch(url);
            const json = data.value;
            if (json) {
                deliteCity(location);
                addLocation(new Weather(json));
            } else {
                console.error('Ошибка в ответе при получении данных:', error.value);
            }
        } catch (error) {
            if (error.response) {
                console.error('Ошибка ответа сервера:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('Ошибка запроса:', error.request);
            } else {
                console.error('Неизвестная ошибка:', error.message);
            }
        }
    };
    const sortCities = (): void => {
        locationArray.value.sort((a: Weather, b: Weather) => a.index - b.index);
    };
    const deliteCity = (location: Weather): void => {
        locationArray.value = locationArray.value.filter((item: Weather) => item != location);
    };
    const addLocation = (location: Weather): void => {
        locationArray.value.push(location);
    }

    return {
        locationArray,
        measurement,
        searchHistory,
        sortCities,
        deliteCity,
        addLocation,
        updateWeater,
    };
});
export default null;