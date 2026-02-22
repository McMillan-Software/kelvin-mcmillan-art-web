import { Original } from "./original"


export interface Giclee {
    paintingId: number,
    pageOrder: number,
    painting: Original,
    options: GicleeOption[]
}

export interface GicleeOption {
    id: number,
    paintingId: number,
    optionAttributes: GicleeOptionAttributes
}

export interface GicleeOptionAttributes {
    id: number,
    width: number,
    height: number,
    aspectRatio: string,
    price: number
}

export interface ValidGicleeOptions {
    paintingHasOption: boolean,
    attributes: GicleeOptionAttributes
}