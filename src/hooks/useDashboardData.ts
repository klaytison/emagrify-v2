// src/hooks/useDashboardData.ts
"use client";

import { useEffect, useState } from "react";
import {
  getLastProgress,
  getMacrosTarget,
  getTodayWater,
  getTodayWorkouts,
  getTodayMeals,
  getLastWeeklyReport,
  generateWeeklyReportFromProgress,
  ProgressRow,
  MacrosTargetsRow,
  WaterRow,
  WorkoutRow,
  MealRow,
  WeeklyReportRow,
} from "@/lib/emagrifyApi";

interface DashboardState {
  loading: boolean;
  error: string | null;
  lastProgress: ProgressRow | null;
  macros: MacrosTargetsRow | null;
  waterToday: WaterRow | null;
  workoutsToday: WorkoutRow[];
  mealsToday: MealRow[];
  weeklyReport: WeeklyReportRow | null;
}

export function useDashboardData() {
  const [state, setState] = useState<DashboardState>({
    loading: true,
    error: null,
    lastProgress: null,
    macros: null,
    waterToday: null,
    workoutsToday: [],
    mealsToday: [],
    weeklyReport: null,
  });

  const reload = async () => {
    try {
      setState((s) => ({ ...s, loading: true, error: null }));

      const [
        lastProgress,
        macros,
        waterToday,
        workoutsToday,
        mealsToday,
        weeklyReport,
      ] = await Promise.all([
        getLastProgress(),
        getMacrosTarget(),
        getTodayWater(),
        getTodayWorkouts(),
        getTodayMeals(),
        getLastWeeklyReport(),
      ]);

      setState({
        loading: false,
        error: null,
        lastProgress,
        macros,
        waterToday,
        workoutsToday,
        mealsToday,
        weeklyReport,
      });
    } catch (err: any) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err?.message || "Erro ao carregar dados do dashboard.",
      }));
    }
  };

  useEffect(() => {
    void reload();
  }, []);

  const generateWeekReport = async () => {
    try {
      const report = await generateWeeklyReportFromProgress();
      setState((s) => ({ ...s, weeklyReport: report }));
    } catch (err: any) {
      setState((s) => ({
        ...s,
        error: err?.message || "Erro ao gerar relatório semanal.",
      }));
    }
  };

  return {
    ...state,
    reload,
    generateWeekReport,
  };
}
