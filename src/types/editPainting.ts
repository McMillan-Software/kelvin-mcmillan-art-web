export interface editPainting {
    id: number;
    title: string;
    location?: string;
    type: string;
    width: number;
    height: number;
    sold: boolean;
    framed?: boolean;
    giclee: boolean;
    price: number;
    info: string;
    aspect_ratio?: string;
    galleryName?: string;
    galleryLink?: string;
    image_path?: string;
    pages?: string[];
}