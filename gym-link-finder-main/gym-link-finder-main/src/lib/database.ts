import { supabase } from "@/integrations/supabase/client";

export interface Gym {
  id: string;
  name: string;
  manager?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  website?: string;
  email?: string;
  links: { [linkTypeId: string]: string };
}

export interface LinkType {
  id: string;
  label: string;
  display_label: string;
  emoji: string;
  category: string;
  sort_order: number;
  is_active: boolean;
}

export interface GymLink {
  id: string;
  gym_id: string;
  link_type_id: string;
  url: string;
  notes?: string;
  is_active: boolean;
}

export const getGyms = async (): Promise<Gym[]> => {
  const { data: gymsData, error: gymsError } = await supabase
    .from('gyms')
    .select('*')
    .order('name');

  if (gymsError) {
    console.error('Error fetching gyms:', gymsError);
    throw gymsError;
  }

  const { data: linksData, error: linksError } = await supabase
    .from('gym_links')
    .select('*')
    .eq('is_active', true);

  if (linksError) {
    console.error('Error fetching gym links:', linksError);
    throw linksError;
  }

  // Group links by gym_id
  const linksByGym: { [gymId: string]: { [linkTypeId: string]: string } } = {};
  
  linksData?.forEach(link => {
    if (!linksByGym[link.gym_id]) {
      linksByGym[link.gym_id] = {};
    }
    linksByGym[link.gym_id][link.link_type_id] = link.url;
  });

  // Combine gyms with their links
  const gyms: Gym[] = gymsData?.map(gym => ({
    id: gym.id,
    name: gym.name,
    manager: gym.manager,
    phone: gym.phone,
    address: gym.address,
    city: gym.city,
    state: gym.state,
    website: gym.website,
    email: gym.email,
    links: linksByGym[gym.id] || {}
  })) || [];

  return gyms;
};

export const getLinkTypes = async (): Promise<LinkType[]> => {
  const { data, error } = await supabase
    .from('link_types')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  if (error) {
    console.error('Error fetching link types:', error);
    throw error;
  }

  return data || [];
};

export const addLinkType = async (linkType: Omit<LinkType, 'is_active' | 'sort_order'>): Promise<LinkType> => {
  const { data, error } = await supabase
    .from('link_types')
    .insert({
      id: linkType.id,
      label: linkType.label,
      display_label: linkType.display_label,
      emoji: linkType.emoji,
      category: linkType.category,
      sort_order: 999 // New items go to end
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding link type:', error);
    throw error;
  }

  return data;
};

export const updateLinkType = async (id: string, updates: Partial<LinkType>): Promise<LinkType> => {
  const { data, error } = await supabase
    .from('link_types')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating link type:', error);
    throw error;
  }

  return data;
};

export const deleteLinkType = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('link_types')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deleting link type:', error);
    throw error;
  }
};

export const addGymLink = async (gymId: string, linkTypeId: string, url: string, notes?: string): Promise<GymLink> => {
  const { data, error } = await supabase
    .from('gym_links')
    .insert({
      gym_id: gymId,
      link_type_id: linkTypeId,
      url,
      notes
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding gym link:', error);
    throw error;
  }

  return data;
};

export const updateGymLink = async (id: string, updates: Partial<GymLink>): Promise<GymLink> => {
  const { data, error } = await supabase
    .from('gym_links')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating gym link:', error);
    throw error;
  }

  return data;
};

export const deleteGymLink = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('gym_links')
    .update({ is_active: false })
    .eq('id', id);

  if (error) {
    console.error('Error deleting gym link:', error);
    throw error;
  }
};