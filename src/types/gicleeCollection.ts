import { Giclee } from "./giclee"


export interface GicleeCollection {
    id: number,
    title: string,
    description: string | null,
    orderNumber: number,
    giclees: Giclee[]
}

export interface GicleeCollectionSummary {
    id: number,
    title: string
}

export interface GicleeDetail {
    giclee: Giclee,
    collections: GicleeCollectionSummary[]
}
