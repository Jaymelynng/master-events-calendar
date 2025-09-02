import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowUp,
  Copy,
  Download,
  FileText,
  Code,
  ExternalLink,
  RefreshCw,
  MapPin,
  Phone,
  User,
  Clock,
  Settings,
  Palette,
} from "lucide-react"
import { getGyms, getLinkTypes, type Gym, type LinkType } from "@/lib/database"
import { AppSidebar } from "@/components/app-sidebar"
import { LinkManagementModal } from "@/components/link-management-modal"
import { useToast } from "@/hooks/use-toast"

interface SelectedLinks {
  [gymId: string]: {
    [linkTypeId: string]: boolean
  }
}

export default function GymnasticsDatabase() {
  const [allGyms, setAllGyms] = useState<Gym[]>([])
  const [allLinkTypes, setAllLinkTypes] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGyms, setSelectedGyms] = useState<string[]>([])
  const [selectedLinkTypes, setSelectedLinkTypes] = useState<string[]>([])
  const [selectedLinks, setSelectedLinks] = useState<SelectedLinks>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [copyText, setCopyText] = useState("")
  const [refreshing, setRefreshing] = useState(false)
  const [linkManagementOpen, setLinkManagementOpen] = useState(false)
  const gymRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { toast } = useToast()

  // Gym selection handlers
  const handleToggleGymSelect = (gymId: string) => {
    if (selectedGyms.includes(gymId)) {
      setSelectedGyms(selectedGyms.filter(id => id !== gymId))
    } else {
      setSelectedGyms([...selectedGyms, gymId])
    }
  }

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [gymsData, linkTypesData] = await Promise.all([getGyms(), getLinkTypes()])
      setAllGyms(gymsData)
      setAllLinkTypes(linkTypesData)
    } catch (error) {
      console.error("Error loading data:", error)
      showNotification("Error loading data")
    } finally {
      setLoading(false)
    }
  }

  const refreshData = async () => {
    try {
      setRefreshing(true)
      await loadData()
      showNotification("Data refreshed!")
    } catch (error) {
      showNotification("Error refreshing data")
    } finally {
      setRefreshing(false)
    }
  }

  const gymIds = allGyms.map((gym) => gym.id)
  const linkTypeIds = allLinkTypes.map((linkType) => linkType.id)

  const showNotification = (message: string) => {
    toast({
      title: "Gymnastics Database",
      description: message,
    })
  }

  const scrollToGym = (gymId: string) => {
    if (gymRefs.current[gymId]) {
      const yOffset = -100
      const element = gymRefs.current[gymId]
      const y = element!.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const copyGymSelectedLinks = (gymId: string) => {
    const gym = allGyms.find((g) => g.id === gymId)
    if (!gym) return

    const gymSelectedLinks = selectedLinks[gymId] || {}

    let content = `🏢 ${gym.name} - Selected Links 🏢\n`
    const canvaUrl = gym.links['canva_promos'] || gym.links['canva_promo_code_url']
    if (canvaUrl) {
      content += `🎨 Promo Codes: ${canvaUrl}\n`
    }
    content += `📞 ${gym.phone} | 👤 ${gym.manager}\n`
    content += `------------------------------------\n`

    Object.keys(gymSelectedLinks).forEach((linkTypeId) => {
      if (gymSelectedLinks[linkTypeId]) {
        const linkType = allLinkTypes.find((lt) => lt.id === linkTypeId)
        const url = gym.links[linkTypeId]
        if (url && linkType) {
          content += `${linkType.emoji} ${linkType.label}: ${url}\n`
        }
      }
    })

    if (Object.keys(gymSelectedLinks).some((k) => gymSelectedLinks[k])) {
      navigator.clipboard.writeText(content).then(() => {
        showNotification(`${gym.name} selected links copied!`)
      })
    } else {
      showNotification("No links selected for this gym.")
    }
  }

  const copyGymFilteredLinks = (gymId: string) => {
    const gym = allGyms.find((g) => g.id === gymId)
    if (!gym) return

    const linkTypesToShow = selectedLinkTypes.length > 0 ? selectedLinkTypes : linkTypeIds

    let content = `🏢 ${gym.name} - Filtered Links 🏢\n`
    const canvaUrl = gym.links['canva_promos'] || gym.links['canva_promo_code_url']
    if (canvaUrl) {
      content += `🎨 Promo Codes: ${canvaUrl}\n`
    }
    content += `📞 ${gym.phone} | 👤 ${gym.manager}\n`
    content += `------------------------------------\n`

    linkTypesToShow.forEach((linkTypeId) => {
      const linkType = allLinkTypes.find((lt) => lt.id === linkTypeId)
      const url = gym.links[linkTypeId]
      if (url && linkType) {
        content += `${linkType.emoji} ${linkType.label}: ${url}\n`
      }
    })

    navigator.clipboard.writeText(content).then(() => {
      showNotification(`${gym.name} filtered links copied!`)
    })
  }

  const selectAllGyms = () => {
    setSelectedGyms(gymIds)
  }

  const clearGymSelection = () => {
    setSelectedGyms([])
  }

  const selectAllLinkTypes = () => {
    setSelectedLinkTypes(linkTypeIds)
  }

  const clearLinkTypeSelection = () => {
    setSelectedLinkTypes([])
  }

  const clearAllSelections = () => {
    setSelectedGyms([])
    setSelectedLinkTypes([])
    setSelectedLinks({})
    setCopyText("")
  }

  const copySelectedLinksFromTop = () => {
    const gymsToUse = selectedGyms.length > 0 ? selectedGyms : gymIds
    const linkTypesToUse = selectedLinkTypes.length > 0 ? selectedLinkTypes : linkTypeIds

    let content = ""
    gymsToUse.forEach((gymId) => {
      const gym = allGyms.find((g) => g.id === gymId)
      if (!gym) return

      let gymContent = `🏢 ${gym.name} 🏢\n`
      const canvaUrl = gym.links['canva_promos'] || gym.links['canva_promo_code_url']
      if (canvaUrl) {
        gymContent += `🎨 Promo Codes: ${canvaUrl}\n`
      }
      gymContent += `📞 ${gym.phone} | 👤 ${gym.manager}\n`
      gymContent += `------------------------------------\n`

      let hasAnyLinks = false
      linkTypesToUse.forEach((linkTypeId) => {
        const linkType = allLinkTypes.find((lt) => lt.id === linkTypeId)
        const url = gym.links[linkTypeId]
        if (url && linkType) {
          hasAnyLinks = true
          gymContent += `${linkType.emoji} ${linkType.label}: ${url}\n`
        }
      })

      if (hasAnyLinks) {
        content += gymContent + "\n\n"
      }
    })

    if (content) {
      navigator.clipboard
        .writeText(content)
        .then(() => {
          showNotification("Selected links copied to clipboard!")
        })
        .catch(() => {
          setCopyText(content)
          showNotification("Copy the text from the textarea below")
        })
    } else {
      showNotification("No links to copy. Please select gyms and link types.")
    }
  }

  const updateCopyArea = () => {
    let content = ""
    Object.keys(selectedLinks).forEach((gymId) => {
      Object.keys(selectedLinks[gymId]).forEach((linkTypeId) => {
        if (selectedLinks[gymId][linkTypeId]) {
          const gym = allGyms.find((g) => g.id === gymId)
          const linkType = allLinkTypes.find((lt) => lt.id === linkTypeId)
          const url = gym?.links[linkTypeId]
          if (gym && linkType && url) {
            content += `🏢 ${gym.name} - ${linkType.emoji} ${linkType.label}: ${url}\n`
          }
        }
      })
    })
    setCopyText(content)
  }

  useEffect(() => {
    updateCopyArea()
  }, [selectedLinks, allGyms, allLinkTypes])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(copyText).then(() => {
      showNotification("Links copied to clipboard!")
    })
  }

  const copyAsMarkdown = () => {
    let markdown = ""
    Object.keys(selectedLinks).forEach((gymId) => {
      Object.keys(selectedLinks[gymId]).forEach((linkTypeId) => {
        if (selectedLinks[gymId][linkTypeId]) {
          const gym = allGyms.find((g) => g.id === gymId)
          const linkType = allLinkTypes.find((lt) => lt.id === linkTypeId)
          const url = gym?.links[linkTypeId]
          if (gym && linkType && url) {
            markdown += `### ${gym.name} - ${linkType.label}\n[${linkType.label}](${url})\n\n`
          }
        }
      })
    })

    navigator.clipboard.writeText(markdown).then(() => {
      showNotification("Markdown copied to clipboard!")
    })
  }

  const copyAsHTML = () => {
    let html = "<ul>\n"
    Object.keys(selectedLinks).forEach((gymId) => {
      Object.keys(selectedLinks[gymId]).forEach((linkTypeId) => {
        if (selectedLinks[gymId][linkTypeId]) {
          const gym = allGyms.find((g) => g.id === gymId)
          const linkType = allLinkTypes.find((lt) => lt.id === linkTypeId)
          const url = gym?.links[linkTypeId]
          if (gym && linkType && url) {
            html += `  <li><strong>${gym.name}</strong> - <a href="${url}" target="_blank">${linkType.label}</a></li>\n`
          }
        }
      })
    })
    html += "</ul>"

    navigator.clipboard.writeText(html).then(() => {
      showNotification("HTML copied to clipboard!")
    })
  }

  const exportAsJSON = () => {
    const data: any = {}
    Object.keys(selectedLinks).forEach((gymId) => {
      Object.keys(selectedLinks[gymId]).forEach((linkTypeId) => {
        if (selectedLinks[gymId][linkTypeId]) {
          if (!data[gymId]) {
            const gym = allGyms.find((g) => g.id === gymId)
            if (!gym) return

            data[gymId] = {
              name: gym.name,
              manager: gym.manager,
              phone: gym.phone,
              links: {},
            }
          }

          const linkType = allLinkTypes.find((lt) => lt.id === linkTypeId)
          const url = allGyms.find((g) => g.id === gymId)?.links[linkTypeId]
          if (linkType && url) {
            data[gymId].links[linkType.label] = url
          }
        }
      })
    })

    const jsonString = JSON.stringify(data, null, 2)
    navigator.clipboard.writeText(jsonString).then(() => {
      showNotification("JSON exported to clipboard!")
    })
  }

  const selectedLinksCount = Object.values(selectedLinks).reduce((total, gymLinks) => {
    return total + Object.values(gymLinks).filter(Boolean).length
  }, 0)

  const filteredGyms = allGyms.filter((gym) => {
    const location = [gym.city, gym.state].filter(Boolean).join(', ')
    const matchesSearch =
      gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (gym.manager && gym.manager.toLowerCase().includes(searchTerm.toLowerCase())) ||
      location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGymFilter = selectedGyms.length === 0 || selectedGyms.includes(gym.id)

    return matchesSearch && matchesGymFilter
  })

  const copyIndividualLink = (url: string, linkTypeName: string) => {
    navigator.clipboard.writeText(url).then(() => {
      showNotification(`${linkTypeName} link copied!`)
    })
  }

  const copyField = (value: string | null | undefined, fieldName: string) => {
    if (!value) {
      showNotification(`${fieldName} is not available.`)
      return
    }
    navigator.clipboard.writeText(value).then(() => {
      showNotification(`${fieldName} copied!`)
    })
  }

  const copyGymNames = () => {
    const gymsToUse = selectedGyms.length > 0 ? selectedGyms : gymIds

    let content = ""
    gymsToUse.forEach((gymId) => {
      const gym = allGyms.find((g) => g.id === gymId)
      if (gym) {
        content += `${gym.name}\n`
      }
    })

    if (content) {
      navigator.clipboard
        .writeText(content)
        .then(() => {
          showNotification("Gym names copied to clipboard!")
        })
        .catch(() => {
          setCopyText(content)
          showNotification("Copy the gym names from the textarea below")
        })
    } else {
      showNotification("No gyms selected to copy.")
    }
  }

  const copyIClassClassPages = () => {
    const gymsToUse = selectedGyms.length > 0 ? selectedGyms : gymIds
    
    // Filter and organize gyms with iClass URLs
    const stateMap: { [state: string]: { [brandName: string]: Array<{ city: string, url: string }> } } = {}
    
    gymsToUse.forEach((gymId) => {
      const gym = allGyms.find((g) => g.id === gymId)
      if (!gym) return
      
      // Find iClass URL - prefer 'classes', fallback to 'customer_portal'
      let iClassUrl = ""
      if (gym.links['classes'] && gym.links['classes'].includes('iclasspro.com')) {
        iClassUrl = gym.links['classes']
      } else if (gym.links['customer_portal'] && gym.links['customer_portal'].includes('iclasspro.com')) {
        iClassUrl = gym.links['customer_portal']
      }
      
      if (!iClassUrl) return // Skip gyms without iClass URLs
      
      const state = gym.state || "Unknown"
      const brandName = gym.name.trim().toUpperCase()
      const city = gym.city || ""
      
      if (!stateMap[state]) stateMap[state] = {}
      if (!stateMap[state][brandName]) stateMap[state][brandName] = []
      
      // Avoid duplicates
      const existing = stateMap[state][brandName].find(entry => entry.city === city && entry.url === iClassUrl)
      if (!existing) {
        stateMap[state][brandName].push({ city, url: iClassUrl })
      }
    })
    
    // Generate formatted content
    let content = "Class page in iClass\n\n"
    
    // Sort states alphabetically
    const sortedStates = Object.keys(stateMap).sort()
    
    sortedStates.forEach((state, stateIndex) => {
      if (stateIndex > 0) content += "\n"
      content += `📍 ${state}\n\n`
      
      // Sort brands alphabetically
      const sortedBrands = Object.keys(stateMap[state]).sort()
      
      sortedBrands.forEach((brandName, brandIndex) => {
        if (brandIndex > 0) content += "\n"
        content += `${brandName}\n`
        
        const entries = stateMap[state][brandName]
        // Sort cities alphabetically
        entries.sort((a, b) => a.city.localeCompare(b.city))
        
        entries.forEach((entry) => {
          if (entry.city) {
            content += `${entry.city}: ${entry.url}\n`
          } else {
            content += `${entry.url}\n`
          }
        })
      })
    })
    
    if (content === "Class page in iClass\n\n") {
      showNotification("No iClass URLs found in selected gyms.")
      return
    }
    
    navigator.clipboard
      .writeText(content)
      .then(() => {
        showNotification("iClass class pages copied to clipboard!")
      })
      .catch(() => {
        setCopyText(content)
        showNotification("Copy the iClass content from the textarea below")
      })
  }

  const copyIClassOpenGym = () => {
    const gymsToUse = selectedGyms.length > 0 ? selectedGyms : gymIds
    
    // Filter and organize gyms with iClass camp/open gym URLs
    const stateMap: { [state: string]: Array<{ name: string, city: string, url: string }> } = {}
    
    gymsToUse.forEach((gymId) => {
      const gym = allGyms.find((g) => g.id === gymId)
      if (!gym) return
      
      // Find iClass camp URL - prefer 'open_gym', fallback to 'summer_camp'
      let iClassUrl = ""
      if (gym.links['open_gym'] && gym.links['open_gym'].includes('iclasspro.com')) {
        iClassUrl = gym.links['open_gym']
      } else if (gym.links['summer_camp'] && gym.links['summer_camp'].includes('iclasspro.com')) {
        iClassUrl = gym.links['summer_camp']
      }
      
      if (!iClassUrl) return // Skip gyms without iClass camp URLs
      
      const state = gym.state || "Unknown"
      const city = gym.city || ""
      
      if (!stateMap[state]) stateMap[state] = []
      
      // Avoid duplicates
      const existing = stateMap[state].find(entry => entry.name === gym.name && entry.city === city && entry.url === iClassUrl)
      if (!existing) {
        stateMap[state].push({ name: gym.name, city, url: iClassUrl })
      }
    })
    
    // Generate formatted content
    let content = "Open Gym\n\n"
    
    // Sort states alphabetically
    const sortedStates = Object.keys(stateMap).sort()
    
    sortedStates.forEach((state, stateIndex) => {
      if (stateIndex > 0) content += "\n"
      
      // Add emoji based on state
      let emoji = "📍"
      if (state.toLowerCase().includes('arizona')) emoji = "🌵"
      else if (state.toLowerCase().includes('colorado')) emoji = "🏔"
      else if (state.toLowerCase().includes('texas')) emoji = "🌵"
      
      content += `${emoji} ${state}\n\n`
      
      const entries = stateMap[state]
      // Sort entries by city then name
      entries.sort((a, b) => {
        const cityCompare = a.city.localeCompare(b.city)
        return cityCompare !== 0 ? cityCompare : a.name.localeCompare(b.name)
      })
      
      entries.forEach((entry) => {
        const displayName = entry.city ? `${entry.name} ${entry.city}` : entry.name
        content += `${displayName}\n${entry.url}\n\n`
      })
    })
    
    if (content === "Open Gym\n\n") {
      showNotification("No iClass camp URLs found in selected gyms.")
      return
    }
    
    navigator.clipboard
      .writeText(content.trim())
      .then(() => {
        showNotification("iClass open gym links copied to clipboard!")
      })
      .catch(() => {
        setCopyText(content.trim())
        showNotification("Copy the iClass open gym content from the textarea below")
      })
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  if (loading) {
    return (
      <div className="min-h-screen p-5 flex items-center justify-center bg-gym-background">
        <Card className="p-8 border-0 shadow-xl bg-card">
          <CardContent className="flex items-center gap-4">
            <RefreshCw className="w-6 h-6 animate-spin text-gym-primary" />
            <span className="text-lg font-medium text-foreground">
              Loading gymnastics database...
            </span>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gym-background">
      <AppSidebar
        gyms={allGyms}
        linkTypes={allLinkTypes}
        selectedGyms={selectedGyms}
        onToggleGymSelect={handleToggleGymSelect}
        onSelectAllGyms={selectAllGyms}
        onClearGyms={clearGymSelection}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        onCopyGymNames={copyGymNames}
        onNavigateToGym={scrollToGym}
      />
      
      {/* Main content with left margin to account for fixed sidebar */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? "ml-16" : "ml-80"}`}>
        <div className="w-full mx-auto rounded-xl shadow-xl overflow-hidden bg-card">
          {/* Header */}
          <div className="text-white p-8 bg-gradient-to-r from-gym-primary to-gym-secondary">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <h1 className="text-3xl font-bold text-white">🏢 Gymnastics Database</h1>
                <Link to="/summer-camps">
                  <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                    🏕️ Summer Camps
                  </Button>
                </Link>
              </div>
              <div className="text-white/90 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {currentDate}
              </div>
            </div>
            <p className="text-white/90">Quick access to gymnastics links and contact information</p>
          </div>

          {/* Stats Dashboard */}
          <div className="p-8 bg-gym-background">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
              <Card className="border-0 shadow-md bg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Total Gyms
                      </p>
                      <h3 className="text-3xl font-bold mt-1 text-gym-primary">
                        {allGyms.length}
                      </h3>
                    </div>
                    <div className="p-3 rounded-full bg-gym-background">
                      <MapPin className="w-6 h-6 text-gym-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Selected Gyms
                      </p>
                      <h3 className="text-3xl font-bold mt-1 text-gym-primary">
                        {selectedGyms.length}
                      </h3>
                    </div>
                    <div className="p-3 rounded-full bg-gym-background">
                      <User className="w-6 h-6 text-gym-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-card">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Selected Links
                      </p>
                      <h3 className="text-3xl font-bold mt-1 text-gym-primary">
                        {selectedLinksCount}
                      </h3>
                    </div>
                    <div className="p-3 rounded-full bg-gym-background">
                      <ExternalLink className="w-6 h-6 text-gym-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 gap-6 mb-6">
              {/* Link Type Selection - Full Width */}
              <Card className="border-0 shadow-md bg-card">
                <CardHeader className="bg-gym-accent border-b border-gym-muted">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-foreground">
                      🔗 Select Link Types
                    </h3>
                    <Button
                      onClick={() => setLinkManagementOpen(true)}
                      size="sm"
                      variant="gym-outline"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Manage
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex gap-2 mb-4">
                    <Button
                      onClick={selectAllLinkTypes}
                      size="sm"
                      variant="gym"
                    >
                      Select All
                    </Button>
                    <Button
                      onClick={clearLinkTypeSelection}
                      variant="outline"
                      size="sm"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* GENERAL Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">✨</span>
                        <h4 className="font-bold text-gym-primary text-base">GENERAL</h4>
                      </div>
                      <div className="space-y-2">
                        {allLinkTypes
                          .filter(lt => ['website', 'facebook', 'instagram', 'google_maps'].includes(lt.id))
                          .map((linkType) => {
                            const isSelected = selectedLinkTypes.includes(linkType.id);
                            return (
                              <label
                                key={linkType.id}
                                className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 p-2 rounded transition-colors"
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedLinkTypes([...selectedLinkTypes, linkType.id])
                                    } else {
                                      setSelectedLinkTypes(selectedLinkTypes.filter((id) => id !== linkType.id))
                                    }
                                  }}
                                   className="h-5 w-5"
                                />
                                <span className="text-sm font-medium text-foreground">
                                  {linkType.display_label}
                                </span>
                              </label>
                            );
                          })}
                      </div>
                    </div>

                    {/* PROGRAMS Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">✨</span>
                        <h4 className="font-bold text-gym-primary text-base">PROGRAMS</h4>
                      </div>
                      <div className="space-y-2">
                        {allLinkTypes
                          .filter(lt => ['classes', 'customer_portal', 'special_events', 'open_gym'].includes(lt.id))
                          .map((linkType) => {
                            const isSelected = selectedLinkTypes.includes(linkType.id);
                            return (
                              <label
                                key={linkType.id}
                                className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 p-2 rounded transition-colors"
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedLinkTypes([...selectedLinkTypes, linkType.id])
                                    } else {
                                      setSelectedLinkTypes(selectedLinkTypes.filter((id) => id !== linkType.id))
                                    }
                                  }}
                                   className="h-5 w-5"
                                />
                                <span className="text-sm font-medium text-foreground">
                                  {linkType.display_label}
                                </span>
                              </label>
                            );
                          })}
                      </div>
                    </div>

                    {/* CAMPS & PARTIES Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">✨</span>
                        <h4 className="font-bold text-gym-primary text-base">CAMPS & PARTIES</h4>
                      </div>
                      <div className="space-y-2">
                        {allLinkTypes
                          .filter(lt => ['summer_camp', 'party_booking', 'kids_night_out', 'skill_clinics'].includes(lt.id))
                          .map((linkType) => {
                            const isSelected = selectedLinkTypes.includes(linkType.id);
                            return (
                              <label
                                key={linkType.id}
                                className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 p-2 rounded transition-colors"
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedLinkTypes([...selectedLinkTypes, linkType.id])
                                    } else {
                                      setSelectedLinkTypes(selectedLinkTypes.filter((id) => id !== linkType.id))
                                    }
                                  }}
                                   className="h-5 w-5"
                                />
                                <span className="text-sm font-medium text-foreground">
                                  {linkType.display_label}
                                </span>
                              </label>
                            );
                          })}
                      </div>
                    </div>

                    {/* CONTACT Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">✨</span>
                        <h4 className="font-bold text-gym-primary text-base">CONTACT</h4>
                      </div>
                      <div className="space-y-2">
                        {allLinkTypes
                          .filter(lt => ['phone', 'email', 'facebook_messenger', 'meta_business'].includes(lt.id))
                          .map((linkType) => {
                            const isSelected = selectedLinkTypes.includes(linkType.id);
                            return (
                              <label
                                key={linkType.id}
                                className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 p-2 rounded transition-colors"
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedLinkTypes([...selectedLinkTypes, linkType.id])
                                    } else {
                                      setSelectedLinkTypes(selectedLinkTypes.filter((id) => id !== linkType.id))
                                    }
                                  }}
                                   className="h-5 w-5"
                                />
                                <span className="text-sm font-medium text-foreground">
                                  {linkType.display_label}
                                </span>
                              </label>
                            );
                          })}
                      </div>
                    </div>

                    {/* OTHER Section - for any remaining link types */}
                    {allLinkTypes.filter(lt => 
                      !['website', 'facebook', 'instagram', 'google_maps', 'classes', 'customer_portal', 'special_events', 'open_gym', 'summer_camp', 'party_booking', 'kids_night_out', 'skill_clinics', 'phone', 'email', 'facebook_messenger', 'meta_business'].includes(lt.id)
                    ).length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-lg">✨</span>
                          <h4 className="font-bold text-gym-primary text-base">OTHER</h4>
                        </div>
                        <div className="space-y-2">
                          {allLinkTypes
                            .filter(lt => 
                              !['website', 'facebook', 'instagram', 'google_maps', 'classes', 'customer_portal', 'special_events', 'open_gym', 'summer_camp', 'party_booking', 'kids_night_out', 'skill_clinics', 'phone', 'email', 'facebook_messenger', 'meta_business'].includes(lt.id)
                            )
                            .map((linkType) => {
                              const isSelected = selectedLinkTypes.includes(linkType.id);
                              return (
                                <label
                                  key={linkType.id}
                                  className="flex items-center gap-3 cursor-pointer hover:bg-muted/30 p-2 rounded transition-colors"
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedLinkTypes([...selectedLinkTypes, linkType.id])
                                      } else {
                                        setSelectedLinkTypes(selectedLinkTypes.filter((id) => id !== linkType.id))
                                      }
                                    }}
                                    className="h-5 w-5"
                                  />
                                  <span className="text-sm font-medium text-foreground">
                                    {linkType.display_label}
                                  </span>
                                </label>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Search */}
            <Card className="border-0 shadow-md mb-6 bg-card">
              <CardContent className="p-6">
                <div className="relative">
                  <Input
                    placeholder="Search gyms by name, manager, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border bg-gym-background border-gym-muted text-foreground"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ExternalLink className="h-5 w-5 text-gym-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center p-4 rounded-lg bg-card">
              <Button
                onClick={refreshData}
                disabled={refreshing}
                variant="gym"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing..." : "Refresh Data"}
              </Button>
              <Button
                onClick={clearAllSelections}
                variant="outline"
              >
                Clear All
              </Button>
              <Button
                onClick={copySelectedLinksFromTop}
                variant="gym-gradient"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Selected Links
              </Button>
              <Button
                onClick={copyGymNames}
                variant="gym-outline"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy Gym Names
              </Button>
              <Button
                onClick={copyIClassClassPages}
                variant="gym"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy iClass: Class Pages
              </Button>
              <Button
                onClick={copyIClassOpenGym}
                variant="gym"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy iClass: Open Gym
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="p-8 bg-card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Results
              </h2>
              <div className="px-4 py-2 rounded-full font-medium bg-gym-accent text-foreground">
                {filteredGyms.length} results
              </div>
            </div>

            <div className="space-y-6">
              {filteredGyms.map((gym) => {
                const linkTypesToShow = selectedLinkTypes.length > 0 ? selectedLinkTypes : linkTypeIds
                const gymSelectedCount = Object.values(selectedLinks[gym.id] || {}).filter(Boolean).length

                return (
                  <Card
                    key={gym.id}
                    ref={(el) => (gymRefs.current[gym.id] = el)}
                    className="border-0 shadow-md transition-all duration-300 hover:shadow-lg bg-card"
                  >
                    <CardHeader className="text-white bg-gradient-to-r from-gym-primary to-gym-secondary">
                      <div className="flex justify-between items-center">
                        <Link
                          to={`/gym/${gym.id}`}
                          className="text-xl font-semibold hover:underline cursor-pointer text-white"
                        >
                          {gym.name}
                        </Link>
                        <div className="flex items-center gap-2">
                          {gym.links?.canva_promos && (
                            <a
                              href={gym.links.canva_promos}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Weekly Promo Codes"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="bg-white/20 border-white/30 text-white hover:bg-white/30 h-7 px-2"
                              >
                                <Palette className="w-3 h-3 mr-1.5" /> Promos
                              </Button>
                            </a>
                          )}
                          <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white">{gym.id}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm text-white/90">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate" title={gym.address}>
                            {gym.address}
                          </span>
                          <Button
                            onClick={() => copyField(gym.address, "Address")}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/20"
                            title="Copy address"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate" title={gym.manager}>
                            {gym.manager}
                          </span>
                          <Button
                            onClick={() => copyField(gym.manager, "Manager name")}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/20"
                            title="Copy manager name"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate" title={gym.phone}>
                            {gym.phone}
                          </span>
                          <Button
                            onClick={() => copyField(gym.phone, "Phone number")}
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/20"
                            title="Copy phone number"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                        {linkTypesToShow.map((linkTypeId) => {
                          const linkType = allLinkTypes.find((lt) => lt.id === linkTypeId)
                          const url = gym.links[linkTypeId]

                          if (!linkType) return null

                          return (
                            <div
                              key={linkTypeId}
                              className="flex items-center space-x-3 p-3 rounded-lg border transition-colors"
                              style={{
                                backgroundColor: url ? "hsl(var(--gym-background))" : "hsl(var(--muted))",
                                borderColor: url ? "hsl(var(--gym-accent))" : "hsl(var(--border))",
                                opacity: url ? 1 : 0.5,
                              }}
                            >
                              <Checkbox
                                id={`link-${gym.id}-${linkTypeId}`}
                                checked={selectedLinks[gym.id]?.[linkTypeId] || false}
                                onCheckedChange={(checked) => {
                                  setSelectedLinks((prev) => ({
                                    ...prev,
                                    [gym.id]: {
                                      ...prev[gym.id],
                                      [linkTypeId]: checked as boolean,
                                    },
                                  }))
                                }}
                                disabled={!url}
                                className="data-[state=checked]:bg-gym-primary data-[state=checked]:border-gym-primary"
                              />
                              <div className="flex-1 min-w-0">
                                <label
                                  htmlFor={`link-${gym.id}-${linkTypeId}`}
                                  className="text-sm font-medium cursor-pointer block text-foreground"
                                >
                                  {linkType.display_label}
                                </label>
                                {url && (
                                  <div className="flex items-center gap-2 mt-1">
                                    <a
                                      href={url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-blue-600 hover:text-blue-800 truncate flex-1"
                                      title={url}
                                    >
                                      {url}
                                    </a>
                                    <Button
                                      onClick={() => copyIndividualLink(url, linkType.label)}
                                      size="sm"
                                      variant="ghost"
                                      className="h-5 w-5 p-0 hover:bg-gym-accent"
                                      title="Copy link"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>

                      {/* Individual Gym Copy Buttons */}
                      <div className="flex flex-wrap gap-3 justify-center border-t pt-4 border-gym-muted">
                        <Button
                          onClick={() => copyGymSelectedLinks(gym.id)}
                          variant="gym"
                          size="sm"
                          disabled={gymSelectedCount === 0}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Selected ({gymSelectedCount})
                        </Button>
                        <Button
                          onClick={() => copyGymFilteredLinks(gym.id)}
                          variant="gym-outline"
                          size="sm"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Filtered Links
                        </Button>
                        <Button
                          onClick={scrollToTop}
                          variant="outline"
                          size="sm"
                        >
                          <ArrowUp className="w-4 h-4 mr-2" />
                          Back to Top
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Copy Area */}
            <Card className="mt-8 border-0 shadow-md bg-card">
              <CardHeader className="bg-gym-accent border-b border-gym-muted">
                <h3 className="text-lg font-medium text-foreground">
                  📋 Copy Selected Links
                </h3>
              </CardHeader>
              <CardContent className="p-6">
                <Textarea
                  value={copyText}
                  readOnly
                  placeholder="Selected links will appear here..."
                  className="min-h-48 font-mono text-sm border bg-gym-background border-gym-muted text-foreground"
                />
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button
                    onClick={copyToClipboard}
                    variant="gym"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy to Clipboard
                  </Button>
                  <Button
                    onClick={copyAsMarkdown}
                    variant="gym-outline"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Copy as Markdown
                  </Button>
                  <Button onClick={copyAsHTML} variant="outline">
                    <Code className="w-4 h-4 mr-2" />
                    Copy as HTML
                  </Button>
                  <Button
                    onClick={exportAsJSON}
                    variant="secondary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export as JSON
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Link Management Modal */}
      <LinkManagementModal
        open={linkManagementOpen}
        onOpenChange={setLinkManagementOpen}
        linkTypes={allLinkTypes}
        onRefresh={loadData}
      />
    </div>
  )
}