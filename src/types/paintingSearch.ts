export type PaintingSearchParams = {
    q?: string;             // Partial match (LIKE)
    type?: string;          // Exact match
    minWidth?: number;      // Lower bound
    maxWidth?: number;      // Upper bound
    minHeight?: number;     // Lower bound
    maxHeight?: number;     // Upper bound
    sold?: boolean;         // Filter by sold status
    framed?: boolean;       // Filter by framed status
    giclee?: boolean;       // Filter by giclee status
    minPrice?: number;      // Lower bound
    maxPrice?: number;      // Upper bound
    
    // Pagination
    page?: number;          // Page number
    limit?: number;         // Number of results per page
  };