const API_URL = import.meta.env.VITE_API_URL;

interface RequestOptions<BodyType = undefined> {
  headers?: Record<string, string>;
  body?: BodyType;
}

interface ErrorResponse {
  error: string;
  message: string;
}

interface ApiResponse<T> {
  data: T;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T, BodyType = undefined>(
    endpoint: string,
    method: string,
    options: RequestOptions<BodyType> = {},
  ): Promise<ApiResponse<T>> {
    const { headers = {}, body } = options;

    const config: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, config);

      const data = (await response.json()) as T;

      if (!response.ok) {
        throw new Error(`Error: ${(data as ErrorResponse).message}`);
      }

      return { data }; // Wrap the parsed JSON in an object with a `data` property
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  public get<T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "GET", options);
  }

  public post<T, BodyType>(
    endpoint: string,
    body: BodyType,
    options?: RequestOptions<BodyType>,
  ): Promise<ApiResponse<T>> {
    return this.request<T, BodyType>(endpoint, "POST", { ...options, body });
  }

  public put<T, BodyType>(
    endpoint: string,
    body: BodyType,
    options?: RequestOptions<BodyType>,
  ): Promise<ApiResponse<T>> {
    return this.request<T, BodyType>(endpoint, "PUT", { ...options, body });
  }

  public delete<T>(
    endpoint: string,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "DELETE", options);
  }
}

const client = new ApiClient(API_URL);

export default client;
