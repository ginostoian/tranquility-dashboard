const body = document.querySelector('body')
// top display variables
const bitcoinDisplay = document.querySelector('.bitcoin-display')
const ethDisplay = document.querySelector('.eth-display')
const weatherDisplay = document.querySelector('.weather-info')
// middle display variables
const timeDisplay = document.querySelector('.time-display')
const greetingDisplay = document.querySelector('.greeting')
const usernameDisplay = document.querySelector('.username')
// bottom display variables
const authorDisplay = document.querySelector('.author-display')
const quoteDisplay = document.querySelector('.quote-display')
const usernameInput = document.querySelector('#username-input')
const usernameSubmit = document.querySelector('.username-submit')
// other variables
const myStorage = window.localStorage
let time
let lat
let long

function geoSuccess(position) {
    lat = position.coords.latitude
    long = position.coords.longitude
}

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
        geoSuccess(position)
    })
} else {
    alert('Please allow Geolocation to display the weather')
}

function setUsername() {
    const username = usernameInput.value
    // save username in local storage to be fetched afterwards and diplayed
    myStorage.setItem('username', username)
    usernameDisplay.textContent = myStorage.getItem('username')
    usernameInput.value = ''
}

function displayGreeting(currentTime) {
    const hour = currentTime.getHours()
    if (hour < 12) {
        greetingDisplay.textContent = 'Good morning'
    } else if (hour < 18) {
        greetingDisplay.textContent = 'Good afternoon'
    } else {
        greetingDisplay.textContent = 'Good evening'
    }
}

function getTime() {
    time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    timeDisplay.textContent = time
}

async function generateDashboard() {
    getTime()
    displayGreeting(new Date())
    if (myStorage.getItem('username')) {
        usernameDisplay.textContent = myStorage.getItem('username')
    }
    try {
        const response = await fetch('https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature')
        const data = await response.json()
        body.style.backgroundImage = `url(${data.urls.full})`
        authorDisplay.innerHTML = `<a href='${data.user.portfolio_url}' target='_blank'>${data.user.name}</a>`
    } catch (err) {
        alert('Unsplash API has not responded. Please refresh the page!')
    }

    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin')
        const data = await response.json()
        bitcoinDisplay.textContent = `${data.name} - £${data.market_data.current_price.gbp}`
    } catch (err) {
        alert('CoinGecko API has not responded. Please refresh the page!')
    }

    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/ethereum')
        const data = await response.json()
        ethDisplay.textContent = `${data.name} - £${data.market_data.current_price.gbp}`
    } catch (err) {
        alert('CoinGecko API has not responded. Please refresh the page!')
    }

    try {
        const response = await fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${lat}&lon=${long}&units=metric`)
        const data = await response.json()
        weatherDisplay.innerHTML = `
            <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
            <div>
                <p>${Math.ceil(data.main.temp)} ºC</p>
                <p>${data.name}</p>
            </div>
        `
    } catch (err) {
        weatherDisplay.innerHTML = 'Open Weather API has not responded. Please refresh'
    }

    try {
        const response = await fetch('https://api.quotable.io/random?maxLength=80')
        const data = await response.json()
        quoteDisplay.textContent = data.content
    } catch (error) {
        alert('Quotable API has not responded')
    }
}

usernameSubmit.addEventListener('click', setUsername)
generateDashboard()
setInterval(getTime, 1000)













