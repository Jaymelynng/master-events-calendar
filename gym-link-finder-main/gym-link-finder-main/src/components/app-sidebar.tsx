import { useState } from "react"
import { Circle, Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { Gym, LinkType } from "@/lib/database"

interface AppSidebarProps {
  gyms: Gym[];
  linkTypes: LinkType[];
  selectedGyms: string[];
  onToggleGymSelect: (gymId: string) => void;
  onSelectAllGyms: () => void;
  onClearGyms: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCopyGymNames: () => void;
  onNavigateToGym: (gymId: string) => void;
}

export function AppSidebar({ 
  gyms, 
  linkTypes, 
  selectedGyms,
  onToggleGymSelect,
  onSelectAllGyms,
  onClearGyms,
  collapsed, 
  onToggleCollapse,
  onCopyGymNames,
  onNavigateToGym 
}: AppSidebarProps) {
  const [gymSearchTerm, setGymSearchTerm] = useState("")

  const filteredGyms = gyms.filter(gym => 
    gym.name.toLowerCase().includes(gymSearchTerm.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className={`fixed left-0 top-0 h-full z-40 transition-all duration-300 ${collapsed ? 'w-16' : 'w-80'} bg-gym-background border-r border-border shadow-lg`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-gym-primary to-gym-secondary">
        <div className="flex items-center gap-2">
          {!collapsed && (
            <h2 className="text-lg font-semibold text-white">Navigate & Select</h2>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="text-white hover:bg-white/20"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
        </Button>
      </div>

      <div className="flex flex-col h-full overflow-y-auto">
        {!collapsed && (
          <>
            {/* Navigate & Select Gyms */}
            <div className="p-4 border-b border-border">
              <h3 className="text-sm font-medium text-foreground mb-3">🏢 Navigate & Select Gyms</h3>
              
              {/* Search */}
              <div className="relative mb-3">
                <Input
                  placeholder="Search gyms..."
                  value={gymSearchTerm}
                  onChange={(e) => setGymSearchTerm(e.target.value)}
                  className="pl-8 text-xs bg-gym-background border-gym-muted"
                />
                <Search className="absolute left-2.5 top-2.5 w-3 h-3 text-muted-foreground" />
              </div>

              {/* Select All/Clear Buttons */}
              <div className="flex gap-2 mb-3">
                <Button
                  onClick={onSelectAllGyms}
                  size="sm"
                  className="flex-1 bg-gym-primary hover:bg-gym-secondary text-white text-xs"
                >
                  Select All
                </Button>
                <Button
                  onClick={onClearGyms}
                  variant="outline"
                  size="sm" 
                  className="flex-1 border-gym-accent text-gym-primary hover:bg-gym-background text-xs"
                >
                  Clear
                </Button>
              </div>

              {/* Gym List */}
              <div className="space-y-1">
                {filteredGyms.map((gym) => (
                  <div 
                    key={gym.id} 
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gym-background/50 cursor-pointer transition-colors group"
                    onClick={() => onToggleGymSelect(gym.id)}
                  >
                    <Checkbox
                      id={`sidebar-gym-${gym.id}`}
                      checked={selectedGyms.includes(gym.id)}
                      onCheckedChange={() => onToggleGymSelect(gym.id)}
                      className="h-5 w-5 data-[state=checked]:bg-gym-primary data-[state=checked]:border-gym-primary shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <label 
                        htmlFor={`sidebar-gym-${gym.id}`}
                        className="text-sm font-medium cursor-pointer text-foreground group-hover:text-gym-primary flex-1 block truncate"
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigateToGym(gym.id);
                        }}
                        title={gym.name}
                      >
                        {gym.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Copy Gym Names */}
            <div className="p-4 space-y-2">
              <Button
                onClick={onCopyGymNames}
                variant="outline"
                className="w-full border-gym-accent text-gym-primary hover:bg-gym-background"
                size="sm"
              >
                Copy Gym Names
              </Button>
            </div>
          </>
        )}

        {collapsed && (
          <div className="p-2 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full p-2"
              onClick={() => onToggleCollapse()}
              title="Expand sidebar"
            >
              <Circle className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}