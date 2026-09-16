'use client';

import React, { useState } from 'react';
import { Layers, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { modelBenchmarks, ModelBenchmark } from '@/data/modelData';

type MetricKey = 'accuracy' | 'precision' | 'recall' | 'f1' | 'rocAuc';

const metricConfigs: { key: MetricKey; label: string; unit: string; max: number }[] = [
  { key: 'accuracy', label: 'Accuracy', unit: '%', max: 100 },
  { key: 'precision', label: 'Precision', unit: '%', max: 100 },
  { key: 'recall', label: 'Recall', unit: '%', max: 100 },
  { key: 'f1', label: 'F1-Score', unit: '%', max: 100 },
  { key: 'rocAuc', label: 'ROC-AUC', unit: '', max: 1.0 },
];

export const ModelBenchmarkChart: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<MetricKey>('f1');
  const [hoveredModel, setHoveredModel] = useState<string | null>(null);

  const currentConfig = metricConfigs.find((m) => m.key === activeMetric) || metricConfigs[0];

  return (
    <div className="space-y-6">
      {/* Header & Metric Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#BFEAF2]/60 pb-5">
        <div>
          <h3 className="text-base font-bold text-[#20343A]">
            Centralized vs. Federated Benchmark Comparison
          </h3>
          <p className="text-xs text-[#4A636A] mt-0.5">
            Categorical performance comparison across Centralized Logistic Regression, Random Forest, XGBoost, and Federated Logistic Regression
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-[#EAF7FB] p-1.5 rounded-xl border border-[#BFEAF2]">
          {metricConfigs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveMetric(key)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                activeMetric === key
                  ? 'bg-[#1E7F8C] text-white shadow-xs'
                  : 'text-[#4A636A] hover:text-[#20343A] hover:bg-white/60'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas Area: Grouped Vertical Bar Comparison */}
      <div className="relative rounded-2xl bg-[#EAF7FB]/30 border border-[#BFEAF2] p-4 sm:p-6">
        {/* Metric Info Pill */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#20343A]">
              Selected Metric: <span className="text-[#1E7F8C]">{currentConfig.label}</span>
            </span>
            <span className="text-[11px] text-[#6A868F]">
              ({activeMetric === 'rocAuc' ? 'Scale: 0.000 to 1.000' : 'Percentage Scale: 0% to 100%'})
            </span>
          </div>

          <span className="text-[11px] text-[#1E7F8C] font-semibold bg-white px-2.5 py-1 rounded-full border border-[#BFEAF2]">
            Data Source: graph_data.json
          </span>
        </div>

        {/* Visual Chart Area with Y-axis gridlines and 4 vertical bars */}
        <div className="relative h-72 sm:h-80 flex items-end justify-between gap-3 sm:gap-6 pt-10 pb-2 px-2 sm:px-8">
          {/* Subtle horizontal grid lines */}
          <div className="absolute inset-x-0 top-10 bottom-2 flex flex-col justify-between pointer-events-none opacity-40">
            {[100, 75, 50, 25, 0].map((tick) => (
              <div key={tick} className="flex items-center w-full">
                <span className="w-10 text-[10px] font-mono text-[#6A868F] text-right pr-2">
                  {activeMetric === 'rocAuc' ? (tick / 100).toFixed(2) : `${tick}%`}
                </span>
                <div className="flex-1 border-b border-[#BFEAF2] border-dashed" />
              </div>
            ))}
          </div>

          {/* 4 Vertical Bars */}
          <div className="relative w-full h-full flex items-end justify-around gap-2 sm:gap-6 z-10 pl-10">
            {modelBenchmarks.map((bm) => {
              const rawValue =
                activeMetric === 'rocAuc' ? bm.rocAuc : bm[activeMetric];
              const displayValue =
                activeMetric === 'rocAuc'
                  ? bm.rocAuc.toFixed(3)
                  : `${rawValue.toFixed(1)}%`;

              // Calculate normalized percentage for vertical height
              const heightPercent =
                activeMetric === 'rocAuc'
                  ? Math.min(Math.max((bm.rocAuc / 1.0) * 100, 0), 100)
                  : Math.min(Math.max(rawValue, 0), 100);

              const isFed = bm.isFederated;
              const isHovered = hoveredModel === bm.model;

              return (
                <div
                  key={bm.model}
                  className="flex-1 max-w-[140px] flex flex-col items-center h-full justify-end group cursor-pointer"
                  onMouseEnter={() => setHoveredModel(bm.model)}
                  onMouseLeave={() => setHoveredModel(null)}
                >
                  {/* Top Badge / Active Flag */}
                  <div className="mb-2 flex flex-col items-center">
                    {isFed ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-[#1E7F8C] px-2 py-0.5 text-[10px] font-bold text-white shadow-xs animate-pulse mb-1">
                        <Sparkles className="h-3 w-3" />
                        Active Model
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-[#6A868F] mb-1">
                        Benchmark
                      </span>
                    )}
                    <span
                      className={`font-mono text-sm sm:text-base font-extrabold transition-transform ${
                        isFed
                          ? 'text-[#1E7F8C] scale-105'
                          : 'text-[#20343A] group-hover:scale-105'
                      }`}
                    >
                      {displayValue}
                    </span>
                  </div>

                  {/* The Vertical Bar */}
                  <div className="w-full h-full max-h-52 flex items-end">
                    <div
                      className={`w-full rounded-t-2xl transition-all duration-500 relative ${
                        isFed
                          ? 'bg-gradient-to-t from-[#16646F] to-[#1E7F8C] shadow-md shadow-[#1E7F8C]/30 border-2 border-[#1E7F8C]'
                          : 'bg-gradient-to-t from-[#52B5C2] to-[#63C9D6] border border-[#52B5C2]/60 hover:brightness-105'
                      }`}
                      style={{ height: `${heightPercent}%` }}
                    >
                      {/* Top highlight bar */}
                      <div
                        className={`h-1.5 w-full rounded-t-xl ${
                          isFed ? 'bg-white/40' : 'bg-white/30'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* X-Axis Category Labels */}
        <div className="grid grid-cols-4 gap-2 sm:gap-6 pl-12 pt-3 border-t border-[#BFEAF2]/80 text-center">
          {modelBenchmarks.map((bm) => (
            <div
              key={bm.model}
              className={`p-2 rounded-xl transition-colors ${
                bm.isFederated
                  ? 'bg-[#1E7F8C]/10 border border-[#1E7F8C]/40'
                  : 'bg-white/40 border border-transparent'
              }`}
            >
              <p
                className={`text-xs font-bold leading-tight ${
                  bm.isFederated ? 'text-[#1E7F8C]' : 'text-[#20343A]'
                }`}
              >
                {bm.model}
              </p>
              <span className="text-[10px] text-[#6A868F] mt-0.5 block">
                {bm.isFederated ? 'Federated (FedAvg)' : 'Centralized'}
              </span>
            </div>
          ))}
        </div>

        {/* Accessible Insights Note */}
        <div className="mt-4 pt-3 border-t border-[#BFEAF2]/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#4A636A]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-[#1E7F8C] shrink-0" />
            <span>
              <strong className="text-[#20343A]">Federated Model Retention:</strong> The Federated Logistic Regression model achieves nearly equivalent performance (89.2% accuracy / 0.892 ROC-AUC) without centralizing sensitive patient records.
            </span>
          </div>
          <span className="text-[11px] text-[#6A868F] shrink-0 font-medium">
            3 Simulated Hospitals
          </span>
        </div>
      </div>
    </div>
  );
};

