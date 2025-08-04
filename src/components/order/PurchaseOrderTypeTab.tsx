// components/order/PurchaseOrderTypeTab.tsx

export default function PurchaseOrderTypeTab({ tabs, activeTab, onTabChange }) {
  return (
    <div className="flex border-b mb-4">
    {tabs.map((tab) => (
    <button
        key={tab.value}
        onClick={() => onTabChange(tab.value)}
        className={`px-4 py-2 font-semibold ${activeTab === tab.value ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
    >
        {tab.label}
    </button>
    ))}
    </div>
  );
};