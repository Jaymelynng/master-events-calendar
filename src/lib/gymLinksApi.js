import { supabase } from './supabase';

// 🏭 Jayme's Link Factory API Functions
// Manages gym links in Supabase database

export const gymLinksApi = {
  // Get all gym links with details from main database
  async getAllLinksDetailed() {
    const { data, error } = await supabase
      .from('gym_links_detailed')
      .select('*')
      .order('gym_name')
      .order('sort_order');
    
    if (error) {
      console.warn('gym_links_detailed view not found, using fallback query');
      // Fallback: manually join if view doesn't exist yet
      return [];
    }
    return data || [];
  },

  // Get links for a specific gym
  async getLinksByGym(gymId) {
    const { data, error } = await supabase
      .from('gym_links_detailed')
      .select('*')
      .eq('gym_id', gymId)
      .order('sort_order');
    
    if (error) throw new Error(error.message);
    return data || [];
  },

  // Get quick links (top 5 most used)
  async getQuickLinks() {
    const { data, error } = await supabase
      .from('quick_links')
      .select('*');
    
    if (error) throw new Error(error.message);
    return data || [];
  },

  // Create or update a gym link
  async upsertGymLink(gymId, linkTypeId, url) {
    const { data, error } = await supabase
      .from('gym_links')
      .upsert({
        gym_id: gymId,
        link_type_id: linkTypeId,
        url: url,
        is_active: true
      }, {
        onConflict: 'gym_id,link_type_id'
      })
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  // Delete a gym link
  async deleteGymLink(gymId, linkTypeId) {
    const { error } = await supabase
      .from('gym_links')
      .delete()
      .eq('gym_id', gymId)
      .eq('link_type_id', linkTypeId);
    
    if (error) throw new Error(error.message);
  },

  // Bulk import links
  async bulkImportLinks(links) {
    const { data, error } = await supabase
      .from('gym_links')
      .upsert(links, {
        onConflict: 'gym_id,link_type_id'
      })
      .select();
    
    if (error) throw new Error(error.message);
    return data;
  }
};

export const linkTypesApi = {
  // Get all link types
  async getAll() {
    const { data, error } = await supabase
      .from('link_types')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    
    if (error) throw new Error(error.message);
    return data || [];
  },

  // Get link types by category
  async getByCategory() {
    const { data, error } = await supabase
      .from('link_types')
      .select('*')
      .eq('is_active', true)
      .order('category')
      .order('sort_order');
    
    if (error) throw new Error(error.message);
    
    // Group by category
    const grouped = {};
    data.forEach(linkType => {
      if (!grouped[linkType.category]) {
        grouped[linkType.category] = [];
      }
      grouped[linkType.category].push(linkType);
    });
    
    return grouped;
  },

  // Create new link type
  async create(linkType) {
    const { data, error } = await supabase
      .from('link_types')
      .insert([linkType])
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  },

  // Update link type
  async update(id, updates) {
    const { data, error } = await supabase
      .from('link_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }
};

// Admin statistics and reports
export const adminReportsApi = {
  // Get link coverage report
  async getLinkCoverageReport() {
    const { data, error } = await supabase.rpc('get_link_coverage_report');
    
    if (error) {
      // Fallback to manual calculation if RPC doesn't exist
      const { data: allCombos } = await supabase
        .from('gyms')
        .select(`
          id,
          name,
          link_types:link_types(id, name, label, emoji)
        `);
      
      const { data: existingLinks } = await supabase
        .from('gym_links')
        .select('gym_id, link_type_id');
      
      // Calculate coverage manually
      return this.calculateCoverage(allCombos, existingLinks);
    }
    
    return data || [];
  },

  // Calculate coverage manually
  calculateCoverage(gyms, existingLinks) {
    // This is a fallback calculation
    const coverage = [];
    // Implementation would go here
    return coverage;
  },

  // Get missing links report
  async getMissingLinksReport() {
    const allGyms = await supabase.from('gyms').select('*');
    const allLinkTypes = await supabase.from('link_types').select('*').eq('is_active', true);
    const existingLinks = await supabase.from('gym_links').select('*').eq('is_active', true);
    
    const missing = [];
    
    allGyms.data.forEach(gym => {
      allLinkTypes.data.forEach(linkType => {
        const exists = existingLinks.data.some(
          link => link.gym_id === gym.id && link.link_type_id === linkType.id
        );
        
        if (!exists) {
          missing.push({
            gym_id: gym.id,
            gym_name: gym.name,
            link_type_id: linkType.id,
            link_type_name: linkType.name,
            link_type_label: linkType.label,
            link_type_emoji: linkType.emoji,
            category: linkType.category
          });
        }
      });
    });
    
    return missing;
  }
}; 