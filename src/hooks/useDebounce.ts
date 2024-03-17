import React, {useState, useEffect} from 'react';

export const useDebounce = (initValue : string, time : number) => {

  const [debounceValue, setDebounceValue] = useState(initValue)

  useEffect(() => {
    const debounce = setTimeout(() => {
      if(/^[a-zA-ZА-Яа-я]+$/.test(initValue)){
        setDebounceValue(initValue)
      }
    }, time)
    return () => {
      clearTimeout(debounce)
    }
  }, [initValue])

  return debounceValue
}