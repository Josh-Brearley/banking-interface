import { useEffect, useState } from "react";
import { Button, Input, Select } from "@/components/atoms";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import type { TransactionType } from "@/types";

interface TransactionFiltersProps {
  q: string;
  type?: TransactionType;
  from: string;
  to: string;
  hasFilters: boolean;
  onSearch: (value: string) => void;
  onType: (value: TransactionType | undefined) => void;
  onFrom: (value: string) => void;
  onTo: (value: string) => void;
  onClear: () => void;
}

const TYPE_OPTIONS = [
  { label: "All types", value: "" },
  { label: "Deposit", value: "deposit" },
  { label: "Withdrawal", value: "withdrawal" },
  { label: "Transfer", value: "transfer" },
];

export function TransactionFilters({
  q,
  type,
  from,
  to,
  hasFilters,
  onSearch,
  onType,
  onFrom,
  onTo,
  onClear,
}: TransactionFiltersProps) {
  const [term, setTerm] = useState(q);
  const debounced = useDebouncedValue(term, 200);

  // Push the debounced term to the URL only when it diverges from the current
  // value, avoids resetting the page on mount / deep-link.
  useEffect(() => {
    if (debounced !== q) onSearch(debounced);
  }, [debounced, q, onSearch]);

  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:flex-wrap md:items-end">
      <div className="md:w-64">
        <Input
          label="Search"
          type="search"
          placeholder="Description, reference…"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>
      <div className="md:w-44">
        <Select
          label="Type"
          options={TYPE_OPTIONS}
          value={type ?? ""}
          onChange={(e) =>
            onType((e.target.value || undefined) as TransactionType | undefined)
          }
        />
      </div>
      <div className="md:w-40">
        <Input
          label="From"
          type="date"
          value={from}
          onChange={(e) => onFrom(e.target.value)}
        />
      </div>
      <div className="md:w-40">
        <Input
          label="To"
          type="date"
          value={to}
          onChange={(e) => onTo(e.target.value)}
        />
      </div>
      {hasFilters && (
        <Button
          variant="ghost"
          onClick={() => {
            setTerm("");
            onClear();
          }}
        >
          Clear filters
        </Button>
      )}
    </div>
  );
}
