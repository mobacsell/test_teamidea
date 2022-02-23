'use strict';

//Чебоксары, latitude: 56.1324, longitude: 47.2025;
//Скрипт необходимо подключать к файлу index.html через тег <script src='путь до скрипта'></script> в теге <body></body>

getResulRequest('https://api.openweathermap.org/data/2.5/onecall?lat=56.1324&lon=47.2025&units=metric&exclude=current,minutely,hourly,alerts&appid=fb543e7c2d244c9e272c837a8642961e')

function getResulRequest(url)   {
//Функция отправляет API AJAX-запрос для получения данных

    const xhr = new XMLHttpRequest();

    xhr.open('GET', url, true);
    xhr.send();

    //Реагируем на событие - ошибка при выполнении запроса:
    xhr.addEventListener('error', () => {
        console.log('Ошибка соединения. Попробуйте позже.');
    });

    //Реагируем на событие - получен ответ на запрос:
    xhr.addEventListener('load', () => {
        const result = JSON.parse(xhr.response).daily;
        getMaxDurationDay(result);
        console.log(`Минимальная разница между "ощущаемой" и фактической температурой ночью за ближайшие 8 дней = ${getMinDifferentTemp(result)[0]} градуса цельсия, ${getMinDifferentTemp(result)[1]}`);
        console.log(`Максимальная продолжительность светового дня за ближайшие 5 дней = ${getMaxDurationDay(result)[0]} ч. ${getMaxDurationDay(result)[1]} мин. ${getMaxDurationDay(result)[2]} сек., ${getMaxDurationDay(result)[3]}`);
    });

}


function getMinDifferentTemp(apiResult)  {
//Функция определяет день с минимальной разницей между "ощущаемой" и фактической температурой ночью за ближайшие 8 дней, включая текущий.
    
    let tempDiff;
    let day;

    //Перебираем методом forEach элементы массива (8 дней)
    apiResult.forEach((value, key) => {
        if (key === 0)  {
            tempDiff = Math.abs(value.temp.night - value.feels_like.night).toFixed(2);
            day = new Date(value.dt * 1000).toLocaleDateString();
        } else if(tempDiff > Math.abs(value.temp.night - value.feels_like.night)) {
            tempDiff = Math.abs(value.temp.night - value.feels_like.night).toFixed(2);
            day = new Date(value.dt * 1000).toLocaleDateString();
        } 
    });

    return [tempDiff, day];
}


function getMaxDurationDay(apiResult)   {
//Функция определяет день с максимальной продолжительностью дня за ближайшие 5 дней, включая текущий.
    
    let timeDiff;
    let day;
    let hours;
    let minutes;
    let seconds;

    //Перебираем циклом for элементы массива (5 дней)
    for(let key = 0; key <= 4; key++)   {
        if (key === 0)  {
            timeDiff = apiResult[key].sunset - apiResult[key].sunrise;
            day = new Date(apiResult[key].dt * 1000).toLocaleDateString();
        } else if(timeDiff < (apiResult[key].sunset - apiResult[key].sunrise)) {
            timeDiff = apiResult[key].sunset - apiResult[key].sunrise;
            day = new Date(apiResult[key].dt * 1000).toLocaleDateString();
        } 
    }

    hours = Math.floor(timeDiff / 3600);
    minutes = Math.floor((timeDiff % 3600) / 60);
    seconds = (timeDiff % 3600) % 60;

    return [hours, minutes, seconds, day];
}

