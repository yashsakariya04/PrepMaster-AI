import { useMemo } from 'react'

type PasswordStrengthProps = {
  password: string
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
  const strength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' }

    let score = 0
    if (password.length >= 6) score++
    if (password.length >= 8) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 2) return { level: score, label: 'Weak', color: 'bg-red-500' }
    if (score === 3) return { level: score, label: 'Fair', color: 'bg-yellow-500' }
    if (score === 4) return { level: score, label: 'Good', color: 'bg-blue-500' }
    return { level: score, label: 'Strong', color: 'bg-green-500' }
  }, [password])

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="mb-1 flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${
              i <= strength.level ? strength.color : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">
        Password strength: <span className="font-medium">{strength.label}</span>
      </p>
    </div>
  )
}

export default PasswordStrength


