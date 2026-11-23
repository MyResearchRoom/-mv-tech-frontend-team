import { useEffect, useState } from "react";

const useDebounce=(value,delay=500)=>{
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(()=>{
        const handleTimeOut =setTimeout(()=>{
            setDebouncedValue(value);
        },delay);
        return ()=>clearTimeout(handleTimeOut);

    },[value,delay])
    return debouncedValue;
}

export default useDebounce;