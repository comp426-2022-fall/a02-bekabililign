#!/usr/bin/env node

import fetch from 'node-fetch';
import minimist from 'minimist';
import moment from "moment-timezone";


const args = minimist(process.argv.slice(2))
console.log(args)

// default action
if (args.h) {
    console.log(`Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.`)

    process.exit(0)
}

if (args.z) {
    var timezone = args.z
} else {
    var timezone = moment.tz.guess()
}

if (args.n) {
    var latitude = args.n
} if (args.s) {
    var latitude = '-' + args.s
} if (args.e) {
    var longitude = args.e
} if (args.w) {
    var longitude = '-' + args.w
}

if (args.d != 'undefined') {
    var days = args.d
} else {
    var days = 1
}

if (args.j && !(args.n || args.s || args.e || args.w)) {
    var latitude = '35'
    var longitude = '-79'
}

const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone);
// const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_hours,windspeed_10m_max&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=' + timezone);
const data = await response.json();

if (args.j) {
    console.log(data)
    process.exit(0)
}

if (days == 0) {
    if (data.daily.precipitation_hours[days] == 0) {
        console.log("You will not need your galoshes today.")
    }
    else {
        console.log("You might need your galoshes today.")
    }
} else if (days > 1) {
    if (data.daily.precipitation_hours[days] == 0) {
        console.log("You will not need your galoshes in " + days + " days.")
    }
    else {
        console.log("You might need your galoshes in " + days + " days.")
    }
} else {
    if (data.daily.precipitation_hours[days] == 0) {
        console.log("You will not need your galoshes tomorrow.")
    }
    else {
        console.log("You might need your galoshes tomorrow.")
    }
}
