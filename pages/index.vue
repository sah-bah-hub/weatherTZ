<template>
    <div class="container">
        <FindCity 
            v-if="!store.locationArray.length"
            @openOption="openOption"
            placeholder="What is your position"
        />
        <Settings
            v-if="store.locationArray.length"
            @openOption="openOption"
            placeholder="What is your position"
        />
        <template v-if="!settingsIsOpen">
            <WeatherInfo
                v-for="city in store.locationArray"
                :element="city"
                :key="city.name"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { City,Weather } from "../assets/Classes";
import { useStore } from "~/store/locations";

const store = useStore();
const settingsIsOpen: Ref<boolean> = ref(false);

onMounted(() => {
    const locationsStorage: Weather[] | null = JSON.parse(window.localStorage.getItem('locations') as string);
    const measurementStorage: string | null = JSON.parse(window.localStorage.getItem('measurement') as string);
    const searchHistoryStorage: City[] | null = JSON.parse(window.localStorage.getItem('searchHistory') as string);
    if (locationsStorage != null) {
        store.locationArray = locationsStorage;
    }
    if (measurementStorage != null) {
        store.measurement = measurementStorage;
    }
    if (searchHistoryStorage != null) {
        store.searchHistory = searchHistoryStorage;
    }
    checkUpdate();
    setInterval(async() => { checkUpdate() }, 3600000);
});

const checkUpdate = async (): Promise<void> => {
    for (const item of store.locationArray) {
        if (item.updateTime) {
            if (new Date(item.updateTime) < new Date( (new Date()).setHours((new Date).getHours() -1))) {
                await store.updateWeater(item);
            }
        }
    }

};
const openOption = (isopen: boolean): void => {
    settingsIsOpen.value = isopen;
};
</script>

<style lang="scss">
::-webkit-scrollbar {
    width: 7px;
    background-color: white;
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #b4b4b4;
}

::-webkit-scrollbar-track {
    background-color: white;
}
.container {
    font-family: "Source Sans Pro", sans-serif;
    width: 15rem;
    max-height: 40rem;
    margin: auto;
    padding: 1rem;   
    background-color: white;
    color: #4d4c4b;
    overflow-y: scroll;
    min-height: 250px;
    padding-top: 2rem;
}
body {
    margin: 0;
}
#__nuxt{
    background: gray;
    height: 100vh;
    margin: auto;
}
</style>

