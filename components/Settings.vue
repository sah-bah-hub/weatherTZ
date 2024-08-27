<template>
    <div class="settings">
        <div class="settings__header" >
            <div class="settings__title">Setting</div>
            <img
                class="settings__ico"
                src="../assets/gear.svg"
                @click="openSettings($event.target)"
            >
        </div>
        <div v-if="active">
            <div class="settings__title">Units of measurement:</div>
            <div class="settings__units">
                <span
                    class="settings__unit-f"
                    :class="measurementUnits ? '' : 'settings__unit-f--active'"
                >
                    °F
                </span>
                <label class="switch">
                    <input
                        type="checkbox"
                        v-model="measurementUnits"
                    >
                    <span class="slider round"></span>
                </label>
                <span
                    class="settings__unit-c"
                    :class="measurementUnits ? 'settings__unit-c--active' : ''"
                >
                    °C
                </span>
            </div>
        </div>
        <div class="settings__body" v-if="active">
            <div class="settings__title">Cities:</div>
            <div>
                <div
                    class="settings__city"
                    v-for="element in store.locationArray"
                    :key="element.cityName"
                    :ref="setCityArray"
                >
                    <div>
                        <img
                            class="settings__hamburger"
                            src="../assets/Hamburger.svg"
                            @mousedown="drag($event)"
                        >
                        {{ element.name }}
                    </div>
                    <img
                        class="settings__trash"
                        src="../assets/trash.svg"
                        @click="deleteItem(element)"
                    >
                </div>
            </div>
            <FindCity
                placeholder="What is your position"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { City,Weather } from "../assets/Classes";
import { useStore } from "~/store/locations";

const store = useStore();

const emit = defineEmits(['openOption']);

const active: Ref<boolean> = ref(false);
const cityArray: Ref<HTMLDivElement[]> = ref([]);
const measurementUnits: Ref<boolean> = ref(store.measurement === "C" ? true : false)

const setCityArray = (element:HTMLDivElement) => {
    if (!cityArray.value.find(el => el === element) && element) {
        cityArray.value?.push(element)
    }
};
watch(active, () => {
    cityArray.value = [];
})
watch(measurementUnits, (cur: boolean) => {
    store.measurement =  cur ? "C" : 'F';
})

