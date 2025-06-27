import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Move,
  Type,
  Mail,
  Phone,
  Calendar,
  CheckSquare,
  ToggleLeft,
  List,
  FileText,
  Save,
  Settings,
  Eye
} from "lucide-react";

interface FormField {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  validation?: any;
}

interface FormSettings {
  name: string;
  description: string;
  submitText: string;
  successMessage: string;
  emailNotifications: boolean;
  telegramNotifications: boolean;
  redirectUrl?: string;
}

interface FormBuilderProps {
  onSave?: (formData: { fields: FormField[]; settings: FormSettings }) => void;
}

const fieldTypes = [
  { type: 'text', icon: Type, label: 'Текст', category: 'input' },
  { type: 'email', icon: Mail, label: 'Email', category: 'input' },
  { type: 'phone', icon: Phone, label: 'Телефон', category: 'input' },
  { type: 'textarea', icon: FileText, label: 'Многострочный текст', category: 'input' },
  { type: 'select', icon: List, label: 'Выбор из списка', category: 'choice' },
  { type: 'checkbox', icon: CheckSquare, label: 'Флажки', category: 'choice' },
  { type: 'radio', icon: ToggleLeft, label: 'Переключатели', category: 'choice' },
  { type: 'date', icon: Calendar, label: 'Дата', category: 'input' },
];

