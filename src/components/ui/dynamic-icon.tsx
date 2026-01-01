import * as FaIcons from 'react-icons/fa'

interface DynamicIconProps {
  iconName: string;
  className?: string;
}

export function DynamicIcon({ iconName, className = "w-5 h-5 text-primary" }: DynamicIconProps) {
  const IconComponent = (FaIcons as any)[iconName]

  if (!IconComponent) {
    console.warn(`Icon ${iconName} not found`)
    return null
  }

  return <IconComponent className={className} />
} 