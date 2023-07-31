import { ChangeEvent, useEffect, useState } from 'react'
import { optionType } from './types'
import Search from './components/Search'

const App = (): JSX.Element => {
  const [term, setTerm] = useState<string>('')
  const [options, setOptions] = useState<[]>([])
  const [city, setCity] = useState<optionType | null>(null)

  const getSearchOptions = (value: string) => {
    fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${value.trim()}&limit=${5}&appid=${
        process.env.REACT_APP_API_KEY
      }`
    )
      .then((res) => res.json())
      .then((data) => setOptions(data))
  }

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.trim()
    setTerm(value)
    if (value === '') return
    getSearchOptions(value)
  }

  const getForecast = (city: optionType) => {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&units=metric&appid=${process.env.REACT_APP_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => console.log({ data }))
  }

  const onOptionSelect = (option: optionType) => {
    setCity(option)
  }

  const onSubmit = () => {
    if (!city) return
    getForecast(city)
  }

  useEffect(() => {
    if (city) {
      setTerm(city.name)
      setOptions([])
    }
  }, [city])

  return (
    <main className="flex justify-center items-center bg-gradient-to-br from-sky-400 via-rose-400 to-lime-400 h-[100vh] w-full">
      <Search
        term={term}
        options={options}
        onInputChange={onInputChange}
        onOptionSelect={onOptionSelect}
        onSubmit={onSubmit}
      />
    </main>
  )
}

export default App
