declare module 'gray-matter' {
  // Minimal typing for the parts we use in this project
  export interface GrayMatterFile<TData = Record<string, any>> {
    content: string
    data: TData
    isEmpty?: boolean
    excerpt?: string
    orig?: string
  }

  export default function matter<TData = Record<string, any>>(input: string, options?: any): GrayMatterFile<TData>
}
