
export interface Config {
    name?: string,
    expiredTime?: number,
    enableLog?: boolean,
    strictLoading?: boolean,
    DefaultLoading?: any,
    DefaultError?: any,
}

export interface LoadOptions {
    format?: any,
    forceUpdate?: boolean,
    params?: any,
    id?: string
}

export interface ConnectOptions {
    Loading?: any,
    Error?: any
}

export interface ProvideOptions {
    store?: any,
    reducers?: any
}
