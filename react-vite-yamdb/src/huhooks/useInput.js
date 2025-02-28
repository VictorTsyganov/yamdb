import { useState } from "react";

export default function useInput(defVal = '') {
    const [value, setValue] = useState(defVal)
     return {
        value,
        onClear: () => {setValue('')},
        onSetValue:(val) => {setValue(val)},
        onChange: (event) => {
         setValue(event.target.value)
        }
     }
}