import { SearchItem } from "./general"

export interface BrandRequest{
    accSystem: number
    search?:string
    page:number
    lastId:number
    usrPerm:boolean
}
/*export interface Brand{
    id:string,
    text:string
}*/

export interface BrandState extends BrandRequest{
    brands:SearchItem[]
    setField: (field: keyof BrandRequest, value: any) => void;
    setBrands:(brands:Brand[]) =>void
    
}