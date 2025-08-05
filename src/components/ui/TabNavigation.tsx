// components/ui/TabNavigation.tsx
type Tab<T = string | oderType> = {
  value: T;
  label: string;
};

type TabsProps<T = string | oderType> = {
  tabs: Tab<T>[];
  value: T;
  onChange: (value: T) => void;
  variant?: 'default' | 'underline';
};

export default function TabNavigation<T = string>({ tabs, value, onChange, variant = 'underline' }: TabsProps<T>) {
  console.log(value);
  if (variant === 'underline') {
    return (
      <div className="flex space-x-4 mb-4">
          {tabs.map((tab) => (
          <button
              key={String(tab.value)}
              type="button"
              onClick={() => onChange(tab.value)}
              className={`px-4 py-2 ${value === tab.value ? 'text-[#0d113d] border-b-2 border-[#0d113d]' : 'text-gray-500'}`}
          >
              {tab.label}
          </button>
          ))}
      </div>
    );
  }

  return (
    <div className="flex mb-4">
      {tabs.map((tab) => (
        <button
          key={String(tab.value)}
          onClick={() => onChange(tab.value)}
          className={`px-4 py-2 font-semibold ${
            value === tab.value ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}