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
    setField: (field: string , value: string | number) => void;
    setBrands:(brands:Brand[]) =>void
    
}