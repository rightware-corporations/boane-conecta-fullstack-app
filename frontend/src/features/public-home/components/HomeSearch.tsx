import { Search } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function HomeSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim();
    navigate(normalizedQuery ? `/servicos?search=${encodeURIComponent(normalizedQuery)}` : '/servicos');
  }

  return (
    <form onSubmit={submitSearch} role="search" className="flex w-full max-w-3xl flex-col gap-3 xsm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="public-home-search" className="sr-only">Pesquisar serviço ou informação municipal</label>
        <Input
          id="public-home-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar serviço ou informação"
          className="min-h-14 border-transparent bg-surface pl-12 pr-4 text-foreground shadow-xs"
        />
      </div>
      <Button type="submit" size="lg" className="min-h-14 xsm:px-7">
        Pesquisar
      </Button>
    </form>
  );
}
