import { FileQuestion, Users, FolderOpen, Calendar } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: 'default' | 'members' | 'projects' | 'events';
}

export default function EmptyState({ 
  title, 
  description, 
  action,
  icon = 'default' 
}: EmptyStateProps) {
  const icons = {
    default: FileQuestion,
    members: Users,
    projects: FolderOpen,
    events: Calendar,
  };

  const Icon = icons[icon];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center max-w-md mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
