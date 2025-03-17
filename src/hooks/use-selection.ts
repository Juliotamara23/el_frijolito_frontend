import * as React from 'react';

export interface Selection<T = string> {
  deselectAll: () => void;
  deselectOne: (key: T) => void;
  selectAll: () => void;
  selectOne: (key: T) => void;
  selectedAny: boolean;
  selectedAll: boolean;
}

interface UseSelectionProps<T> {
  keys: T[];
  selected?: Set<T>;
  onSelectedChange?: (selected: Set<T>) => void;
}

export function useSelection<T = string>({ 
  keys = [], 
  selected: externalSelected,
  onSelectedChange 
}: UseSelectionProps<T>): Selection<T> {
  const [internalSelected, setInternalSelected] = React.useState<Set<T>>(new Set());

  const selected = externalSelected ?? internalSelected;

  const handleDeselectAll = React.useCallback(() => {
    if (onSelectedChange) {
      onSelectedChange(new Set());
    } else {
      setInternalSelected(new Set());
    }
  }, [onSelectedChange]);

  const handleDeselectOne = React.useCallback((key: T) => {
    const newSelected = new Set(selected);
    newSelected.delete(key);
    if (onSelectedChange) {
      onSelectedChange(newSelected);
    } else {
      setInternalSelected(newSelected);
    }
  }, [onSelectedChange, selected]);

  const handleSelectAll = React.useCallback(() => {
    const newSelected = new Set(keys);
    if (onSelectedChange) {
      onSelectedChange(newSelected);
    } else {
      setInternalSelected(newSelected);
    }
  }, [keys, onSelectedChange]);

  const handleSelectOne = React.useCallback((key: T) => {
    const newSelected = new Set(selected);
    newSelected.add(key);
    if (onSelectedChange) {
      onSelectedChange(newSelected);
    } else {
      setInternalSelected(newSelected);
    }
  }, [onSelectedChange, selected]);

  const selectedAny = selected.size > 0;
  const selectedAll = keys.length > 0 && selected.size === keys.length;

  return {
    deselectAll: handleDeselectAll,
    deselectOne: handleDeselectOne,
    selectAll: handleSelectAll,
    selectOne: handleSelectOne,
    selectedAny,
    selectedAll,
  };
}