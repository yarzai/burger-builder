import { useState, useEffect } from "react";

export default (httpClient) => {
  const [error, setError] = useState(null);

  const reqInterceptore = httpClient.interceptors.request.use((request) => {
    setError(null);
    return request;
  });

  const resInterceptor = httpClient.interceptors.response.use(
    (response) => response,
    (err) => {
      setError(err);
    }
  );

  useEffect(() => {
    return () => {
      httpClient.interceptors.request.eject(reqInterceptore);
      httpClient.interceptors.response.eject(resInterceptor);
    };
  }, []);

  const errorConfirmdeHandler = () => {
    setError(null);
  };

  return [error, errorConfirmdeHandler];
};
