import React, { useState } from 'react';
import { FiCheck } from 'react-icons/fi';
import './InstructionSteps.css';

interface InstructionStepsProps {
  steps: string[];
}

export const InstructionSteps: React.FC<InstructionStepsProps> = ({ steps }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [activeStep, setActiveStep] = useState<number>(0);

  const handleStepClick = (index: number) => {
    const isCompleted = !!completedSteps[index];

    setCompletedSteps((prev) => ({ ...prev, [index]: !isCompleted }));

    if (!isCompleted) {
      if (index === activeStep && index < steps.length - 1) setActiveStep(index + 1);
    } else {
      setActiveStep(index);
    }
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const percentComplete = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  return (
    <div className="instructions-section">
      <div className="instructions-section__header">
        <h3 className="instructions-section__title">Preparation Steps</h3>
        <div className="instructions-progress">
          <div className="instructions-progress__text">
            {completedCount} of {steps.length} steps completed
          </div>
          <div className="instructions-progress__bar-bg">
            <div
              className="instructions-progress__bar-fill"
              style={{ width: `${percentComplete}%` }}
            />
          </div>
        </div>
      </div>

      <div className="instructions-list">
        {steps.map((step, idx) => {
          const isCompleted = !!completedSteps[idx];
          const isActive = idx === activeStep;

          let stepClasses = 'instruction-step';
          if (isCompleted) stepClasses += ' instruction-step--completed';
          if (isActive) stepClasses += ' instruction-step--active';

          return (
            <div
              key={idx}
              className={stepClasses}
              onClick={() => handleStepClick(idx)}
            >
              <div className="instruction-step__circle">
                {isCompleted ? (
                  <FiCheck className="instruction-step__check-icon" />
                ) : (
                  idx + 1
                )}
              </div>
              <div className="instruction-step__content">
                <p className="instruction-step__text">{step}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
