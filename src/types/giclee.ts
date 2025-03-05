import { original } from "./original"

// export allows this to be used elsewhere other than just this file
export interface giclee {
    painting_id: number,
    page_order: number,
    painting: original,
    options: option[]  
}

export interface option {
    id: number,
    painting_id: number,
    option_attributes: option_attributes
}

export interface option_attributes {
    id: number,
    width: number,
    height: number,
    aspect_ratio: string,
    price: number
}