"use client";

import type { Photo } from "@/data/photos";
import { speciesLabels } from "@/data/photos";
import {
  emptyPhotoFilters,
  getPhotoFilterOptions,
  hasActiveFilters,
  type PhotoFilterState,
} from "@/lib/photo-filters";

interface PhotoFiltersProps {
  photos: Photo[];
  filters: PhotoFilterState;
  resultCount: number;
  onChange: (filters: PhotoFilterState) => void;
}

const selectClass =
  "appearance-none rounded-none border border-white/10 bg-smoke/40 px-3 py-2 pr-8 font-sans text-xs text-ivory outline-none transition-colors focus:border-gold/60";

export default function PhotoFilters({
  photos,
  filters,
  resultCount,
  onChange,
}: PhotoFiltersProps) {
  const options = getPhotoFilterOptions(photos);
  const active = hasActiveFilters(filters);

  function update<K extends keyof PhotoFilterState>(
    key: K,
    value: PhotoFilterState[K]
  ) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-col gap-4 border border-white/5 bg-smoke/20 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative">
          <span className="sr-only">Filter by species</span>
          <select
            value={filters.species}
            onChange={(e) =>
              update("species", e.target.value as PhotoFilterState["species"])
            }
            className={selectClass}
            aria-label="Filter by species"
          >
            <option value="all">All species</option>
            {options.species.map((species) => (
              <option key={species} value={species}>
                {speciesLabels[species].label}
              </option>
            ))}
          </select>
        </label>

        <label className="relative">
          <span className="sr-only">Filter by location</span>
          <select
            value={filters.location}
            onChange={(e) => update("location", e.target.value)}
            className={selectClass}
            aria-label="Filter by location"
          >
            <option value="all">All locations</option>
            {options.locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </label>

        {options.years.length > 0 && (
          <label className="relative">
            <span className="sr-only">Filter by year</span>
            <select
              value={filters.year}
              onChange={(e) => update("year", e.target.value)}
              className={selectClass}
              aria-label="Filter by year"
            >
              <option value="all">All years</option>
              {options.years.map((year) => (
                <option key={year} value={String(year)}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-4">
        <p className="font-sans text-[10px] uppercase tracking-widest text-mist/70">
          {resultCount} {resultCount === 1 ? "photo" : "photos"}
        </p>
        {active && (
          <button
            type="button"
            onClick={() => onChange(emptyPhotoFilters)}
            className="font-sans text-[10px] uppercase tracking-widest text-gold transition-colors hover:text-ivory"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
