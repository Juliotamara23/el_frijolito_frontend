import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import type { SelectChangeEvent } from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

interface NominasFiltersProps {
  onSearch: (searchTerm: string, searchField: string) => void;
}

export function NominasFilters({ onSearch }: NominasFiltersProps): React.JSX.Element {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [searchField, setSearchField] = React.useState('cedula');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = event.target.value;
    setSearchTerm(newSearchTerm);
    onSearch(newSearchTerm, searchField);
  };

  const handleFieldChange = (event: SelectChangeEvent) => {
    const newField = event.target.value;
    setSearchField(newField);
    onSearch(searchTerm, newField);
  };

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel id="search-field-label">Buscar por</InputLabel>
          <Select
            labelId="search-field-label"
            value={searchField}
            onChange={handleFieldChange}
            label="Buscar por"
          >
            <MenuItem value="cedula">Cédula</MenuItem>
            <MenuItem value="nombres">Nombres</MenuItem>
            <MenuItem value="apellidos">Apellidos</MenuItem>
            <MenuItem value="puesto_trabajo">Puesto</MenuItem>
          </Select>
        </FormControl>
        <OutlinedInput
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
          placeholder="Buscar nominas"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px' }}
        />
      </Stack>
    </Card>
  );
}