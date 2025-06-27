import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Move,
  Type,
  Image,
  MousePointer,
  BarChart3,
  Layout,
  Columns,
  Quote,
  List,
  Video,
  Map,
  Calendar,
  FileText,
  Save,
  Eye,
  Settings
} from "lucide-react";

interface PageSection {
  id: string;
  type: string;
  content: any;
  styles?: any;
}

interface PageContent {
  sections: PageSection[];
  metadata: {
    seo: {
      title: string;
      description: string;
    };
    layout?: string;
    styles?: any;
  };
}

interface PageBuilderProps {
  page: {
    id: string;
    title: string;
    slug: string;
    content: PageContent;
    template: string;
    isPublished: boolean;
  };
}

const componentLibrary = [
  { type: 'hero', icon: Layout, label: 'Hero Section', category: 'layout' },
  { type: 'heading', icon: Type, label: 'Заголовок', category: 'content' },
  { type: 'paragraph', icon: FileText, label: 'Текст', category: 'content' },
  { type: 'image', icon: Image, label: 'Изображение', category: 'media' },
  { type: 'video', icon: Video, label: 'Видео', category: 'media' },
  { type: 'button', icon: MousePointer, label: 'Кнопка', category: 'interactive' },
  { type: 'form', icon: FileText, label: 'Форма', category: 'interactive' },
  { type: 'columns', icon: Columns, label: 'Колонки', category: 'layout' },
  { type: 'quote', icon: Quote, label: 'Цитата', category: 'content' },
  { type: 'list', icon: List, label: 'Список', category: 'content' },
  { type: 'chart', icon: BarChart3, label: 'График', category: 'data' },
  { type: 'map', icon: Map, label: 'Карта', category: 'interactive' },
  { type: 'calendar', icon: Calendar, label: 'Календарь', category: 'interactive' },
];

