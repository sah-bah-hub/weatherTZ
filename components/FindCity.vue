<template>
    <div class="find-component">
        <div class="find-component__title"> Add location:</div>
        <div class="find-component__search-container">
            <div class="find-component__input-container">
                <input
                    class="find-component__input"
                    type="text"
                    v-model="location"
                    :placeholder="props.placeholder"
                    v-on:keyup.enter="validation"
                    v-on:keyup.prevent.up="selectItem('up')"
                    v-on:keyup.prevent.down="selectItem('down')"
                    @focusin="focusInput = true"
                    @focusout="() => focusout()"
                    
                >
                <div class="find-component__sities">
                    <p
                        class="find-component__sity"
                        :class="selected === element.name? 'find-component__sity--selected' : ''"
                        @click="validation(element)"
                        v-for="element,idx in searchList"
                        :key="idx+element.lat"
                    >
                        {{element.name}}
                    </p>
                </div>
            </div>
            <img
                class="find-component__enter"
                src="../assets/enter.svg"
                alt="enter icon"
            >
        </div>
    </div>
</template>

<script lang="ts" setup>
import {City,Weather} from "../assets/Classes";
import { useStore } from "~/store/locations";

const store = useStore();
const props = defineProps(['placeholder']);

const location: Ref<string> = ref('');
const locationArray: Ref<City[]> = ref([]);
const selected: Ref<string> = ref('');
const focusInput: Ref<boolean> = ref(false);

watch(location, (cur: string): void => {
    if (cur != "") {
        updateCitysArray(cur);
        return                    
    }
    locationArray.value = [];
})

const searchList:Ref<City[]> = computed(():City[] => {
    if (focusInput.value) {
        if (!location.value) {
            return store.searchHistory.filter(el => 
                !store.locationArray.map(e => e.name).includes(el.name)                
            )
        }
    }
    return locationArray.value;
});


const focusout = ():void => { 
    setTimeout(() => focusInput.value = false, 150) 
};
const selectItem = (direction:string):void => {
    if (!(locationArray.value.length-1)) {
        return
    }
    let item:HTMLElement|null = document.querySelector(`.find-component__input-container .find-component__sity--selected`);
    
    const offset:number = direction == 'down' ? 1: -1;
    if (item == null){        
        const childselector:string = direction == 'down' ? "first-child": "last-child"
        
        item = document.querySelector(`.find-component__sities p:${childselector}`) as HTMLElement;
        selected.value = item.innerText;
        return
    }
    var parent:HTMLElement = item.parentElement as HTMLElement;
    let allItems:HTMLElement[] = Array.from(parent.childNodes) as HTMLElement[];
    var index:number = allItems.indexOf(item);
    var newIndex:number = index + offset;
    switch (true) {
        case newIndex < 0:
            newIndex = parent.childNodes.length - 1
            break;
        case newIndex > parent.childNodes.length - 1:
            newIndex = 0
            break;
    }
    selected.value = allItems[newIndex].innerText;
};
const validation = (argument:City|null):void => {
    if (argument?.lat && argument?.lon) {
        findInfo(argument.lat,argument.lon);
        return
    }
    if (searchList.value.length == 0) {
        return
    }
    var item:any = null;
    var input:HTMLElement = document.querySelector(`.find-component__input-container .find-component__sity--selected`) as HTMLElement;
    if (input == null) {
        item = locationArray.value[0];
    } else{
        item = locationArray.value.find( (e:City) => e.name == input.innerText);
    }
    findInfo(item.lat,item.lon);
};
const findInfo = async (lat:number,lon:number): Promise<void> => {
    try {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=e8157b3a99bf0d5c82e7c5b17138366c&units=metric`;
        const { data, error } = await useFetch(url);
        const json = data.value;
        if (json) {
            store.addLocation(new Weather(json));            
            location.value = "";
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
const updateCitysArray = async (str: string): Promise<void> => {
    try {
        let url = `https://api.openweathermap.org/geo/1.0/direct?q=${str}&limit=5&appid=e8157b3a99bf0d5c82e7c5b17138366c`;
        const { data, error } = await useFetch(url);
        const json = data.value;
        if (json) {
            var cities:City[] = [];
            json.forEach((e:object) => {
                cities.push(new City(e)) 
            });
            locationArray.value = cities;
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
</script>

<style lang="scss">
    $shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    $gray: #b4b4b4;
    $lightgray: #eeeeee;

    .find-component {
        &__title {
            font-weight: bold;
        }
        &__search-container {
            display: flex;
            margin: 0.2rem 0.5rem;
        }
        &__input-container {
            display: inline;
            align-items: center;
            width: -webkit-fill-available;  
            border-radius: 4px; 
            background-color: white;
            box-shadow: $shadow;
        }
        &__input {
            width: inherit;
            padding: 0.5rem;
            margin: auto;
            border: lightgray;
            border-radius: 4px;
            &::placeholder {
                color: $gray;
            }
            &:focus {
                outline: 0;
                box-shadow: $shadow;
            }
        }
        &__sity {
            cursor: pointer;
            padding: 0.5rem;
            margin: 0;
            &:hover{
                background-color: $lightgray;
            }
            &--selected {
                background: #eeeeee;;
            }
        }
        &__enter {
            height: 1.75rem;
            width: 1.75rem;
            padding-left: 0.5rem;
        }
    }
</style>