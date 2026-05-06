import authorsData from './authors_data.json';

export interface Author {
  id: number;
  name: string;
  email?: string | null;
  orcid?: string | null;
  article_count: number;
  affiliation: string;
  country?: string | null;
  city?: string | null;
  department?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthorFilters {
  search?: string;
  affiliation?: string;
  country?: string;
  city?: string;
  department?: string;
}

export interface AuthorStats {
  total: number;
  byCountry: Record<string, number>;
  byAffiliation: Record<string, number>;
  byDepartment: Record<string, number>;
  topAuthors: Author[];
}

// Load and process real authors data (already deduplicated in source file)
export const AUTHORS: Author[] = authorsData.map((author: any) => ({
  id: author.id,
  name: author.name,
  email: author.email,
  orcid: author.orcid,
  article_count: author.article_count || 0,
  affiliation: author.affiliation || 'Research Institution',
  country: author.country,
  city: author.city,
  department: author.department,
  created_at: author.created_at,
  updated_at: author.updated_at
}));

// Generate unique values for filters
export const getUniqueAffiliations = (): { name: string; country: string; city: string; }[] => {
  const affiliationMap = new Map<string, { name: string; country: string; city: string; }>();
  
  AUTHORS.forEach(author => {
    if (author.affiliation && author.affiliation !== 'Research Institution') {
      const key = `${author.affiliation}-${author.country || ''}-${author.city || ''}`;
      if (!affiliationMap.has(key)) {
        affiliationMap.set(key, {
          name: author.affiliation,
          country: author.country || '',
          city: author.city || ''
        });
      }
    }
  });
  
  return Array.from(affiliationMap.values()).sort((a, b) => a.name.localeCompare(b.name));
};

export const getUniqueCountries = (): string[] => {
  const countries = new Set<string>();
  
  AUTHORS.forEach(author => {
    if (author.country) {
      countries.add(author.country);
    }
  });
  
  return Array.from(countries).sort();
};

export const getUniqueCities = (): string[] => {
  const cities = new Set<string>();
  
  AUTHORS.forEach(author => {
    if (author.city) {
      cities.add(author.city);
    }
  });
  
  return Array.from(cities).sort();
};

export const getUniqueDepartments = (): string[] => {
  const departments = new Set<string>();
  
  AUTHORS.forEach(author => {
    if (author.department) {
      departments.add(author.department);
    }
  });
  
  return Array.from(departments).sort();
};

// Filter authors based on criteria
export const filterAuthors = (filters: AuthorFilters): Author[] => {
  return AUTHORS.filter(author => {
    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      if (!author.name.toLowerCase().includes(searchTerm)) {
        return false;
      }
    }
    
    // Affiliation filter
    if (filters.affiliation && author.affiliation !== filters.affiliation) {
      return false;
    }
    
    // Country filter
    if (filters.country && author.country !== filters.country) {
      return false;
    }
    
    // City filter
    if (filters.city && author.city !== filters.city) {
      return false;
    }
    
    // Department filter
    if (filters.department && author.department !== filters.department) {
      return false;
    }
    
    return true;
  });
};

// Sort authors by different criteria
export const sortAuthors = (authors: Author[], sortBy: keyof Author, order: 'asc' | 'desc' = 'asc'): Author[] => {
  return [...authors].sort((a, b) => {
    let aValue: any = a[sortBy];
    let bValue: any = b[sortBy];
    
    // Handle null/undefined values
    if (aValue == null) aValue = '';
    if (bValue == null) bValue = '';
    
    // Handle string comparisons
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = (bValue as string).toLowerCase();
    }
    
    if (order === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

// Search authors
export const searchAuthors = (query: string): Author[] => {
  const searchTerm = query.toLowerCase();
  return AUTHORS.filter(author =>
    author.name.toLowerCase().includes(searchTerm) ||
    (author.affiliation && author.affiliation.toLowerCase().includes(searchTerm)) ||
    (author.country && author.country.toLowerCase().includes(searchTerm)) ||
    (author.city && author.city.toLowerCase().includes(searchTerm)) ||
    (author.department && author.department.toLowerCase().includes(searchTerm)) ||
    (author.email && author.email.toLowerCase().includes(searchTerm))
  );
};

// Get top authors by article count
export const getTopAuthors = (limit: number = 20): Author[] => {
  return AUTHORS
    .sort((a, b) => b.article_count - a.article_count)
    .slice(0, limit);
};

// Get authors by country
export const getAuthorsByCountry = (country: string): Author[] => {
  return AUTHORS.filter(author => author.country === country);
};

// Get authors by affiliation
export const getAuthorsByAffiliation = (affiliation: string): Author[] => {
  return AUTHORS.filter(author => author.affiliation === affiliation);
};

// Calculate statistics
const calculateStats = (): AuthorStats => {
  const countryCounts: Record<string, number> = {};
  const affiliationCounts: Record<string, number> = {};
  const departmentCounts: Record<string, number> = {};
  
  AUTHORS.forEach(author => {
    // Count by country
    if (author.country) {
      countryCounts[author.country] = (countryCounts[author.country] || 0) + 1;
    }
    
    // Count by affiliation (excluding generic ones)
    if (author.affiliation && author.affiliation !== 'Research Institution') {
      affiliationCounts[author.affiliation] = (affiliationCounts[author.affiliation] || 0) + 1;
    }
    
    // Count by department
    if (author.department) {
      departmentCounts[author.department] = (departmentCounts[author.department] || 0) + 1;
    }
  });
  
  return {
    total: AUTHORS.length,
    byCountry: Object.fromEntries(
      Object.entries(countryCounts).sort(([,a], [,b]) => b - a)
    ),
    byAffiliation: Object.fromEntries(
      Object.entries(affiliationCounts).sort(([,a], [,b]) => b - a)
    ),
    byDepartment: Object.fromEntries(
      Object.entries(departmentCounts).sort(([,a], [,b]) => b - a)
    ),
    topAuthors: getTopAuthors(10)
  };
};

export const AUTHOR_STATS = calculateStats();

// Helper function to get authors with real affiliations
export const getAuthorsWithRealAffiliations = (): Author[] => {
  return AUTHORS.filter(author => 
    author.affiliation && author.affiliation !== 'Research Institution'
  );
};

// Export counts for quick access
export const AUTHOR_COUNTS = {
  total: AUTHORS.length,
  withRealAffiliations: getAuthorsWithRealAffiliations().length,
  withEmail: AUTHORS.filter(author => author.email).length,
  withOrcid: AUTHORS.filter(author => author.orcid).length,
  uniqueCountries: getUniqueCountries().length,
  uniqueCities: getUniqueCities().length,
  uniqueAffiliations: getUniqueAffiliations().length,
  uniqueDepartments: getUniqueDepartments().length
};