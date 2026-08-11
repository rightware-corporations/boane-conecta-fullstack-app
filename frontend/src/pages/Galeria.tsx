import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Camera, Building2, Users, TreePine, Calendar, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { motion } from 'framer-motion';

const categories = [
  { id: 'todos', name: 'Todos', icon: Camera },
  { id: 'infraestrutura', name: 'Infraestrutura', icon: Building2 },
  { id: 'eventos', name: 'Eventos', icon: Calendar },
  { id: 'comunidade', name: 'Comunidade', icon: Users },
  { id: 'paisagens', name: 'Paisagens', icon: TreePine },
];

const galleryItems = [
  { id: 1, title: 'Edifício do Conselho Municipal', category: 'infraestrutura', date: '2024-01-15', description: 'Vista frontal do edifício sede do Conselho Municipal de Boane.', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80' },
  { id: 2, title: 'Cerimónia de Inauguração', category: 'eventos', date: '2024-02-20', description: 'Inauguração da nova escola primária no distrito de Boane Sede.', image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80' },
  { id: 3, title: 'Paisagem Rural de Boane', category: 'paisagens', date: '2024-03-10', description: 'Vista panorâmica das áreas rurais do município.', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80' },
  { id: 4, title: 'Mercado Municipal', category: 'infraestrutura', date: '2024-01-25', description: 'O renovado Mercado Municipal de Boane.', image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80' },
  { id: 5, title: 'Festival Cultural', category: 'eventos', date: '2024-04-15', description: 'Celebração anual da cultura e tradições de Boane.', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80' },
  { id: 6, title: 'Reunião Comunitária', category: 'comunidade', date: '2024-03-05', description: 'Assembleia comunitária para discussão do plano de desenvolvimento.', image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&q=80' },
  { id: 7, title: 'Rio Umbeluzi', category: 'paisagens', date: '2024-02-28', description: 'O Rio Umbeluzi atravessando o município de Boane.', image: 'https://images.unsplash.com/photo-1468276311594-df7cb65d8df6?w=800&q=80' },
  { id: 8, title: 'Centro de Saúde', category: 'infraestrutura', date: '2024-04-01', description: 'Novo Centro de Saúde equipado com tecnologia moderna.', image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80' },
  { id: 9, title: 'Jovens Voluntários', category: 'comunidade', date: '2024-03-20', description: 'Grupo de jovens em acção de limpeza comunitária.', image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80' },
  { id: 10, title: 'Dia do Município', category: 'eventos', date: '2024-05-01', description: 'Celebrações do Dia do Município de Boane.', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80' },
  { id: 11, title: 'Campos Agrícolas', category: 'paisagens', date: '2024-04-10', description: 'Áreas agrícolas produtivas do município.', image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800&q=80' },
  { id: 12, title: 'Escola Secundária', category: 'infraestrutura', date: '2024-05-15', description: 'Nova Escola Secundária de Boane.', image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80' },
];

export default function Galeria() {
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredItems = selectedCategory === 'todos' ? galleryItems : galleryItems.filter(item => item.category === selectedCategory);

  const openLightbox = (index: number) => { setCurrentImageIndex(index); setLightboxOpen(true); };
  const navigateImage = (direction: 'prev' | 'next') => {
    setCurrentImageIndex(prev => direction === 'prev' ? (prev === 0 ? filteredItems.length - 1 : prev - 1) : (prev === filteredItems.length - 1 ? 0 : prev + 1));
  };
  const currentImage = filteredItems[currentImageIndex];

  return (
    <Layout>
      <section className="bg-gradient-to-br from-primary via-primary/90 to-secondary py-10 sm:py-16 text-primary-foreground">
        <div className="container px-5">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-3 sm:mb-4 text-[11px] sm:text-xs">
              <Camera className="mr-1 h-3 w-3" />
              Memórias Visuais
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-2 sm:mb-4">Galeria de Fotos</h1>
            <p className="text-sm sm:text-xl opacity-90">
              Explore as imagens que capturam a essência do Município de Boane.
            </p>
          </div>
        </div>
      </section>

      <section className="py-4 sm:py-8 border-b bg-muted/30">
        <div className="container px-5">
          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-1.5 text-xs sm:text-sm"
                >
                  <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-6 sm:py-12">
        <div className="container px-5">
          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-muted-foreground">
              A mostrar <span className="font-semibold text-foreground">{filteredItems.length}</span> imagens
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
              >
                <Card className="group overflow-hidden cursor-pointer hover:shadow-elevated transition-all duration-300" onClick={() => openLightbox(index)}>
                  <CardContent className="p-0 relative">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 sm:p-4">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Badge variant="secondary" className="mb-1.5 text-[10px] sm:text-xs">{categories.find(c => c.id === item.category)?.name}</Badge>
                        <h3 className="text-background text-xs sm:text-sm font-semibold line-clamp-2">{item.title}</h3>
                      </div>
                      <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                        <div className="h-7 w-7 sm:h-10 sm:w-10 rounded-full bg-background/20 backdrop-blur-sm flex items-center justify-center">
                          <ZoomIn className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-background" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-10 sm:py-16">
              <Camera className="h-10 w-10 sm:h-16 sm:w-16 mx-auto text-muted-foreground/50 mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">Nenhuma imagem encontrada</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Não existem imagens nesta categoria.</p>
            </div>
          )}
        </div>
      </section>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-5xl p-0 bg-foreground/95 border-0">
          <div className="relative">
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 text-background hover:bg-background/20" onClick={() => setLightboxOpen(false)}>
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-50 text-background hover:bg-background/20 h-10 w-10 sm:h-12 sm:w-12" onClick={() => navigateImage('prev')}>
              <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8" />
            </Button>
            <Button variant="ghost" size="icon" className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-50 text-background hover:bg-background/20 h-10 w-10 sm:h-12 sm:w-12" onClick={() => navigateImage('next')}>
              <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8" />
            </Button>
            {currentImage && (
              <div className="flex flex-col">
                <div className="aspect-[16/10] w-full"><img src={currentImage.image} alt={currentImage.title} className="h-full w-full object-contain" /></div>
                <div className="p-4 sm:p-6 text-background">
                  <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">{categories.find(c => c.id === currentImage.category)?.name}</Badge>
                    <span className="text-[11px] sm:text-sm opacity-70">{new Date(currentImage.date).toLocaleDateString('pt-MZ', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">{currentImage.title}</h3>
                  <p className="text-xs sm:text-sm opacity-80">{currentImage.description}</p>
                  <div className="mt-2 sm:mt-4 text-[11px] sm:text-sm opacity-60">Imagem {currentImageIndex + 1} de {filteredItems.length}</div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
