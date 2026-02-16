import { supabaseAdmin } from './server';

export type ProjectType = 'vouchers' | 'real_estate' | 'services' | 'products' | 'other';
export type ProjectStatus = 'draft' | 'active' | 'paused' | 'completed';

export interface FormField {
  name: string;
  type: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'number' | 'date';
  label: string;
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export interface ProductItem {
  id?: string;
  name: string;
  price: number;
  cost_of_goods: number;
  commission_rate: number;
  stripe_product_id?: string;
  stripe_price_id?: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  project_type: ProjectType;
  description?: string;
  logo_url?: string;
  price: number;
  cost_of_goods: number;
  commission_rate: number;
  status: ProjectStatus;
  form_fields: FormField[];
  products?: ProductItem[];
  stripe_product_id?: string;
  stripe_price_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export async function getProjects(filters?: { status?: ProjectStatus; project_type?: ProjectType }) {
  try {
    let query = supabaseAdmin.from('projects').select('*').order('created_at', { ascending: false });
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.project_type) query = query.eq('project_type', filters.project_type);
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching projects:', error);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching projects:', error);
    return { data: null, error };
  }
}

export async function getProjectById(id: string) {
  try {
    const { data, error } = await supabaseAdmin.from('projects').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching project:', error);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching project:', error);
    return { data: null, error };
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    const { data, error } = await supabaseAdmin.from('projects').select('*').eq('slug', slug).single();
    if (error) {
      console.error('Error fetching project by slug:', error);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching project by slug:', error);
    return { data: null, error };
  }
}

export async function getVoucherInventory(projectId: string) {
  try {
    const { data, error } = await supabaseAdmin.from('voucher_codes').select('status').eq('project_id', projectId);
    if (error) {
      console.error('Error fetching voucher inventory:', error);
      return { data: null, error };
    }
    const inventory = {
      total: data.length,
      available: data.filter(v => v.status === 'available').length,
      sold: data.filter(v => v.status === 'sold').length,
      reserved: data.filter(v => v.status === 'reserved').length,
      expired: data.filter(v => v.status === 'expired').length
    };
    return { data: inventory, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching voucher inventory:', error);
    return { data: null, error };
  }
}

export async function getProjectAssignments(projectId: string) {
  try {
    const { data, error } = await supabaseAdmin.from('project_assignments')
      .select('id, salesperson_id, form_url, qr_code_url, qr_code_data, status, assigned_at, users!salesperson_id(id, name, email)')
      .eq('project_id', projectId).order('assigned_at', { ascending: false });
    if (error) {
      console.error('Error fetching project assignments:', error);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching project assignments:', error);
    return { data: null, error };
  }
}

export async function getSalespersonProjects(salespersonId: string) {
  try {
    const { data, error } = await supabaseAdmin.from('project_assignments')
      .select('id, form_url, qr_code_url, qr_code_data, status, assigned_at, projects!inner(*)')
      .eq('salesperson_id', salespersonId).eq('status', 'active').order('assigned_at', { ascending: false });
    if (error) {
      console.error('Error fetching salesperson projects:', error);
      return { data: null, error };
    }
    return { data, error: null };
  } catch (error: any) {
    console.error('Unexpected error fetching salesperson projects:', error);
    return { data: null, error };
  }
}

export async function updateProject(id: string, updateData: Partial<Project>) {
  try {
    const { data, error } = await supabaseAdmin
      .from('projects')
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      throw error;
    }

    return data;
  } catch (error: any) {
    console.error('Unexpected error updating project:', error);
    throw error;
  }
}

export async function deleteProject(id: string) {
  try {
    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error('Unexpected error deleting project:', error);
    throw error;
  }
}
