import { useState, useEffect } from "react";
import { showToast, Toast } from "@raycast/api";

// Export the hook
export function useSearch() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    let isCancelled = false;
    const controller = new AbortController();

    async function fetchResults() {
      if (!searchTerm.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(
          `https://invt.app/search/${encodeURIComponent(searchTerm)}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`Search failed with status: ${response.status}`);
        }

        const data = await response.json();

        if (!isCancelled) {
          setResults(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (!isCancelled && err.name !== "AbortError") {
          setError(err.message);
          showToast({
            style: Toast.Style.Failure,
            title: "Search Error",
            message: err.message,
          });
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [searchTerm]);

  const search = (term: string) => {
    setSearchTerm(term);
  };

  return {
    isLoading,
    results,
    search,
    error,
    searchTerm,
  };
}