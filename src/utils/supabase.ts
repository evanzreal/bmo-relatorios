import { createClient } from '@supabase/supabase-js';

// Para um aplicativo real, essas variáveis devem estar em variáveis de ambiente
// Como .env.local, que não está versionado no controle de código
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'sua-url-do-projeto-supabase';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sua-chave-anonima-supabase';

// Criar um único cliente do Supabase para usar em toda a aplicação
export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para relações do banco de dados
export type Template = {
  id: number;
  titulo: string;
  descricao: string;
  html: string;
  created_at: string;
  imagem_url?: string;
};

export type Relatorio = {
  id: number;
  titulo: string;
  html: string;
  pdf_url?: string;
  template_id?: number;
  usuario_id?: string;
  created_at: string;
};

export type Usuario = {
  id: string;
  email: string;
  nome: string;
  created_at: string;
};

// Funções de ajuda para interação com o Supabase
export async function buscarTemplates(): Promise<Template[]> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Erro ao buscar templates:', error);
    return [];
  }
  
  return data || [];
}

export async function buscarRelatorios(usuarioId?: string): Promise<Relatorio[]> {
  let query = supabase
    .from('relatorios')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (usuarioId) {
    query = query.eq('usuario_id', usuarioId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Erro ao buscar relatórios:', error);
    return [];
  }
  
  return data || [];
}

export async function salvarRelatorio(relatorio: Omit<Relatorio, 'id' | 'created_at'>): Promise<Relatorio | null> {
  const { data, error } = await supabase
    .from('relatorios')
    .insert([relatorio])
    .select()
    .single();
  
  if (error) {
    console.error('Erro ao salvar relatório:', error);
    return null;
  }
  
  return data;
}

export async function buscarTemplateById(id: number): Promise<Template | null> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Erro ao buscar template ID ${id}:`, error);
    return null;
  }
  
  return data;
} 