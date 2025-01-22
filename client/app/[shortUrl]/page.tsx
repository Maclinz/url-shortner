"use client";
import React, { useEffect, useState } from "react";

interface Props {
  params: {
    shortUrl: string;
  };
}

function Page({ params }: Props) {
  const { shortUrl } = params;

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (shortUrl) {
      const redirectToUrl = () => {
        try {
          window.location.href = `http://localhost:5000/api/v1/${shortUrl}`;
        } catch (err) {
          setError("There was an error while redirecting.");
          setIsLoading(false);
        }
      };

      // redirecting
      redirectToUrl();
    }
  }, [shortUrl]);

  return (
    <div>
      {isLoading ? (
        <h1>Loading...</h1>
      ) : error ? (
        <h1>{error}</h1>
      ) : (
        <h1>Redirecting...</h1>
      )}
    </div>
  );
}

export default Page;
