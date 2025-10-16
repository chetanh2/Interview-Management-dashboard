"use client";

import { createContext, useContext, useMemo, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type Role = "admin" | "ta_member" | "panelist" | "all";

export type Filters = {
  role: Role;
  interviewer: string | "all";
  from: string | ""; // YYYY-MM-DD
  to: string | "";
};

const defaultFilters: Filters = {
  role: "all",
  interviewer: "all",
  from: "",
  to: "",
};

function readFilters(sp: URLSearchParams): Filters {
  return {
    role: (sp.get("role") as Role) || "all",
    interviewer: (sp.get("interviewer") as string) || "all",
    from: sp.get("from") || "",
    to: sp.get("to") || "",
  };
}

type Ctx = {
  filters: Filters;
  setFilters: (next: Partial<Filters>) => void;
};

const FiltersCtx = createContext<Ctx | null>(null);

export function useFilters() {
  const ctx = useContext(FiltersCtx);
  if (!ctx) throw new Error("useFilters must be used within <FiltersProvider>");
  return ctx;
}

export default function FiltersProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => readFilters(searchParams), [searchParams]);

  const setFilters = useCallback(
    (next: Partial<Filters>) => {
      const sp = new URLSearchParams(searchParams.toString());
      const merged = { ...filters, ...next };

      Object.entries(merged).forEach(([k, v]) => {
        const val = String(v ?? "");
        if (!val || val === "all") sp.delete(k);
        else sp.set(k, val);
      });

      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    },
    [filters, pathname, router, searchParams]
  );

  const value = useMemo<Ctx>(() => ({ filters, setFilters }), [filters, setFilters]);

  return <FiltersCtx.Provider value={value}>{children}</FiltersCtx.Provider>;
}