const deleteItem = (element: Weather):void => {
    store.deliteCity(element);
    if (!store.searchHistory.find(el => el.name == element.name)) {
        if (store.searchHistory.length >=5) {
            store.searchHistory.pop()
        }
        store.searchHistory.push(new City(element))
    }
};
const between = (x: number, min: number, max: number): number => {
    let result: number = x;
    if (result > max) {
        result = max;
    } else if (result < min) {
        result = min;
    }
    return result;
};
const drag = (event: MouseEvent): void => {
    event.preventDefault()
    var dragStartY: number = event.pageY;
    var moveY: number = 0;

    var element:HTMLElement = event.target?.parentElement.parentElement as HTMLElement;

    var length: number = cityArray.value.length;
    var index: number = cityArray.value.indexOf(element);
    
    var newElementIndex: number = 0;
    if (element.parentElement.childNodes.length != 1) {
        element.classList.add('dragging')
        function mouseup(e: MouseEvent) {
            window.removeEventListener('mouseup', mouseup, false);
            window.removeEventListener('mousemove', mousemove, false);
            element.classList.remove('dragging')
            cityArray.value.forEach((el: HTMLElement) => { el.style.transform = ""; el.style.transition = "0s" })

            store.locationArray[index].index = newElementIndex > index ? newElementIndex + 0.5 : newElementIndex - 0.5
            store.sortCities()
            store.locationArray.forEach((el: Weather, index: number) => {
                el.index = index;
            });

            setTimeout(() => { cityArray.value.forEach((el: HTMLElement) => { ; el.style.transition = "" }) }, 1)
        };
        function mousemove(e: MouseEvent) {
            var elementHeight: number = (element.parentElement.offsetHeight / length);
            var parentHeight: number = element.parentElement.offsetHeight;
            var maxMove: number = parentHeight - (elementHeight * (index + 1));
            var minMove: number = (elementHeight * index) * -1;
            moveY = between(e.pageY - dragStartY, minMove, maxMove);

            var elementOffsetIndex: number = Math.round(moveY / elementHeight);
            newElementIndex = between(Math.round(moveY / elementHeight) + index, 0, length - 1);
            cityArray.value[newElementIndex].style.transform = `translateY(${(between(elementOffsetIndex, -1, 1) * elementHeight) * -1}px)`
            switch (true) {
                case elementOffsetIndex == 0:
                    cityArray.value.forEach((el: HTMLElement) => {
                        if (el != element) el.style.transform = "";
                    })
                    break;
                case newElementIndex < index:
                    for (let i = 0; i < newElementIndex; i++) {
                        var el: HTMLElement = cityArray.value[i];
                        if (el.style.transform != "") {
                            el.style.transform = "";
                        }
                    }
                    break;
                case newElementIndex > index:
                    for (let i = length - 1; i > newElementIndex; i--) {
                        var el: HTMLElement = cityArray.value[i];
                        if (el.style.transform != "") {
                            el.style.transform = "";
                        }
                    }
                    break;
            };
            element.style.transform = `translateY(${moveY}px)`;
        };
        window.addEventListener('mousemove', mousemove, false);
        window.addEventListener('mouseup', mouseup, false);
    };
};
const openSettings = (elem: HTMLElement): void => {
    const element: HTMLElement = elem.parentNode?.parentNode as HTMLElement;
    if (active.value) {
        active.value = false;
        emit("openOption", false);
        element.classList.remove('settings--active');
        return;
    }
    active.value = true;
    emit("openOption", true);
    element.classList.add('settings--active');
};
</script>


<style lang="scss">
$shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
$bg: #edebe9;
$gray: #4d4c4b;


.settings {
    margin-top: -1.8rem;
    position: fixed;
    width: 245px;
    &--active {
        margin: -1rem;
        padding: 1rem;
        width: inherit;
        height: inherit;
        background: white;
        position: absolute;
        z-index: 1;
        margin-top: -2.8rem;

        .settings__title {
            opacity: 1 !important;
            user-select: none;
        }

        .settings__ico {
            content: url(../assets/cross.svg);
        }
    }
    img {
        width: 1.5rem;
        height: 1.5rem;
        z-index: 2;
        &:hover {
            filter: brightness(0.5);
        }
    }
    .dragging {
        z-index: 10;
    }
    &__header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
    }
    &__title {
        opacity: 0;
        font-weight: bold;
    }
    &__city {
        transition: 0.5s;
        padding: 0.5rem;
        margin: 0.5rem;
        background: $bg;
        display: flex;
        justify-content: space-between;
        align-content: center;
        user-select: none;
        color: $gray;

        >div {
            font-size: 1.2rem;
            align-items: center;
            display: flex;

            .Hamburger {
                margin-right: 0.5rem;
                cursor: grab;
            }
        }
    }
    &__hamburger {
        margin-right: 0.5rem;
        cursor: grab;
    }
    &__trash {
        width: 1.3rem;
        height: 1.4rem;
        cursor: pointer;
    }
    &__ico {
        cursor: pointer;
    }
    &__units {
        display: flex;
        padding: 4px 0;
        gap: 4px;
        align-items: end;
    }
    &__unit-f{
        &--active {
            color: #ff7979;
        }
    }
    &__unit-c{
        &--active {
            color:#2196F3;
        }
    }
    .dragging {
        transition: 0s !important;
        box-shadow: $shadow;
        z-index: 3 !important;
    }
}

.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 21px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ff7979;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 13px;
  width: 13px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(17px);
  -ms-transform: translateX(17px);
  transform: translateX(17px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

</style>