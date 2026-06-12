import { set, get, del } from 'idb-keyval';
import { Participante } from '@/store/participantesStore';

/**
 * Salva a imagem no IndexedDB vinculada ao ID do participante
 */
export async function salvarFotoParticipante(id: string, file: File): Promise<void> {
  const compressedBlob = await comprimirImagem(file);
  await set(`foto-${id}`, compressedBlob);
}

/**
 * Recupera a imagem do IndexedDB como uma URL de Blob
 */
export async function obterFotoParticipanteUrl(id: string): Promise<string | null> {
  try {
    const blob = await get<Blob>(`foto-${id}`);
    if (!blob) return null;
    return URL.createObjectURL(blob);
  } catch (err) {
    console.error('Erro ao recuperar foto:', err);
    return null;
  }
}

/**
 * Exclui a foto do IndexedDB
 */
export async function deletarFotoParticipante(id: string): Promise<void> {
  await del(`foto-${id}`);
}

/**
 * Comprime a imagem utilizando Canvas nativo no cliente
 * Redimensiona para max 800px de lado e formato WebP ou JPEG
 */
function comprimirImagem(file: File, maxSize = 600, qualidade = 0.8): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      
      let width = img.width;
      let height = img.height;
      
      // Manter a proporção limitando o lado maior
      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Falha ao obter contexto do canvas'));
      
      // Limpar background (útil para PNG transparentes convertidos para JPEG se WebP falhar)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
      
      // Desenhar com redimensionamento
      ctx.drawImage(img, 0, 0, width, height);
      
      // Preferir WebP
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            // Fallback
            canvas.toBlob((fallbackBlob) => {
              if (fallbackBlob) resolve(fallbackBlob);
              else reject(new Error('Falha ao comprimir fallback'));
            }, 'image/jpeg', qualidade);
          }
        },
        'image/webp',
        qualidade
      );
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Falha ao carregar a imagem para compressão'));
    };
    
    img.src = url;
  });
}