export default function FormBuilder({ onSave }: FormBuilderProps) {
  const [fields, setFields] = useState<FormField[]>([]);
  const [settings, setSettings] = useState<FormSettings>({
    name: '',
    description: '',
    submitText: 'Отправить',
    successMessage: 'Спасибо! Ваша заявка отправлена.',
    emailNotifications: true,
    telegramNotifications: true,
  });
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isEditingField, setIsEditingField] = useState(false);
  const [activeTab, setActiveTab] = useState('fields');

  const addField = (type: string) => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      type,
      label: getDefaultLabel(type),
      placeholder: getDefaultPlaceholder(type),
      required: false,
      options: type === 'select' || type === 'checkbox' || type === 'radio' ? ['Вариант 1', 'Вариант 2'] : undefined,
    };

    setFields(prev => [...prev, newField]);
  };

  const removeField = (fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId));
    setSelectedField(null);
  };

  const updateField = (fieldId: string, updates: Partial<FormField>) => {
    setFields(prev => prev.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const moveField = (fromIndex: number, toIndex: number) => {
    setFields(prev => {
      const newFields = [...prev];
      const [movedField] = newFields.splice(fromIndex, 1);
      newFields.splice(toIndex, 0, movedField);
      return newFields;
    });
  };

  const handleSave = () => {
    onSave?.({ fields, settings });
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Конструктор форм</h3>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fields">Поля</TabsTrigger>
              <TabsTrigger value="settings">Настройки</TabsTrigger>
            </TabsList>
            
            <TabsContent value="fields" className="mt-4">
              <div className="space-y-4">
                {['input', 'choice'].map(category => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-slate-700 mb-2">
                      {category === 'input' ? 'Поля ввода' : 'Поля выбора'}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {fieldTypes
                        .filter(field => field.category === category)
                        .map(fieldType => {
                          const Icon = fieldType.icon;
                          return (
                            <Button
                              key={fieldType.type}
                              variant="outline"
                              className="justify-start h-auto p-3"
                              onClick={() => addField(fieldType.type)}
                            >
                              <Icon className="h-4 w-4 mr-2" />
                              {fieldType.label}
                            </Button>
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
                  <Label htmlFor="form-name">Название формы</Label>
                  <Input
                    id="form-name"
                    value={settings.name}
                    onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Форма обратной связи"
                  />
                </div>
                
                <div>
                  <Label htmlFor="form-description">Описание</Label>
                  <Textarea
                    id="form-description"
                    value={settings.description}
                    onChange={(e) => setSettings(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Описание формы"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="submit-text">Текст кнопки</Label>
                  <Input
                    id="submit-text"
                    value={settings.submitText}
                    onChange={(e) => setSettings(prev => ({ ...prev, submitText: e.target.value }))}
                    placeholder="Отправить"
                  />
                </div>
                
                <div>
                  <Label htmlFor="success-message">Сообщение об успехе</Label>
                  <Textarea
                    id="success-message"
                    value={settings.successMessage}
                    onChange={(e) => setSettings(prev => ({ ...prev, successMessage: e.target.value }))}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
                    />
                    <Label htmlFor="email-notifications">Email уведомления</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="telegram-notifications"
                      checked={settings.telegramNotifications}
                      onCheckedChange={(checked) => setSettings(prev => ({ ...prev, telegramNotifications: checked }))}
                    />
                    <Label htmlFor="telegram-notifications">Telegram уведомления</Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600">
              {fields.length} полей
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Предпросмотр
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Сохранить форму
            </Button>
          </div>
        </div>

        {/* Form Canvas */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>
                  {settings.name || 'Новая форма'}
                </CardTitle>
                {settings.description && (
                  <p className="text-slate-600">{settings.description}</p>
                )}
              </CardHeader>
              <CardContent>
                {fields.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-slate-300 rounded-lg">
                    <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 mb-2">
                      Добавьте поля формы
                    </h3>
                    <p className="text-slate-500">
                      Выберите поля из левой панели для создания формы
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {fields.map((field, index) => (
                      <FieldRenderer
                        key={field.id}
                        field={field}
                        isSelected={selectedField === field.id}
                        onSelect={() => setSelectedField(field.id)}
                        onEdit={() => setIsEditingField(true)}
                        onDelete={() => removeField(field.id)}
                        onUpdate={(updates) => updateField(field.id, updates)}
                        index={index}
                      />
                    ))}
                    
                    <Button className="w-full mt-6">
                      {settings.submitText}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Field Editor Modal */}
      {selectedField && isEditingField && (
        <FieldEditor
          field={fields.find(f => f.id === selectedField)!}
          isOpen={isEditingField}
          onClose={() => setIsEditingField(false)}
          onUpdate={(updates) => updateField(selectedField, updates)}
        />
      )}
    </div>
  );
}

// Field Renderer Component
function FieldRenderer({ 
  field, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDelete, 
  onUpdate,
  index 
}: {
  field: FormField;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
  index: number;
}) {
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <Input
            placeholder={field.placeholder}
            type={field.type}
            disabled
          />
        );
      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            rows={3}
            disabled
          />
        );
      case 'select':
        return (
          <Select disabled>
            <SelectTrigger>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option, i) => (
                <SelectItem key={i} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input type="checkbox" disabled className="rounded" />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <input type="radio" name={field.id} disabled />
                <label className="text-sm">{option}</label>
              </div>
            ))}
          </div>
        );
      case 'date':
        return (
          <Input
            type="date"
            disabled
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`relative group border-2 rounded-lg p-4 transition-all ${
        isSelected ? 'border-primary' : 'border-transparent hover:border-slate-300'
      }`}
      onClick={onSelect}
    >
      {/* Field Controls */}
      {isSelected && (
        <div className="absolute -top-10 right-0 flex space-x-2 z-10">
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
      
      <div className="space-y-2">
        <Label className="flex items-center space-x-1">
          <span>{field.label}</span>
          {field.required && <span className="text-red-500">*</span>}
        </Label>
        {renderField()}
      </div>
    </div>
  );
}

// Field Editor Modal
function FieldEditor({
  field,
  isOpen,
  onClose,
  onUpdate,
}: {
  field: FormField;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updates: Partial<FormField>) => void;
}) {
  const [formData, setFormData] = useState(field);

  const handleSave = () => {
    onUpdate(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редактировать поле: {field.type}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label>Название поля</Label>
            <Input
              value={formData.label}
              onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
              placeholder="Название поля"
            />
          </div>
          
          <div>
            <Label>Подсказка (placeholder)</Label>
            <Input
              value={formData.placeholder || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, placeholder: e.target.value }))}
              placeholder="Текст подсказки"
            />
          </div>
          
          {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && (
            <div>
              <Label>Варианты ответов</Label>
              <div className="space-y-2">
                {formData.options?.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(formData.options || [])];
                        newOptions[index] = e.target.value;
                        setFormData(prev => ({ ...prev, options: newOptions }));
                      }}
                      placeholder={`Вариант ${index + 1}`}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newOptions = formData.options?.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, options: newOptions }));
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newOptions = [...(formData.options || []), ''];
                    setFormData(prev => ({ ...prev, options: newOptions }));
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Добавить вариант
                </Button>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2">
            <Switch
              checked={formData.required}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
            />
            <Label>Обязательное поле</Label>
          </div>
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
function getDefaultLabel(type: string) {
  const labels = {
    text: 'Текстовое поле',
    email: 'Email',
    phone: 'Телефон',
    textarea: 'Сообщение',
    select: 'Выбор из списка',
    checkbox: 'Флажки',
    radio: 'Переключатели',
    date: 'Дата',
  };
  return labels[type as keyof typeof labels] || 'Поле';
}

function getDefaultPlaceholder(type: string) {
  const placeholders = {
    text: 'Введите текст',
    email: 'example@email.com',
    phone: '+7 (999) 123-45-67',
    textarea: 'Ваше сообщение...',
    select: 'Выберите вариант',
    date: 'Выберите дату',
  };
  return placeholders[type as keyof typeof placeholders] || '';
}
