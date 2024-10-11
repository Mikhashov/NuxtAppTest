import { defineEventHandler, readBody } from 'h3'
import swisseph from 'swisseph'
import axios from 'axios'
import path from 'path'

// Установите путь для эфемерид
swisseph.swe_set_ephe_path(path.join(process.cwd(), 'server', 'ephemeris'))

export default defineEventHandler(async (event) => {
  const { name, birthDate, birthTime, birthPlace } = await readBody(event)

  try {
    // Геокодирование места рождения
    const geocodeResponse = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: birthPlace,
        format: 'json',
        limit: 1,
      },
    })

    if (!geocodeResponse.data.length) {
      return { error: 'Место рождения не найдено' }
    }

    const { lat, lon } = geocodeResponse.data[0]

    // Парсинг даты и времени
    const [year, month, day] = birthDate.split('-').map(Number)
    const [hour, minute] = birthTime.split(':').map(Number)

    // Расчёт юлианской даты
    const julday = swisseph.swe_julday(year, month, day, hour + minute / 60, swisseph.SE_GREG_CAL)

    // Расчёт позиций планет
    const planetIds = [
      swisseph.SE_SUN,
      swisseph.SE_MOON,
      swisseph.SE_MERCURY,
      swisseph.SE_VENUS,
      swisseph.SE_MARS,
      swisseph.SE_JUPITER,
      swisseph.SE_SATURN,
      swisseph.SE_URANUS,
      swisseph.SE_NEPTUNE,
      swisseph.SE_PLUTO,
    ]

    const planets = []

    for (const planetId of planetIds) {
      const result = await new Promise((resolve, reject) => {
        swisseph.swe_calc_ut(julday, planetId, swisseph.SEFLG_SWIEPH, (res, err) => {
          if (err) {
            reject(new Error(err))
          } else {
            resolve(res)
          }
        })
      })

      planets.push({
        name: swisseph.swe_get_planet_name(planetId),
        longitude: result.longitude,
      })
    }

    // Расчёт домов
    const housesResult = await new Promise((resolve, reject) => {
      swisseph.swe_houses(julday, Number(lat), Number(lon), 'P', (res, err) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(res)
        }
      })
    })

    const houses = housesResult.house.map((longitude, index) => ({
      house: index + 1,
      longitude,
    }))

    return {
      name,
      chartData: {
        planets,
        houses,
      },
    }
  } catch (error) {
    console.error('Ошибка при расчёте натальной карты:', error)
    return { error: 'Ошибка при расчёте натальной карты' }
  }
})
