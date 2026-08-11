import { FileText, Home, CreditCard, ClipboardList, Building2, Users, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  { id: 'todos', name: 'Todos', icon: FileText },
  { id: 'Licenciamento', name: 'Licenciamento', icon: FileText },
  { id: 'Habitação', name: 'Habitação', icon: Home },
  { id: 'Pagamentos', name: 'Pagamentos', icon: CreditCard },
  { id: 'Certidões', name: 'Certidões', icon: ClipboardList },
  { id: 'Urbanismo', name: 'Urbanismo', icon: Building2 },
  { id: 'Registo Civil', name: 'Registo Civil', icon: Users },
  { id: 'Geral', name: 'Geral', icon: FileText },
];

interface ServiceCategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ServiceCategoryFilter({ activeCategory, onCategoryChange }: ServiceCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 justify-center">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
            activeCategory === category.id
              ? "bg-primary text-primary-foreground shadow-soft"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          <category.icon className="h-4 w-4" />
          {category.name}
        </button>
      ))}
    </div>
  );
}
