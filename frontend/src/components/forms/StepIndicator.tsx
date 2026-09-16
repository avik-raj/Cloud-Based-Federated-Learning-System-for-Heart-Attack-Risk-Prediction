import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={step}>
              {/* Step Circle & Label */}
              <button
                type="button"
                onClick={() => onStepClick && onStepClick(stepNumber)}
                disabled={!onStepClick || stepNumber > currentStep}
                className="flex flex-col sm:flex-row items-center gap-2 group focus:outline-none disabled:cursor-default"
              >
                <div
                  className={`flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#1E7F8C] text-white'
                      : isCurrent
                      ? 'border-2 border-[#1E7F8C] bg-white text-[#1E7F8C] shadow-sm'
                      : 'border border-[#BFEAF2] bg-[#EAF7FB] text-[#6A868F]'
                  }`}
                >
                  {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : stepNumber}
                </div>
                <span
                  className={`text-xs font-semibold whitespace-nowrap hidden md:inline-block ${
                    isCurrent
                      ? 'text-[#20343A]'
                      : isCompleted
                      ? 'text-[#1E7F8C]'
                      : 'text-[#6A868F]'
                  }`}
                >
                  {step}
                </span>
              </button>

              {/* Connecting Line between steps */}
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 sm:mx-4 transition-colors ${
                    stepNumber < currentStep ? 'bg-[#1E7F8C]' : 'bg-[#BFEAF2]'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

