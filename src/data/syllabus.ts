import type { SyllabusNode } from '../types'

export const SYLLABUS_TITLE = 'Medical Statistics'

export const syllabus: SyllabusNode[] = [
  {
    id: 'basics-and-data',
    title: 'Basics and Data',
    children: [
      { id: 'populations-and-samples', title: 'Populations and Samples' },
      { id: 'variable-types', title: 'Variable Types' },
      { id: 'data-display', title: 'Data Display' },
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
]

type ContentType = 'video' | 'podcast' | 'infographic' | 'questionnaire'

interface LeafContentConfig {
  folder: string
  prefix: string | Partial<Record<ContentType, string>>
}

const LEAF_CONTENT: Record<string, LeafContentConfig> = {
  'basics-and-data/populations-and-samples': {
    folder: '1basics-and-data/populations-and-samples',
    prefix: 'BD_PS',
  },
  'basics-and-data/variable-types': {
    folder: '1basics-and-data/variable-types',
    prefix: 'BD_VT',
  },
  'basics-and-data/data-display': {
    folder: '1basics-and-data/data-display',
    prefix: 'BD_DD',
  },
  'numerical-outcome-analysis/mean-sd-standard-error': {
    folder: '2Numerical-Outcome-Analysis/1MeanSD',
    prefix: { video: 'NOA_MSD', podcast: 'NOA_MSS', infographic: 'NOA_MSS', questionnaire: 'NOA_MSD' },
  },
  'numerical-outcome-analysis/normal-distribution': {
    folder: '2Numerical-Outcome-Analysis/2Normal Distribution',
    prefix: 'NOA_ND',
  },
  'numerical-outcome-analysis/confidence-intervals-means': {
    folder: '2Numerical-Outcome-Analysis/3Confidence',
    prefix: 'NOA_CIM',
  },
  'numerical-outcome-analysis/hypothesis-testing-p-values': {
    folder: '2Numerical-Outcome-Analysis/4Hypothesis',
    prefix: 'NOA_HTPV',
  },
  'numerical-outcome-analysis/comparison-two-means-t-tests': {
    folder: '2Numerical-Outcome-Analysis/5Comparison',
    prefix: 'NOA_CTM',
  },
  'numerical-outcome-analysis/analysis-of-variance-anova': {
    folder: '2Numerical-Outcome-Analysis/6Analysis Variance',
    prefix: 'NOA_AV',
  },
  'numerical-outcome-analysis/linear-and-multiple-regression': {
    folder: '2Numerical-Outcome-Analysis/7LinearMultipleRegression',
    prefix: 'NOA_LMR',
  },
  'numerical-outcome-analysis/correlation-coefficients': {
    folder: '2Numerical-Outcome-Analysis/8correlationCoefficients',
    prefix: 'NOA_CC',
  },
  'binary-outcome-analysis/differences-risks-and-odds': {
    folder: '3Binary-Outcome-Analysis/1DifferencesRisksOdds',
    prefix: 'BOA_DRO',
  },
  'binary-outcome-analysis/binomial-distribution': {
    folder: '3Binary-Outcome-Analysis/2BinomialDistribution',
    prefix: 'BOA_BD',
  },
  'binary-outcome-analysis/comparing-proportions': {
    folder: '3Binary-Outcome-Analysis/3ComparingProportions',
    prefix: 'BOA_CP',
  },
  'binary-outcome-analysis/chi-squared-tests': {
    folder: '3Binary-Outcome-Analysis/4ChiSquaredTests',
    prefix: 'BOA_CST',
  },
  'binary-outcome-analysis/confounding-and-stratification': {
    folder: '3Binary-Outcome-Analysis/5ConfoundingStratification',
    prefix: 'BOA_CS',
  },
  'binary-outcome-analysis/logistic-regression': {
    folder: '3Binary-Outcome-Analysis/6LogisticRegression',
    prefix: 'BOA_LR',
  },
  'binary-outcome-analysis/matching-studies': {
    folder: '3Binary-Outcome-Analysis/7MatchingStudies',
    prefix: 'BOA_MS',
  },
  'longitudinal-and-survival-analysis/odds-and-hazard-ratios': {
    folder: '4Longitudinal-and-Survival-Analysis/1OddsHazardRatios',
    prefix: 'LSA_OHR',
  },
  'longitudinal-and-survival-analysis/computing-risks': {
    folder: '4Longitudinal-and-Survival-Analysis/2ComputingRisks',
    prefix: 'LSA_CR',
  },
  'longitudinal-and-survival-analysis/survival-analysis-kaplan-meier': {
    folder: '4Longitudinal-and-Survival-Analysis/3SurvivalAnalysisKaplanMeier',
    prefix: 'LSA_SA',
  },
  'longitudinal-and-survival-analysis/regression-analysis-cox-hazards': {
    folder: '4Longitudinal-and-Survival-Analysis/4RegressionAnalysisCoxHazards',
    prefix: 'LSA_RA',
  },
  'longitudinal-and-survival-analysis/standardization': {
    folder: '4Longitudinal-and-Survival-Analysis/5Standardization',
    prefix: 'LSA_S',
  },
  'statistical-modelling/likelihood-theory': {
    folder: '5Statistical-Modelling/1LikelihoodTheory',
    prefix: 'SM_LT',
  },
  'statistical-modelling/non-parametric-methods-ranking': {
    folder: '5Statistical-Modelling/2NonParametricMethods',
    prefix: 'SM_NPMR',
  },
  'statistical-modelling/bayesian-methods': {
    folder: '5Statistical-Modelling/3BayesianMethods',
    prefix: 'SM_BM',
  },
  'statistical-modelling/systematic-reviews-meta-analysis': {
    folder: '5Statistical-Modelling/4SystematicReviewsMetaAnalysis',
    prefix: 'SM_SRMA',
  },
  'statistical-modelling/diagnostic-test-analysis': {
    folder: '5Statistical-Modelling/5DiagnosticTestAnalysis',
    prefix: 'SM_DTA',
  },
  'statistical-modelling/bootstrapping-and-jackknifing': {
    folder: '5Statistical-Modelling/6BootstrappingJackknifing',
    prefix: 'SM_BJ',
  },
  'study-design-and-interpretation/sample-size-and-power-calculation': {
    folder: '6Study-Design-and-Interpretation/1SampleSizePower',
    prefix: 'SDI_SSPC',
  },
  'study-design-and-interpretation/measurement-error-reproducibility': {
    folder: '6Study-Design-and-Interpretation/2MeasurementErrorReproducibility',
    prefix: 'SDI_MER',
  },
  'study-design-and-interpretation/measures-of-association-impact': {
    folder: '6Study-Design-and-Interpretation/3MeasuresAssociationImpact',
    prefix: 'SDI_MAI',
  },
  'study-design-and-interpretation/analysis-of-bias': {
    folder: '6Study-Design-and-Interpretation/4AnalysisBias',
    prefix: 'SDI_AOB',
  },
  'study-design-and-interpretation/causal-inference-studies': {
    folder: '6Study-Design-and-Interpretation/5CausalInferenceStudies',
    prefix: 'SDI_CIS',
  },
}

function getPrefix(config: LeafContentConfig, type: ContentType): string {
  if (typeof config.prefix === 'string') return config.prefix
  return config.prefix[type] ?? Object.values(config.prefix)[0]!
}

export function buildLeafId(chapterId: string, leafId: string): string {
  return `${chapterId}/${leafId}`
}

export function getContentPath(leafKey: string, type: ContentType): string {
  const config = LEAF_CONTENT[leafKey]
  const suffix = { video: 'V', podcast: 'P', infographic: 'I', questionnaire: 'Q' }[type]
  const ext = { video: 'mp4', podcast: 'm4a', infographic: 'png', questionnaire: 'csv' }[type]

  if (config) {
    const prefix = getPrefix(config, type)
    return `/content/${config.folder}/${prefix}_${suffix}.${ext}`
  }

  return `/content/${leafKey}/${type}.${ext}`
}

export function getExtraVideoPath(leafKey: string): string {
  return getContentPath(leafKey, 'video').replace(/_V\.mp4$/, '_V2.mp4')
}

export function getInfographicTextPath(leafKey: string): string {
  return getContentPath(leafKey, 'infographic').replace(/_I\.png$/, '_I_T.txt')
}

export function getContentFolder(leafKey: string): string {
  const config = LEAF_CONTENT[leafKey]
  return config ? `public/content/${config.folder}/` : `public/content/${leafKey}/`
}

export function getContentFileHint(leafKey: string): string {
  const config = LEAF_CONTENT[leafKey]
  if (!config) return '{PREFIX}_V.mp4, {PREFIX}_P.m4a, {PREFIX}_I.png, {PREFIX}_Q.csv'

  const video = getPrefix(config, 'video')
  const podcast = getPrefix(config, 'podcast')
  const infographic = getPrefix(config, 'infographic')
  const questionnaire = getPrefix(config, 'questionnaire')

  return `${video}_V.mp4, ${podcast}_P.m4a, ${infographic}_I.png, ${questionnaire}_Q.csv`
}
