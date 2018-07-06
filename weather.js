getWeather(); // get weather saved in localstorage, if any.

function getData() // Creates url from searchinput.
{
	let searchTerm = document.getElementById("search").value; 
    let url ="http://api.apixu.com/v1/current.json?key=[APIKEY]&q="+ searchTerm;

        if (searchTerm == "") // checks if searchfield is empty - display error message.
        {
            document.getElementById("errorMessage").innerHTML = ("Write a city, please.");
        }
        else
        {
            document.getElementById("errorMessage").innerHTML = ""; // clear error message.
            create(url);
        }
}

function create(url)
{
    fetch(url)
    .then(res => res.json())
    .then((res) => {

        if (res.error !== undefined) // check if error excists. city not found.
        {
            document.getElementById("errorMessage").innerHTML = ("City not found");
        }
        else // if not create weather div.
        {
            const iconCode = res.current.condition.code;
            const imageSrc = getIcon(iconCode);// get the icon.
            const cityId =  res.location.name;
            let cityCountry =  res.location.name + ", " + res.location.country;
             // Check length of string (country and city), if > 15 show only ... after the first 15.
            if(cityCountry.length > 15) 
            {
                cityCountry = cityCountry.substring(0,14)+ "...";
            }
            const temperature = res.current.temp_c;

            const weatherWrapper = document.createElement("div");
            weatherWrapper.setAttribute("class", "weather-wrapper");
            weatherWrapper.setAttribute("id", cityId);

            const imgWrapper = document.createElement("div");
            imgWrapper.setAttribute("class", "img-wrapper");
   
            const img = document.createElement("img");
            img.setAttribute("src", imageSrc);
            img.setAttribute("class", "imageSrc");
            imgWrapper.appendChild(img);
            weatherWrapper.appendChild(imgWrapper);

            const info = document.createElement("div");
            info.setAttribute("class", "info-wrapper");
            const tag = document.createElement("p");
            const temp = temperature;
            const textNode = document.createTextNode(temp);
            tag.appendChild(textNode);
            info.appendChild(tag);
  
            const city = document.createElement("h3"); 
            const text = document.createTextNode(cityCountry);
            city.appendChild(text);
            info.appendChild(city);
            weatherWrapper.appendChild(info);

            const btnWrapper = document.createElement("div");
            btnWrapper.setAttribute("class", "btn-wrapper");
            const btnShadow = document.createElement("div");
            btnShadow.setAttribute("class", "btnShadow");
            const btn = document.createElement("input");
            btn.setAttribute("type", "button");
            btn.setAttribute("value", "x");
            btn.setAttribute("class", "btn");
            btn.onclick = function() {deleteWeather(cityId);} 

            btnShadow.appendChild(btn);
            btnWrapper.appendChild(btnShadow);
            weatherWrapper.appendChild(btnWrapper);
            document.getElementById("allWeathers").appendChild(weatherWrapper);

            saveWeather(cityId); // save in localstorage.
        }
    })
}

function saveWeather(cityId)
{
    // if there`s no cities - create array with cityId. Stringify and save in localstorage.
    if (localStorage.getItem("cities") === null) 
    {
        let citiesArray = [cityId];
        localStorage.setItem("cities", JSON.stringify(cityId));
    }
    else 
    /* ..if there are cities, get the cities, parse and if cityId not icluded, 
     * push the cityId, stringify and save. 
     */
    {
        let cities = localStorage.getItem("cities");
        let citiesArr = JSON.parse(cities);

        if (citiesArr.includes(cityId) === false)
        {
            citiesArr.push(cityId);
            localStorage.setItem("cities", JSON.stringify(citiesArr));
        }
    }     
}    

function getWeather()
{
    /* To display the previously saved cities from localstorage. 
     * Get, parse, if there are no cities - error message.
     */
    let weather = localStorage.getItem("cities");
    let theWeather = JSON.parse(weather);

    if (theWeather == null)
    {
        console.log("No cities found in Localstorage");
    }
    else
    {
        // ..else for each city from localstorage set a new url and then create the div from res in create(url).
        theWeather.forEach(city => {
            let url ="http://api.apixu.com/v1/current.json?key=[APIKEY]&q="+ city;
            create(url);   
            })
    }
}

function deleteWeather(cityId){
    // remove div where cityId.
    let removeDiv = document.getElementById(cityId);
    removeDiv.remove();  
    /* Remove from Localstorage by getting the cities, parse. if .length > 0 - Creating a new array filled 
     * with every city that isn´t the cityId. Then saving the new array in localstorage. 
     * else (last city in array) - saving the new empty array in localstorage.
     */ 
    let city = localStorage.getItem("cities");
    let cityArray = JSON.parse(city);

    let newArray = [];

    cityArray.forEach(city => {
        if (city !== cityId && cityArray.length > 0)
        {
            newArray.push(city);
            localStorage.setItem("cities", JSON.stringify(newArray));
        }
        else
        {
            localStorage.setItem("cities", JSON.stringify(newArray));
        }
    })    
}

function getIcon(iconCode)
{
    switch (iconCode){
        case 1000: // Sunny
        icon = "Images/sun.svg";
        break;
        case 1003: // Partly cloudy
        icon = "Images/sunClouds.svg";
        break;
        case 1006: // Cloudy
        icon = "Images/clouds.svg";
        break;
        case 1009: // Overcast
        icon = "Images/overcast.svg";
        break;
        case 1087: // Thundery outbreaks possible
        case 1273: // Patchy light rain with thunder
        case 1276: // Moderate or heavy rain with thunder
        case 1282: // Moderate or heavy snow with thunder
        icon = "Images/thunder.svg";
        break;
        case 1030: // Mist
        case 1135: // fog
        case 1147: // freezing fog
        icon = "Images/fog.svg";
        break;
        case 1063: // Patchy rain possible
        case 1150: // Patchy light drizzle
        case 1153: // Light drizzle
        case 1168: // freezing drizzle
        case 1072: // Patchy freezing drizzle possible
        case 1180: // Patchy light rain
        case 1183: // Light rain
        case 1186: // Moderate rain at times
        case 1189: // Moderate rain
        case 1198: // Light freezing rain.
        case 1204: // Light sleet
        case 1240: // Light rain showers
        case 1249: // light sleet showers
        icon = "Images/lightRain.svg";
        break;
        case 1171: // Heavy freezing drizzle
        case 1192: // Heavy rain at times
        case 1195: // Heavy rain
        case 1201: // Moderate or heavy freezing rain
        case 1207: // Moderate or heavy sleet
        case 1243: // Moderate or heavy rainshowers
        case 1246: // Torrential rainshower
        case 1252: // Moderate or heavy sleet showers
        icon = "Images/heavyRain.svg";
        break;
        case 1066: // Patchy snow possible
        case 1069: // Patchy sleet possible
        case 1210: // Patchy light snow
        case 1213: // Light snow
        case 1216: // Patchy moderate snow
        case 1219: // Moderate snow
        case 1255: // Light snow showers
        case 1279: // Patchy light snow with thunder
        icon = "Images/lightSnow.svg";
        break;
        case 1114: // Blowing snow
        case 1117: // Blizzard
        case 1222: // Patchy heavy snow
        case 1225: // heavy snow
        case 1258: // Moderate or heavy snow showers
        icon = "Images/heavySnow.svg";
        break;
        case 1261: // Light showers of ice pellets
        case 1264: // Moderate or heavy showers of Ice pellets
        case 1237: // Ice pellets
        icon = "Images/hail.svg";
        break;
    }
    return icon;
}
