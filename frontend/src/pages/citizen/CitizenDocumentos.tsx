import { useEffect, useState } from 'react';
import { CitizenLayout } from '@/components/citizen/CitizenLayout';
import { citizenService } from '@/services/citizen.service';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Upload, Eye, Download, AlertTriangle } from 'lucide-react';
import type { CitizenDocument } from '@/types';

const validationColors: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  valid: 'default',
  pending: 'secondary',
  invalid: 'destructive',
  expired: 'outline',
};
const validationLabels: Record<string, string> = {
  valid: 'Válido',
  pending: 'Pendente',
  invalid: 'Inválido',
  expired: 'Expirado',
};

export default function CitizenDocumentos() {
  const [documents, setDocuments] = useState<CitizenDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await citizenService.getDocuments();
      if (data) setDocuments(data);
      setLoading(false);
    }
    fetch();
  }, []);

  const handleUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('file', file);
      const { data, error } = await citizenService.uploadDocument(formData);
      if (data) {
        setDocuments(prev => [data, ...prev]);
      }
    };
    input.click();
  };

  return (
    <CitizenLayout title="Documentos" subtitle="Gerir os seus documentos pessoais">
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{documents.length} documento(s)</p>
        <Button size="sm" onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-1" /> Carregar Documento
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">Nenhum documento carregado.</p>
            <Button size="sm" className="mt-3" onClick={handleUpload}>
              <Upload className="h-4 w-4 mr-1" /> Carregar Primeiro Documento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {documents.map(doc => (
            <Card key={doc.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{doc.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{doc.type}</span>
                    <Badge variant={validationColors[doc.validation_status]} className="text-[10px]">
                      {validationLabels[doc.validation_status]}
                    </Badge>
                    {doc.expiry_date && new Date(doc.expiry_date) < new Date() && (
                      <span className="text-[10px] text-destructive flex items-center gap-0.5">
                        <AlertTriangle className="h-3 w-3" /> Expirado
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </CitizenLayout>
  );
}