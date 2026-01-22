import { Atom, Triangle, Code, Database, LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  react: Atom,
  triangle: Triangle,
  code: Code,
  database: Database,
};

interface SubjectIconProps {
  iconName: string;
  className?: string;
}

export function SubjectIcon({
  iconName,
  className = "w-8 h-8",
}: SubjectIconProps) {
  const Icon = iconMap[iconName] || Code;
  return <Icon className={className} />;
}
