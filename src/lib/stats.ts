export interface StatItem {
  value: string
  label: string
  suffix: string
  color: "green" | "purple"
  highlight?: boolean
}

export const stats: StatItem[] = [
  { value: "63", label: "内测参与用户", suffix: "人", color: "green" },
  { value: "107", label: "反馈意见", suffix: "条", color: "purple" },
  { value: "48.72", label: "10 日留存（同类基准 5-15%）", suffix: "%", color: "green", highlight: true },
  { value: "90.9", label: "用户好评率", suffix: "%", color: "purple" },
  { value: "50", label: "五星好评", suffix: "%", color: "green" },
  { value: "86.4", label: "认为优于同类产品", suffix: "%", color: "purple" },
]
