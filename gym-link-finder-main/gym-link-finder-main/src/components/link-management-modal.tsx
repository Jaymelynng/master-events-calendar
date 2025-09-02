import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { addLinkType, updateLinkType, deleteLinkType, type LinkType } from "@/lib/database"
import { Plus, Edit, Trash2 } from "lucide-react"

interface LinkManagementModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  linkTypes: LinkType[]
  onRefresh: () => void
}

export function LinkManagementModal({
  open,
  onOpenChange,
  linkTypes,
  onRefresh
}: LinkManagementModalProps) {
  const [editingLinkType, setEditingLinkType] = useState<LinkType | null>(null)
  const [newLinkType, setNewLinkType] = useState({
    label: "",
    display_label: "",
    emoji: "",
    category: "Main"
  })

  const categories = ["Main", "Social Media", "Programs", "Other"]

  const handleAddLinkType = async () => {
    try {
      await addLinkType({
        id: newLinkType.label.toLowerCase().replace(/\s+/g, '_'),
        ...newLinkType
      })
      setNewLinkType({
        label: "",
        display_label: "",
        emoji: "",
        category: "Main"
      })
      onRefresh()
    } catch (error) {
      console.error("Error adding link type:", error)
    }
  }

  const handleUpdateLinkType = async () => {
    if (!editingLinkType) return
    try {
      await updateLinkType(editingLinkType.id, editingLinkType)
      setEditingLinkType(null)
      onRefresh()
    } catch (error) {
      console.error("Error updating link type:", error)
    }
  }

  const handleDeleteLinkType = async (linkType: LinkType) => {
    try {
      await deleteLinkType(linkType.id)
      onRefresh()
    } catch (error) {
      console.error("Error deleting link type:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground">
            🔗 Manage Link Types
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Add, edit, or remove link types for gymnastics centers
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add New Link Type */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Add New Link Type</h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={newLinkType.label}
                  onChange={(e) => setNewLinkType({ ...newLinkType, label: e.target.value })}
                  placeholder="e.g., Website"
                  className="bg-gym-background border-gym-muted"
                />
              </div>
              
              <div>
                <Label htmlFor="display_label">Display Label</Label>
                <Input
                  id="display_label"
                  value={newLinkType.display_label}
                  onChange={(e) => setNewLinkType({ ...newLinkType, display_label: e.target.value })}
                  placeholder="e.g., 🌐 Website"
                  className="bg-gym-background border-gym-muted"
                />
              </div>
              
              <div>
                <Label htmlFor="emoji">Emoji</Label>
                <Input
                  id="emoji"
                  value={newLinkType.emoji}
                  onChange={(e) => setNewLinkType({ ...newLinkType, emoji: e.target.value })}
                  placeholder="e.g., 🌐"
                  className="bg-gym-background border-gym-muted"
                />
              </div>
              
              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newLinkType.category}
                  onValueChange={(value) => setNewLinkType({ ...newLinkType, category: value })}
                >
                  <SelectTrigger className="bg-gym-background border-gym-muted">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                onClick={handleAddLinkType}
                className="w-full bg-gym-primary hover:bg-gym-secondary text-white"
                disabled={!newLinkType.label || !newLinkType.display_label}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Link Type
              </Button>
            </div>
          </div>

          {/* Existing Link Types */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-foreground">Existing Link Types</h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {linkTypes.map((linkType) => (
                <div
                  key={linkType.id}
                  className="p-3 rounded-lg border border-gym-muted bg-gym-background"
                >
                  {editingLinkType?.id === linkType.id ? (
                    <div className="space-y-2">
                      <Input
                        value={editingLinkType.label}
                        onChange={(e) =>
                          setEditingLinkType({ ...editingLinkType, label: e.target.value })
                        }
                        className="text-sm"
                      />
                      <Input
                        value={editingLinkType.display_label}
                        onChange={(e) =>
                          setEditingLinkType({ ...editingLinkType, display_label: e.target.value })
                        }
                        className="text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleUpdateLinkType}
                          size="sm"
                          className="bg-gym-primary hover:bg-gym-secondary text-white"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingLinkType(null)}
                          variant="outline"
                          size="sm"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-foreground">
                          {linkType.display_label}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {linkType.category} • ID: {linkType.id}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          onClick={() => setEditingLinkType(linkType)}
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteLinkType(linkType)}
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="border-gym-accent text-gym-primary"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
