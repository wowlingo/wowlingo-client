import { cn } from '@/lib/classNames'
import type { Choice } from '@/data/questions'

interface OptionProps {
  name: string
  choice: Choice
  selectedId?: string
  onChange: (id: string) => void
}

export default function Option({ name, choice, selectedId, onChange }: OptionProps) {
  const selected = selectedId === choice.id
  return (
    <label
      className={cn(
        'flex items-center gap-3 rounded-xl px-6 py-5 cursor-pointer',
        'bg-gray-50 hover:bg-gray-100',
        selected && 'bg-blue-50 ring-2 ring-blue-300'
      )}
    >
      <input
        type="radio"
        name={name}
        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
        checked={selected}
        onChange={() => onChange(choice.id)}
      />
      <span className="text-lg text-gray-900">{choice.text}</span>
    </label>
  )
}
