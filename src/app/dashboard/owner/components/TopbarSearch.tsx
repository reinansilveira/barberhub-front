import { Search, X } from "lucide-react";
import { useTopbarSearch } from "../hooks/use-topbar-search";

export const TopbarSearch = ({ services }: { services: string[] }) => {
  const { containerRef, inputRef, ...search } = useTopbarSearch(services);

  return (
    <div className="dashboard-topbar__search-wrap" ref={containerRef}>
      <label className="dashboard-topbar__search">
        <Search aria-hidden="true" />
        <input
          ref={inputRef}
          aria-label="Pesquisar no dashboard"
          value={search.query}
          placeholder="Pressione / para pesquisar"
          onFocus={search.open}
          onChange={(event) => search.change(event.target.value)}
          onKeyDown={(event) => search.closeOnEscape(event.key)}
        />
        {search.query && (
          <button
            type="button"
            aria-label="Limpar busca"
            onClick={search.clear}
          >
            <X aria-hidden="true" />
          </button>
        )}
      </label>
      {search.isOpen && (
        <div className="dashboard-topbar__command" role="listbox">
          <div className="dashboard-topbar__command-heading">
            Navegação rápida
          </div>
          {search.matches.length ? (
            search.matches.map((item) => (
              <button
                type="button"
                role="option"
                aria-selected="false"
                key={`${item.label}-${item.href}`}
                onClick={() => search.select(item)}
              >
                <span>{item.label}</span>
                <small>{item.detail}</small>
              </button>
            ))
          ) : (
            <p>Nenhum resultado encontrado.</p>
          )}
        </div>
      )}
    </div>
  );
};
