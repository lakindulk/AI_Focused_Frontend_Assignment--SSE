import React from "react";
import { FiAward, FiRefreshCw, FiZap } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import type { AIInsight } from "@/types";

const insightIcon: Record<AIInsight["type"], React.ReactNode> = {
  nutrition:    <HiSparkles style={{ color: "var(--color-success)" }} />,
  substitution: <FiRefreshCw style={{ color: "var(--color-info)" }} />,
  tip:          <FiZap style={{ color: "var(--color-primary)" }} />,
  healthier:    <FiAward style={{ color: "var(--color-secondary)" }} />,
};

interface RecipeInsightsProps {
  aiTip?: string;
  aiInsights?: AIInsight[];
}

export const RecipeInsights: React.FC<RecipeInsightsProps> = ({ aiTip, aiInsights }) => (
  <>
    {aiTip && (
      <div className="ai-tips-card">
        <div className="ai-tips-card__header">
          <FiAward />
          <span>CookIT Tip</span>
        </div>
        <p className="ai-tips-card__content">{aiTip}</p>
      </div>
    )}

    {aiInsights && aiInsights.length > 0 && (
      <div className="ai-tips-card">
        <div className="ai-tips-card__header">
          <HiSparkles />
          <span>AI Insights</span>
        </div>
        <div className="ai-insights-list">
          {aiInsights.map((insight, idx) => (
            <div key={idx} className={`ai-insight-item ai-insight-item--${insight.type}`}>
              <span className="ai-insight-item__icon">{insightIcon[insight.type]}</span>
              <div className="ai-insight-item__body">
                <p className="ai-insight-item__title">{insight.title}</p>
                <p className="ai-insight-item__content">{insight.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </>
);
