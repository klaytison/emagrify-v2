// src/hooks/useAdminData.ts
"use client";

import { useEffect, useState } from "react";

type Overview = {
  users: number;
  activeSubscriptions: number;
  workouts: number;
  revenueLast30Days: number;
};

export function useAdminOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/overview", { cache: "no-store" });
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return { data, loading };
}

export function useAdminList<T = any>(path: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(path, { cache: "no-store" });
        const json = await res.json();
        if (Array.isArray(json)) {
          setData(json);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [path]);

  return { data, loading };
}
