import { useState } from 'react'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Search, Filter, X, ArrowUpDown } from 'lucide-react'

interface FilterState {
  searchTerm: string
  targetAudience: string
  courseLength: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface ProgramFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onReset: () => void
}

export function ProgramFilters({ filters, onFiltersChange, onReset }: ProgramFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterState, value: string | 'asc' | 'desc') => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const hasActiveFilters = filters.searchTerm || filters.targetAudience || filters.courseLength || filters.sortBy !== 'none'

  const activeFilterCount = [
    filters.searchTerm,
    filters.targetAudience,
    filters.courseLength,
    filters.sortBy !== 'none' ? filters.sortBy : null
  ].filter(Boolean).length

  return null
}