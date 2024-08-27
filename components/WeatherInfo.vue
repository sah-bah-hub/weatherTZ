<template>
    <div class="weather-info">
        <div class="weather-info__header">
            {{element.name}}
        </div>
        <div class="weather-info__img-container">
            <img class="weather-info__icon" :src="element.imgSrc" alt="">
            <div class="weather-info__temerature">{{ store.measurement === 'C' ? element.temperature : element.temperatureF }} °{{ store.measurement }}</div>
        </div>
        <p class="weather-info__description">
            Feels like {{ store.measurement === 'C' ? element.feelsLike : element.feelsLikeF }}°{{ store.measurement }}. {{element.description}}. {{element.windType}}
        </p>
        <div class="weather-info__body">
            <div>
                <div>
                    <img
                        :style="`transform: rotate(`+element.wind.deg+`deg);`"
                        class="weather-info__description-ico"
                        src="../assets/arrow.svg"
                    > 
                    {{element.wind.speed}}m/s {{element.wind.direction}}
                </div>
                <div>
                    <img src="../assets/pressure.svg"> 
                    {{element.pressure}}hPa
                </div>
            </div>
            <div>
                <div>Humidity: {{element.humidity}}%</div>
                <div>Dew point: {{element.dewPoint}}°C</div>
            </div>
            <div>Visibility: {{element.visibility}}km</div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { useStore } from "~/store/locations";
const store = useStore();

const props = defineProps(['element']);
</script>


<style lang="scss">

.weather-info {
    &__header {
        display: flex;
        font-size: 2rem;
    }
    &__img-container {
        display: flex;
        justify-content: center;
    }
    &__icon {
        width: 6rem;
        height: 6rem;
    }
    &__temerature {
        color: black;
        display: flex;
        align-items: center;
        font-size: 2rem;
        font-weight: bold;
    }
    &__body {
        >div{
            margin: 1rem 0rem;
            display: flex;
            justify-content: space-between;
            > div{
                display: flex;
                align-items: center;
            }
        }
        img{
            width: 1.5rem;
            height: 1.5rem;

        }
    }
}
</style>