import { useEffect, useRef, useState } from 'react';
import { Download, FileText, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { citizenService } from '@/services/citizen.service';
import { api } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { CitizenDocument } from '@/types';

const labels: Record<CitizenDocument['status'], string> = { RECEIVED: 'Recebido', SCANNING: 'Em verificação', VALID: 'Válido', REJECTED: 'Rejeitado', EXPIRED: 'Expirado', REPLACED: 'Substituído', ARCHIVED: 'Arquivado' };

export default function CitizenDocumentos() {
  const input = useRef<HTMLInputElement>(null);
  const [documents, setDocuments] = useState<CitizenDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>();
  useEffect(() => { citizenService.getDocuments().then(result => { setDocuments(result.data ?? []); setError(result.error); setLoading(false); }); }, []);
  const upload = async (file?: File) => { if (!file) return; setUploading(true); const body = new FormData(); body.append('file', file); body.append('title', file.name); const result = await citizenService.uploadDocument(body); if (result.data) { setDocuments(current => [result.data!, ...current]); toast.success('Documento recebido para verificação'); } else toast.error(result.error); setUploading(false); if (input.current) input.current.value = ''; };
  const download = async (document: CitizenDocument) => { try { const blob = await api.download(`/citizen/documents/${document.id}/download`); const url = URL.createObjectURL(blob); const anchor = window.document.createElement('a'); anchor.href = url; anchor.download = document.originalFileName; anchor.click(); URL.revokeObjectURL(url); } catch { toast.error('Não foi possível descarregar o documento'); } };
  return <CitizenLayout title="Documentos" subtitle="Carregue e acompanhe documentos usados nos serviços municipais">
    <div className="mb-5 flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-muted-foreground">PDF, JPG ou PNG. O estado indica se o ficheiro já foi verificado.</p><input ref={input} className="sr-only" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={event => upload(event.target.files?.[0])} /><Button disabled={uploading} onClick={() => input.current?.click()}><Upload className="mr-2 h-4 w-4" />{uploading ? 'A carregar…' : 'Carregar documento'}</Button></div>
    {loading ? <div className="space-y-2">{[1,2,3].map(item => <Skeleton key={item} className="h-16" />)}</div> : error ? <div role="alert" className="border-l-4 border-destructive p-4">{error}</div> : documents.length === 0 ? <div className="py-14 text-center"><FileText className="mx-auto mb-3 h-8 w-8 text-muted-foreground" /><h2 className="font-semibold">Ainda não tem documentos</h2><p className="mt-1 text-sm text-muted-foreground">Carregue apenas documentos solicitados por um serviço.</p></div> : <div className="divide-y divide-border border-y border-border">{documents.map(document => <article key={document.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center"><FileText className="h-5 w-5 shrink-0 text-muted-foreground" /><div className="min-w-0 flex-1"><h2 className="truncate font-medium">{document.title}</h2><p className="text-xs text-muted-foreground">{document.documentType || document.mimeType} · {(document.fileSize / 1024).toFixed(0)} KB · {new Date(document.createdAt).toLocaleDateString('pt-PT')}</p></div><Badge variant={document.status === 'REJECTED' || document.status === 'EXPIRED' ? 'destructive' : 'secondary'}>{labels[document.status]}</Badge><Button variant="ghost" size="sm" onClick={() => download(document)}><Download className="mr-1 h-4 w-4" />Descarregar</Button></article>)}</div>}
  </CitizenLayout>;
}