export default function PageBuilder({ page }: PageBuilderProps) {
  const [content, setContent] = useState<PageContent>(page.content || { sections: [], metadata: { seo: { title: '', description: '' } } });
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isEditingSection, setIsEditingSection] = useState(false);
  const [activeTab, setActiveTab] = useState('design');
  const [draggedComponent, setDraggedComponent] = useState<string | null>(null);
  const { toast } = useToast();

  const updatePageMutation = useMutation({
    mutationFn: async (updatedContent: PageContent) => {
      await apiRequest('PUT', `/api/admin/pages/${page.id}`, {
        content: updatedContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({
        title: "Сохранено",
        description: "Страница успешно обновлена",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const publishPageMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('PUT', `/api/admin/pages/${page.id}`, {
        isPublished: !page.isPublished,
        publishedAt: !page.isPublished ? new Date().toISOString() : null,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pages'] });
      toast({
        title: page.isPublished ? "Снято с публикации" : "Опубликовано",
        description: page.isPublished ? "Страница скрыта от посетителей" : "Страница доступна посетителям",
      });
    },
    onError: (error) => {
      toast({
        title: "Ошибка",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const addSection = useCallback((type: string, index?: number) => {
    const newSection: PageSection = {
      id: `section-${Date.now()}`,
      type,
      content: getDefaultContent(type),
      styles: getDefaultStyles(type),
    };

    setContent(prev => {
      const newSections = [...prev.sections];
      const insertIndex = index !== undefined ? index : newSections.length;
      newSections.splice(insertIndex, 0, newSection);
      
      return {
        ...prev,
        sections: newSections,
      };
    });
  }, []);

  const removeSection = useCallback((sectionId: string) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId),
    }));
    setSelectedSection(null);
  }, []);

  const updateSection = useCallback((sectionId: string, updates: Partial<PageSection>) => {
    setContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      ),
    }));
  }, []);

  const moveSection = useCallback((fromIndex: number, toIndex: number) => {
    setContent(prev => {
      const newSections = [...prev.sections];
      const [movedSection] = newSections.splice(fromIndex, 1);
      newSections.splice(toIndex, 0, movedSection);
      
      return {
        ...prev,
        sections: newSections,
      };
    });
  }, []);

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    setDraggedComponent(componentType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent, index?: number) => {
    e.preventDefault();
    if (draggedComponent) {
      addSection(draggedComponent, index);
      setDraggedComponent(null);
    }
  };

  const handleSave = () => {
    updatePageMutation.mutate(content);
  };

  const handlePublish = () => {
    publishPageMutation.mutate();
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Component Library Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Компоненты</h3>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="design">Дизайн</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>
            
            <TabsContent value="design" className="mt-4">
              <div className="space-y-4">
                {['layout', 'content', 'media', 'interactive', 'data'].map(category => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-slate-700 mb-2 capitalize">
                      {category === 'layout' ? 'Макет' :
                       category === 'content' ? 'Контент' :
                       category === 'media' ? 'Медиа' :
                       category === 'interactive' ? 'Интерактив' : 'Данные'}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {componentLibrary
                        .filter(comp => comp.category === category)
                        .map(component => {
                          const Icon = component.icon;
                          return (
                            <div
                              key={component.type}
                              draggable
                              onDragStart={(e) => handleDragStart(e, component.type)}
                              className="p-3 border border-slate-200 rounded-lg cursor-grab hover:bg-slate-50 transition-colors"
                            >
                              <Icon className="h-5 w-5 text-slate-600 mx-auto mb-1" />
                              <div className="text-xs text-center text-slate-600">
                                {component.label}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="page-title">Заголовок страницы</Label>
                  <Input
                    id="page-title"
                    value={content.metadata.seo.title}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        seo: {
                          ...prev.metadata.seo,
                          title: e.target.value,
                        },
                      },
                    }))}
                    placeholder="SEO заголовок"
                  />
                </div>
                <div>
                  <Label htmlFor="page-description">Описание</Label>
                  <Textarea
                    id="page-description"
                    value={content.metadata.seo.description}
                    onChange={(e) => setContent(prev => ({
                      ...prev,
                      metadata: {
                        ...prev.metadata,
                        seo: {
                          ...prev.metadata.seo,
                          description: e.target.value,
                        },
                      },
                    }))}
                    placeholder="SEO описание"
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">
              {content.sections.length} секций
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/${page.slug}`, '_blank')}
            >
              <Eye className="h-4 w-4 mr-2" />
              Предпросмотр
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              disabled={updatePageMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {updatePageMutation.isPending ? "Сохранение..." : "Сохранить"}
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={publishPageMutation.isPending}
              className={page.isPublished ? "bg-red-600 hover:bg-red-700" : "btn-primary"}
            >
              {publishPageMutation.isPending 
                ? "Обновление..." 
                : page.isPublished 
                  ? "Снять с публикации" 
                  : "Опубликовать"
              }
            </Button>
          </div>
        </div>

        {/* Canvas */}
        <div 
          className="flex-1 overflow-auto p-8"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e)}
        >
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm min-h-96">
            {content.sections.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-slate-300 rounded-lg">
                <Layout className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-700 mb-2">
                  Начните создание страницы
                </h3>
                <p className="text-slate-500 mb-4">
                  Перетащите компоненты из левой панели для создания контента
                </p>
              </div>
            ) : (
              <div className="space-y-4 p-6">
                {content.sections.map((section, index) => (
                  <SectionRenderer
                    key={section.id}
                    section={section}
                    isSelected={selectedSection === section.id}
                    onSelect={() => setSelectedSection(section.id)}
                    onEdit={() => setIsEditingSection(true)}
                    onDelete={() => removeSection(section.id)}
                    onUpdate={(updates) => updateSection(section.id, updates)}
                    onMove={(fromIndex, toIndex) => moveSection(fromIndex, toIndex)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Section Editor Modal */}
      {selectedSection && isEditingSection && (
        <SectionEditor
          section={content.sections.find(s => s.id === selectedSection)!}
          isOpen={isEditingSection}
          onClose={() => setIsEditingSection(false)}
          onUpdate={(updates) => updateSection(selectedSection, updates)}
        />
      )}
    </div>
  );
}

// Section Renderer Component
function SectionRenderer({ 
  section, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onUpdate,
  index 
}: {
  section: PageSection;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<PageSection>) => void;
  index: number;
}) {
  const renderContent = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="bg-gradient-to-r from-primary to-blue-700 text-white p-12 rounded-lg">
            <h1 className="text-4xl font-bold mb-4">{section.content.title || 'Hero Title'}</h1>
            <p className="text-xl mb-6">{section.content.subtitle || 'Hero subtitle text'}</p>
            <Button className="bg-accent hover:bg-accent/90">
              {section.content.buttonText || 'Call to Action'}
            </Button>
          </div>
        );
      case 'heading':
        return (
          <div className={`text-${section.content.level === 1 ? '4xl' : section.content.level === 2 ? '3xl' : '2xl'} font-bold text-slate-900`}>
            {section.content.text || 'Заголовок'}
          </div>
        );
      case 'paragraph':
        return (
          <div className="text-slate-600 leading-relaxed">
            {section.content.text || 'Текст параграфа...'}
          </div>
        );
      case 'image':
        return (
          <div className="relative">
            {section.content.url ? (
              <img 
                src={section.content.url} 
                alt={section.content.alt || ''} 
                className="w-full h-auto rounded-lg"
              />
            ) : (
              <div className="w-full h-48 bg-slate-200 rounded-lg flex items-center justify-center">
                <Image className="h-12 w-12 text-slate-400" />
              </div>
            )}
          </div>
        );
      case 'button':
        return (
          <Button className={`btn-${section.content.style || 'primary'}`}>
            {section.content.text || 'Кнопка'}
          </Button>
        );
      case 'columns':
        return (
          <div className={`grid grid-cols-${section.content.columns || 2} gap-6`}>
            {Array.from({ length: section.content.columns || 2 }).map((_, i) => (
              <div key={i} className="p-4 border border-slate-200 rounded-lg">
                <h3 className="font-semibold mb-2">Колонка {i + 1}</h3>
                <p className="text-slate-600">Содержимое колонки...</p>
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="p-4 border border-slate-200 rounded-lg">
            <div className="text-sm text-slate-500">Компонент: {section.type}</div>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative group border-2 rounded-lg transition-all ${
        isSelected ? 'border-primary' : 'border-transparent hover:border-slate-300'
      }`}
      onClick={onSelect}
    >
      {/* Section Controls */}
      {isSelected && (
        <div className="absolute -top-10 left-0 flex space-x-2 z-10">
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline">
            <Move className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="outline" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
      
      <div className="p-4">
        {renderContent()}
      </div>
    </div>
  );
}

// Section Editor Modal
function SectionEditor({
  section,
  isOpen,
  onClose,
  onUpdate,
}: {
  section: PageSection;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<PageSection>) => void;
}) {
  const [content, setContent] = useState(section.content);
  const [styles, setStyles] = useState(section.styles || {});

  const handleSave = () => {
    onUpdate({ content, styles });
    onClose();
  };

  const renderEditor = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Заголовок</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => setContent({ ...content, title: e.target.value })}
                placeholder="Заголовок героя"
              />
            </div>
            <div>
              <Label>Подзаголовок</Label>
              <Textarea
                value={content.subtitle || ''}
                onChange={(e) => setContent({ ...content, subtitle: e.target.value })}
                placeholder="Подзаголовок"
                rows={3}
              />
            </div>
            <div>
              <Label>Текст кнопки</Label>
              <Input
                value={content.buttonText || ''}
                onChange={(e) => setContent({ ...content, buttonText: e.target.value })}
                placeholder="Call to Action"
              />
            </div>
          </div>
        );
      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <Label>Текст</Label>
              <Input
                value={content.text || ''}
                onChange={(e) => setContent({ ...content, text: e.target.value })}
                placeholder="Текст заголовка"
              />
            </div>
            <div>
              <Label>Уровень</Label>
              <Select 
                value={content.level?.toString() || '2'} 
                onValueChange={(value) => setContent({ ...content, level: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">H1</SelectItem>
                  <SelectItem value="2">H2</SelectItem>
                  <SelectItem value="3">H3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'paragraph':
        return (
          <div>
            <Label>Текст</Label>
            <Textarea
              value={content.text || ''}
              onChange={(e) => setContent({ ...content, text: e.target.value })}
              placeholder="Текст параграфа"
              rows={5}
            />
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>URL изображения</Label>
              <Input
                value={content.url || ''}
                onChange={(e) => setContent({ ...content, url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label>Alt текст</Label>
              <Input
                value={content.alt || ''}
                onChange={(e) => setContent({ ...content, alt: e.target.value })}
                placeholder="Описание изображения"
              />
            </div>
          </div>
        );
      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label>Текст кнопки</Label>
              <Input
                value={content.text || ''}
                onChange={(e) => setContent({ ...content, text: e.target.value })}
                placeholder="Текст кнопки"
              />
            </div>
            <div>
              <Label>Стиль</Label>
              <Select 
                value={content.style || 'primary'} 
                onValueChange={(value) => setContent({ ...content, style: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="primary">Primary</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-8">
            <Settings className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500">Редактор для этого компонента пока не реализован</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редактировать {section.type}</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          {renderEditor()}
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper functions
function getDefaultContent(type: string) {
  switch (type) {
    case 'hero':
      return {
        title: 'Заголовок героя',
        subtitle: 'Подзаголовок с описанием',
        buttonText: 'Call to Action',
      };
    case 'heading':
      return {
        text: 'Новый заголовок',
        level: 2,
      };
    case 'paragraph':
      return {
        text: 'Новый параграф текста...',
      };
    case 'image':
      return {
        url: '',
        alt: '',
      };
    case 'button':
      return {
        text: 'Кнопка',
        style: 'primary',
      };
    case 'columns':
      return {
        columns: 2,
      };
    default:
      return {};
  }
}

function getDefaultStyles(type: string) {
  return {
    margin: '0',
    padding: '16px',
  };
}
