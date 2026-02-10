export interface editPainting {
    id: number;
    title: string;
    location?: string;
    creationDate: string | null; 
    type: string;
    width: number;
    height: number;
    sold: boolean;
    framed?: boolean;
    giclee: boolean;
    price: number;
    info: string;
    aspectRatio?: string;
    galleryName?: string;
    galleryLink?: string;
    imagePath?: string;
    pages?: string[];
}
