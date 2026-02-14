import { original } from "./original"

// export allows this to be used elsewhere other than just this file
export interface giclee {
    paintingId: number,
    pageOrder: number,
    painting: original, 
    options: option[]  
}
  
export interface option {
    id: number,
    paintingId: number,
    optionAttributes: optionAttributes
}

export interface optionAttributes {
    id: number,
    width: number,
    height: number,
    aspectRatio: string,
    price: number
}

export interface validGicleeOptions {
    paintingHasOption: boolean, 
    attributes: optionAttributes
}