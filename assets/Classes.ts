
export class City {
    name:string;
    lat: number;
    lon: number;
    constructor(element:any) {
        if (element.country) {
            this.name = `${element.name}, ${element.country}`;
        } else {
            this.name = element.name;
        }
        this.lat = element.lat || element.coord.lat;
        this.lon = element.lon || element.coord.lon;
    }
}

enum Direction{
    N=0,
    NNE=1,
    NE=2,
    ENE=3,
    E=4,
    ESE=5,
    SE=6,
    SSE=7,
    S=8,
    SSW=9,
    SW=10,
    WSW=11,
    W=12,
    WNW=13,
    NW=14,
    NNW=15,
}

function calculeteIndex()  {
    if (window) {
        var localStorage: any = window.localStorage.getItem('locations');
        var index:number = localStorage == undefined || localStorage == null ? 0 : window.localStorage.getItem('locations')?.length as number;
        return (): number =>  {
            index++;
            return index -1;
        };
    }
}
const newindex = calculeteIndex();
export class Weather {
    name:string;
    index:number;
    imgSrc:string;
    temperature: string;
    temperatureF:string;
    feelsLike:number;
    feelsLikeF:string;
    description:string;
    windType:string;
    wind:{
        speed:number;
        deg:number;
        direction:string;
    };
    pressure:number;
    humidity:number;
    dewPoint:number;
    visibility:number;
    updateTime:string;
    coord: {
        lat: number;
        lon: number;
    }

    constructor(e:any) {
        this.name = `${e.name}, ${e.sys.country}`;
        this.index = newindex();
        this.imgSrc = `http://openweathermap.org/img/wn/${e.weather[0].icon}@2x.png`
        this.temperature = e.main.temp.toFixed(1);
        this.temperatureF = ((e.main.temp * (9 / 5)) + 32).toFixed(1);
        this.feelsLike = e.main.feels_like.toFixed(1);
        this.feelsLikeF = ((e.main.feels_like* (9 / 5)) + 32).toFixed(1) ;
        this.description = e.weather[0].description;
        this.windType = "";
        var speed = e.wind.speed /1000 * 3600
        switch (true) {
            case speed < 2:
                this.windType = "calm"
                break;
            case speed < 5:
                this.windType = "Light air"
                break;
            case speed < 11:
                this.windType = "Light breeze"
                break;
            case speed < 19:
                this.windType = "Gentle breeze"
                break;
            case speed < 28:
                this.windType = "Moderate breeze"
                break;
            case speed < 38:
                this.windType = "Fresh breeze"
                break;
            case speed < 49:
                this.windType = "Strong breeze"
                break;
            case speed < 61:
                this.windType = "High wind"
                break;
            case speed < 74:
                this.windType = "Gale"
                break;
            case speed < 88:
                this.windType = "Strong gale"
                break;
            case speed < 102:
                this.windType = "Storm"
                break;
            case speed < 117:
                this.windType = "Violent storm"
                break;
            default:
                this.windType = "Hurricane force"
    

        }
        this.wind = {
            speed: e.wind.speed.toFixed(1),
            deg: e.wind.deg,
            direction: Direction[Math.round((e.wind.deg - 22.5 ) / 22.5)]
        };
        this.pressure = e.main.pressure;
        this.humidity = e.main.humidity;
        var f = (17.27 * e.main.temp)/(237.7+e.main.temp)+Math.log(e.main.humidity/100)
        this.dewPoint = Math.round((237.7*f)/(17.27-f));
        this.visibility = e.visibility / 1000;
        this.updateTime = (new Date()).toJSON();
        this.coord = e.coord;
    }
}