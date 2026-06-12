import type { SyllabusNode } from '../types'

export const SYLLABUS_TITLE = 'Medical Statistics'

export const syllabus: SyllabusNode[] = [
  {
    id: 'basics-and-data',
    title: 'Basics and Data',
    children: [
      { id: 'populations-and-samples', title: 'Populations and Samples' },
      {
        id: 'variable-types',
        title: 'Variable Types',
        children: [
          { id: 'numerical', title: 'Numerical' },
          { id: 'categorical-binary-ordinal', title: 'Categorical (Binary/Ordinal)' },
          { id: 'rates', title: 'Rates' },
        ],
      },
      {
        id: 'data-display',
        title: 'Data Display',
        children: [
          { id: 'frequencies-and-histograms', title: 'Frequencies and Histograms' },
          { id: 'cumulative-distributions', title: 'Cumulative Distributions' },
          { id: 'quantiles-and-percentiles', title: 'Quantiles and Percentiles' },
        ],
      },
    ],
  },
  {
    id: 'numerical-outcome-analysis',
    title: 'Numerical Outcome Analysis',
    children: [
      { id: 'mean-sd-standard-error', title: 'Mean, SD, and Standard Error' },
      { id: 'normal-distribution', title: 'Normal Distribution' },
      { id: 'confidence-intervals-means', title: 'Confidence Intervals of Means' },
      { id: 'hypothesis-testing-p-values', title: 'Hypothesis Testing and P-values' },
      { id: 'comparison-two-means-t-tests', title: 'Comparison of Two Means (t-tests)' },
      { id: 'analysis-of-variance-anova', title: 'Analysis of Variance (ANOVA)' },
      { id: 'linear-and-multiple-regression', title: 'Linear and Multiple Regression' },
      { id: 'correlation-coefficients', title: 'Correlation Coefficients' },
    ],
  },
  {
    id: 'binary-outcome-analysis',
    title: 'Binary Outcome Analysis',
    children: [
      { id: 'differences-risks-and-odds', title: 'Differences, Risks, and Odds' },
      { id: 'binomial-distribution', title: 'Binomial Distribution' },
      { id: 'comparing-proportions', title: 'Comparing Proportions' },
      { id: 'chi-squared-tests', title: 'Chi-squared Tests' },
      { id: 'confounding-and-stratification', title: 'Confounding and Stratification' },
      { id: 'logistic-regression', title: 'Logistic Regression' },
      { id: 'matching-studies', title: 'Matching Studies' },
    ],
  },
  {
    id: 'longitudinal-and-survival-analysis',
    title: 'Longitudinal and Survival Analysis',
    children: [
      { id: 'odds-and-hazard-ratios', title: 'Odds and Hazard Ratios' },
      { id: 'computing-risks', title: 'Computing Risks' },
      { id: 'survival-analysis-kaplan-meier', title: 'Survival Analysis (Kaplan-Meier)' },
      { id: 'regression-analysis-cox-hazards', title: 'Regression Analysis (Cox Hazards)' },
      { id: 'standardization', title: 'Standardization' },
    ],
  },
  {
    id: 'statistical-modelling',
    title: 'Statistical Modelling',
    children: [
      { id: 'likelihood-theory', title: 'Likelihood Theory' },
      { id: 'non-parametric-methods-ranking', title: 'Non-parametric Methods (Ranking)' },
      { id: 'bayesian-methods', title: 'Bayesian Methods' },
      { id: 'systematic-reviews-meta-analysis', title: 'Systematic Reviews and Meta-Analysis' },
      { id: 'diagnostic-test-analysis', title: 'Diagnostic Test Analysis' },
      { id: 'bootstrapping-and-jackknifing', title: 'Bootstrapping and Jackknifing' },
    ],
  },
  {
    id: 'study-design-and-interpretation',
    title: 'Study Design and Interpretation',
    children: [
      { id: 'sample-size-and-power-calculation', title: 'Sample Size and Power Calculation' },
      { id: 'measurement-error-reproducibility', title: 'Measurement Error and Reproducibility' },
      { id: 'measures-of-association-impact', title: 'Measures of Association and Impact' },
      { id: 'analysis-of-bias', title: 'Analysis of Bias' },
      { id: 'causal-inference-studies', title: 'Causal Inference and Studies' },
    ],
  },
  {
    id: 'learning-objectives',
    title: 'Learning Objectives',
    children: [
      { id: 'scientific-medical-paper-structure', title: 'Scientific Medical Paper Structure' },
      { id: 'critical-appraisal-reading', title: 'Critical Appraisal Reading' },
      { id: 'systematic-literature-management', title: 'Systematic Literature Management' },
      { id: 'quantitative-result-presentation', title: 'Quantitative Result Presentation' },
    ],
  },
  {
    id: 'assessment',
    title: 'Assessment',
    children: [
      { id: 'multiple-choice-questions', title: 'Multiple Choice Questions' },
      { id: 'short-essay-exercises', title: 'Short Essay and Exercises' },
      { id: 'literature-review-analysis', title: 'Literature Review Analysis' },
      { id: 'oral-exam-communication-skills', title: 'Oral Exam / Communication Skills' },
    ],
  },
]

export function buildLeafId(chapterId: string, leafId: string): string {
  return `${chapterId}/${leafId}`
}

export function getContentPath(leafKey: string, type: 'video' | 'podcast' | 'infographic' | 'questionnaire'): string {
  const extensions = {
    video: 'mp4',
    podcast: 'mp3',
    infographic: 'svg',
    questionnaire: 'json',
  }
  return `/content/${leafKey}/${type}.${extensions[type]}`
}
