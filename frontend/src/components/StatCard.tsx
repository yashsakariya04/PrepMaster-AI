import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

type StatCardProps = {
  label: string
  value: string | number
  helperText?: string
  icon?: ReactNode
}

const StatCard = ({ label, value, helperText, icon }: StatCardProps) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-lg hover-glow"
  >
    <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
      <p className="text-sm font-medium">{label}</p>
      {icon}
    </div>
    <p className="mt-3 text-4xl font-bold text-gray-900 dark:text-white">{value}</p>
    {helperText && <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{helperText}</p>}
  </motion.div>
)

export default StatCard


