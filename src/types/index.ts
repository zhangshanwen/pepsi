export interface paginationType {
    total: number,
    page_index: number,
    page_size: number,
    page_size_array: Array<number>,
    layout: string,
    sort: boolean,
    order: string,
    loading: string
}

export interface permissionType {
    [key: string]: any
}
