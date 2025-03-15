import { useState } from "react";
import { toast } from "sonner";

const UseFetch = (cb) => {
    const [data, setData] = useState(undefined);
    const  [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fn = async (...args) => {
        setLoading(true);
        setError(null);

        try {

            const response = await cb(...args);
            setData(response);
            setLoading(false);
            
        } catch (error) {
            setError(error);
            toast.error(error.message);
            
        }
        finally{
            setLoading(false)
        }
    }

    return {fn, data, loading, error,setData};
   
    
    
}

export default UseFetch