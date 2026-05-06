'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { 
  Author,
  AUTHORS,
  getUniqueAffiliations,
  getUniqueCountries,
  getUniqueCities,
  filterAuthors,
  sortAuthors,
  AUTHOR_COUNTS
} from '@/lib/authorsData';

export default function AuthorPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAffiliation, setSelectedAffiliation] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [showAffiliationFilter, setShowAffiliationFilter] = useState(true);
  const [showCountryFilter, setShowCountryFilter] = useState(true);
  const [showCityFilter, setShowCityFilter] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Get filter options from data
  const affiliations = useMemo(() => getUniqueAffiliations(), []);
  const countries = useMemo(() => getUniqueCountries(), []);
  const cities = useMemo(() => getUniqueCities(), []);

  // Filter and sort authors
  const filteredAuthors = useMemo(() => {
    return filterAuthors({
      search: searchTerm,
      affiliation: selectedAffiliation,
      country: selectedCountry,
      city: selectedCity
    });
  }, [searchTerm, selectedAffiliation, selectedCountry, selectedCity]);

  const sortedAuthors = useMemo(() => {
    return sortAuthors(filteredAuthors, sortBy as keyof Author, sortOrder);
  }, [filteredAuthors, sortBy, sortOrder]);

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedAffiliation('');
    setSelectedCountry('');
    setSelectedCity('');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-[#0f2d6b] mb-2" style={{ fontSize: "1.8rem", fontWeight: 700 }}>Browse Authors</h1>
          <p className="text-[#5a6a8a] text-sm">Discover researchers and their contributions to Advanced Materials Letters</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-40">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#0f2d6b] text-sm" style={{ fontWeight: 700 }}>Refine Results</h3>
                <button 
                  onClick={clearFilters}
                  className="text-[#c9a227] text-xs hover:underline"
                >
                  Clear all
                </button>
              </div>
              
              {/* Search */}
              <div className="mb-6">
                <label className="text-[#0f2d6b] text-xs mb-2 block" style={{ fontWeight: 600 }}>Search Authors</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Author name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20 focus:border-[#0f2d6b]"
                  />
                  <Search className="w-3 h-3 absolute left-3 top-1/2 -translate-y-1/2 text-[#5a6a8a]" />
                </div>
              </div>

              {/* Affiliation Filter */}
              <div className="mb-6">
                <button 
                  onClick={() => setShowAffiliationFilter(!showAffiliationFilter)}
                  className="flex items-center justify-between w-full text-[#0f2d6b] text-xs mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Affiliation
                  {showAffiliationFilter ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showAffiliationFilter && (
                  <div className="space-y-2">
                    <select
                      value={selectedAffiliation}
                      onChange={(e) => setSelectedAffiliation(e.target.value)}
                      className="w-full p-2 text-xs border border-border rounded focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20"
                    >
                      <option value="">All affiliations</option>
                      {affiliations.map((affiliation, index) => (
                        <option key={index} value={affiliation.name}>{affiliation.name}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Country Filter */}
              <div className="mb-6">
                <button 
                  onClick={() => setShowCountryFilter(!showCountryFilter)}
                  className="flex items-center justify-between w-full text-[#0f2d6b] text-xs mb-3"
                  style={{ fontWeight: 600 }}
                >
                  Country
                  {showCountryFilter ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showCountryFilter && (
                  <div className="space-y-2">
                    <select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full p-2 text-xs border border-border rounded focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20"
                    >
                      <option value="">All countries</option>
                      {countries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* City Filter */}
              {/* <div className="mb-6">
                <button 
                  onClick={() => setShowCityFilter(!showCityFilter)}
                  className="flex items-center justify-between w-full text-[#0f2d6b] text-xs mb-3"
                  style={{ fontWeight: 600 }}
                >
                  City
                  {showCityFilter ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showCityFilter && (
                  <div className="space-y-2">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full p-2 text-xs border border-border rounded focus:outline-none focus:ring-2 focus:ring-[#0f2d6b]/20"
                    >
                      <option value="">All cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div> */}

              {/* Results count */}
              <div className="pt-4 border-t border-border">
                <p className="text-[#5a6a8a] text-xs">
                  Showing {sortedAuthors.length} of {AUTHOR_COUNTS.total} authors
                </p>
              </div>
            </div>
          </div>

          {/* Main Content - Authors Table */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-[#0f2d6b] text-lg" style={{ fontWeight: 700 }}>Authors Directory</h2>
                  <div className="text-[#5a6a8a] text-sm">
                    {sortedAuthors.length} authors found
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-[#f0f4fb]">
                      <tr>
                        <th 
                          onClick={() => handleSort('name')}
                          className="px-6 py-4 text-left text-[#0f2d6b] text-xs cursor-pointer hover:bg-[#e8f1ff]"
                          style={{ fontWeight: 600 }}
                        >
                          Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          onClick={() => handleSort('article_count')}
                          className="px-6 py-4 text-left text-[#0f2d6b] text-xs cursor-pointer hover:bg-[#e8f1ff]"
                          style={{ fontWeight: 600 }}
                        >
                          No. Articles {sortBy === 'article_count' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        <th 
                          onClick={() => handleSort('affiliation')}
                          className="px-6 py-4 text-left text-[#0f2d6b] text-xs cursor-pointer hover:bg-[#e8f1ff]"
                          style={{ fontWeight: 600 }}
                        >
                          Affiliation {sortBy === 'affiliation' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                        {/* <th 
                          onClick={() => handleSort('city')}
                          className="px-6 py-4 text-left text-[#0f2d6b] text-xs cursor-pointer hover:bg-[#e8f1ff]"
                          style={{ fontWeight: 600 }}
                        >
                          City {sortBy === 'city' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th> */}
                        <th 
                          onClick={() => handleSort('country')}
                          className="px-6 py-4 text-left text-[#0f2d6b] text-xs cursor-pointer hover:bg-[#e8f1ff]"
                          style={{ fontWeight: 600 }}
                        >
                          Country {sortBy === 'country' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedAuthors.map((author, index) => (
                        <tr 
                          key={author.id}
                          className={`border-b border-border hover:bg-[#fafbff] cursor-pointer ${
                            index % 2 === 0 ? 'bg-white' : 'bg-[#fafbff]'
                          }`}
                        >
                          <td className="px-6 py-4">
                            <div className="text-[#0f2d6b] text-sm hover:underline" style={{ fontWeight: 600 }}>
                              {author.name}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[#3a4a6a] text-sm">{author.article_count}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[#3a4a6a] text-sm">{author.affiliation}</span>
                          </td>
                          {/* <td className="px-6 py-4">
                            <span className="text-[#3a4a6a] text-sm">{author.city || '—'}</span>
                          </td> */}
                          <td className="px-6 py-4">
                            <span className="text-[#3a4a6a] text-sm">{author.country || '—'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
              
              {sortedAuthors.length === 0 && (
                <div className="p-10 text-center">
                  <p className="text-[#5a6a8a] text-sm">No authors found matching your criteria.</p>
                  <button 
                    onClick={clearFilters}
                    className="text-[#0f2d6b] text-sm mt-2 hover:underline"
                  >
                    Clear filters to see all authors
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}