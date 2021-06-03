import {useState, useCallback, useEffect} from "react";

export const useFetch = <T, >(url: string, options: any, initialState: T): 
{ response: T; error: string; loading: boolean; endpoint: string; sendRequest: (updatedOptions: any, updatedEndpoint?: string) => Promise<any>; } => {
    const [response, setResponse] = useState<T>(initialState);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [endpoint, updateEndpoint] = useState(url);

    const sendRequest = useCallback(async (updatedOptions: any, updatedEndpoint: string = "") => {
      setLoading(true);

      let requestEndpoint = endpoint;
      if(updatedEndpoint !== "")
      {
        updateEndpoint(updatedEndpoint);
        requestEndpoint = updatedEndpoint;
      }

      try {
        const requestOptions = {...options, ...updatedOptions}
        const responseData = await fetch(requestEndpoint, requestOptions);
        const responseJson = await responseData.json();
        setResponse(responseJson);        
        setLoading(false);
        return responseJson;
      } catch (error) {
        console.log(error);
        setError(error);
        setLoading(false);
        return error;
      }
    }, [endpoint, options]);

    useEffect(() => {

    }, [response, endpoint])

    return {response, error, loading, endpoint, sendRequest};
}