declare function FetchFunction(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response>;

export const getFetcher = async (): Promise<typeof FetchFunction> => {
  if (typeof fetch !== 'undefined') {
    return fetch as unknown as typeof FetchFunction;
  } else {
    const fetcher = await import('node-fetch');
    return fetcher.default as unknown as typeof FetchFunction;
  }
};
