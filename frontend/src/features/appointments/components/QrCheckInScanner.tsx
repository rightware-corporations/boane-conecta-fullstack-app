import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

type BarcodeDetectorLike = {
  detect(source: ImageBitmapSource): Promise<Array<{ rawValue: string }>>;
};

type BarcodeDetectorConstructor = new (options: { formats: string[] }) => BarcodeDetectorLike;

export function QrCheckInScanner({ onScan }: { onScan: (credential: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number>();
  const [active, setActive] = useState(false);
  const [error, setError] = useState('');

  const stop = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setActive(false);
  };

  useEffect(() => stop, []);

  async function start() {
    setError('');
    const Detector = (window as unknown as { BarcodeDetector?: BarcodeDetectorConstructor }).BarcodeDetector;
    if (!Detector) {
      setError('Este navegador não suporta leitura QR. Introduza o código manualmente.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) { stop(); return; }
      video.srcObject = stream;
      await video.play();
      setActive(true);
      const detector = new Detector({ formats: ['qr_code'] });
      const scan = async () => {
        if (!videoRef.current || !streamRef.current) return;
        try {
          const result = await detector.detect(videoRef.current);
          const value = result[0]?.rawValue?.trim();
          if (value) { onScan(value); stop(); return; }
        } catch { /* keep scanning; transient frame errors are expected */ }
        frameRef.current = requestAnimationFrame(scan);
      };
      frameRef.current = requestAnimationFrame(scan);
    } catch {
      stop();
      setError('Não foi possível usar a câmara. Autorize o acesso ou introduza o código manualmente.');
    }
  }

  return <div className="space-y-3">
    <Button type="button" variant="outline" onClick={active ? stop : start}>
      {active ? <CameraOff className="mr-2 size-4" /> : <Camera className="mr-2 size-4" />}
      {active ? 'Parar leitura' : 'Ler código QR'}
    </Button>
    <video ref={videoRef} className={active ? 'aspect-video w-full rounded-lg border bg-black object-cover' : 'hidden'} muted playsInline aria-label="Pré-visualização da câmara para leitura QR" />
    {error && <Alert><CameraOff className="size-4" /><AlertTitle>Leitura QR indisponível</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}
  </div>;
}
