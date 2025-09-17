import React from 'react';
import { AlertCircle } from 'lucide-react';

// Extracted statistics table component
export const StatsTable = ({ 
  events, 
  gyms, 
  eventTypes, 
  monthlyRequirements,
  currentMonth,
  currentYear,
  theme,
  onGymClick,
  getGymLinkUrl 
}) => {
  // Calculate statistics for each gym
  const calculateGymStats = (gymName) => {
    const gymEvents = events.filter(event => 
      event.gym_name === gymName &&
      new Date(event.date).getMonth() === currentMonth &&
      new Date(event.date).getFullYear() === currentYear
    );

    const stats = {};
    eventTypes.forEach(type => {
      stats[type.name] = gymEvents.filter(e => e.type === type.name).length;
    });
    stats.total = gymEvents.length;

    return stats;
  };

  // Get missing event types for a gym
  const getMissingEventTypes = (gymName) => {
    const stats = calculateGymStats(gymName);
    const missing = [];

    monthlyRequirements.forEach(req => {
      const count = stats[req.event_type] || 0;
      if (count < req.required_count) {
        missing.push({
          type: req.event_type,
          needed: req.required_count - count
        });
      }
    });

    return missing;
  };

  // Calculate totals
  const totalsByType = eventTypes.reduce((acc, type) => {
    acc[type.name] = events.filter(e => 
      e.type === type.name &&
      new Date(e.date).getMonth() === currentMonth &&
      new Date(e.date).getFullYear() === currentYear
    ).length;
    return acc;
  }, {});

  const grandTotal = Object.values(totalsByType).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4" style={{ color: theme.colors.textPrimary }}>
        📊 Monthly Statistics - {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </h3>

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b-2" style={{ borderColor: theme.colors.secondary }}>
              <th className="text-left p-2">Gym</th>
              {eventTypes.map(type => (
                <th key={type.id} className="text-center p-2 min-w-[80px]">
                  {type.display_name || type.name}
                </th>
              ))}
              <th className="text-center p-2">Total</th>
              <th className="text-center p-2">Status</th>
            </tr>
          </thead>
          
          <tbody>
            {gyms.map(gym => {
              const stats = calculateGymStats(gym.name);
              const missing = getMissingEventTypes(gym.name);
              
              return (
                <tr key={gym.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-2 font-medium">
                    <button
                      onClick={() => onGymClick(gym.name)}
                      className="hover:underline text-left"
                      style={{ color: theme.colors.primary }}
                    >
                      {gym.name}
                    </button>
                  </td>
                  
                  {eventTypes.map(type => {
                    const count = stats[type.name] || 0;
                    const required = monthlyRequirements.find(r => r.event_type === type.name)?.required_count || 0;
                    const isComplete = count >= required;
                    
                    return (
                      <td key={type.id} className="text-center p-2">
                        {getGymLinkUrl(gym.name, type.name) ? (
                          <a
                            href={getGymLinkUrl(gym.name, type.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-block px-3 py-1 rounded font-bold ${
                              isComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {count}/{required}
                          </a>
                        ) : (
                          <span className={`inline-block px-3 py-1 rounded font-bold ${
                            isComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {count}/{required}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  
                  <td className="text-center p-2 font-bold">
                    {stats.total}
                  </td>
                  
                  <td className="text-center p-2">
                    {missing.length > 0 ? (
                      <div className="flex items-center justify-center gap-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-xs">{missing.length} missing</span>
                      </div>
                    ) : (
                      <span className="text-green-600 text-sm">✓ Complete</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
          
          <tfoot>
            <tr className="border-t-2 font-bold" style={{ borderColor: theme.colors.secondary }}>
              <td className="p-2">TOTAL</td>
              {eventTypes.map(type => (
                <td key={type.id} className="text-center p-2">
                  {totalsByType[type.name] || 0}
                </td>
              ))}
              <td className="text-center p-2">{grandTotal}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
