import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Upload, 
  Search, 
  Filter,
  ArrowLeft,
  Image,
  FileText,
  File,
  Trash2,
  Copy,
  Download,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface MediaFile {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  alt: string;
  createdAt: string;
}

export default function MediaLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: mediaFiles, isLoading } = useQuery<MediaFile[]>({
    queryKey: ['/api/admin/media'],
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch('/api/admin/media/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/media'] });
      setIsUploadDialogOpen(false);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest('DELETE', `/api/admin/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/media'] });
      toast({
        title: "Success",
        description: "File deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('alt', file.name);

    uploadMutation.mutate(formData);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (mimeType.includes('pdf')) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const filteredFiles = mediaFiles?.filter((file) =>
    file.originalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    file.alt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Image className="h-6 w-6 text-primary" />
              <div>
                <h1 className="font-semibold text-slate-900">Media Library</h1>
                <p className="text-sm text-slate-600">Manage your media files</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Button 
                size="sm" 
                className="btn-primary"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredFiles?.length === 0 ? (
          <div className="text-center py-12">
            <Image className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No files found</h3>
            <p className="text-slate-500 mb-4">
              {searchTerm ? "Try adjusting your search" : "Upload your first file to get started"}
            </p>
            <Button 
              className="btn-primary"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredFiles?.map((file) => (
              <Card 
                key={file.id} 
                className="card-hover cursor-pointer"
                onClick={() => setSelectedFile(file)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-slate-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                    {file.mimeType.startsWith('image/') ? (
                      <img
                        src={file.url}
                        alt={file.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-slate-400">
                        {getFileIcon(file.mimeType)}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-slate-900 truncate">
                      {file.originalName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragOver ? 'border-primary bg-primary/5' : 'border-slate-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-700 mb-2">
              Drag and drop files here, or click to select
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Supports: JPG, PNG, GIF, WebP, SVG, PDF, DOC, DOCX (max 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.doc,.docx"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Select Files"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* File Details Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>File Details</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <div className="space-y-4">
              <div className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden">
                {selectedFile.mimeType.startsWith('image/') ? (
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.alt}
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <div className="text-slate-400 text-center">
                    {getFileIcon(selectedFile.mimeType)}
                    <p className="mt-2 text-sm">{selectedFile.originalName}</p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="font-medium text-slate-700">Filename:</label>
                  <p className="text-slate-600">{selectedFile.originalName}</p>
                </div>
                <div>
                  <label className="font-medium text-slate-700">File Size:</label>
                  <p className="text-slate-600">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <label className="font-medium text-slate-700">Type:</label>
                  <p className="text-slate-600">{selectedFile.mimeType}</p>
                </div>
                <div>
                  <label className="font-medium text-slate-700">Upload Date:</label>
                  <p className="text-slate-600">
                    {new Date(selectedFile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="font-medium text-slate-700">URL:</label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input value={selectedFile.url} readOnly className="text-sm" />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(selectedFile.url)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between pt-4">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(selectedFile.url, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const a = document.createElement('a');
                      a.href = selectedFile.url;
                      a.download = selectedFile.originalName;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (confirm("Are you sure you want to delete this file?")) {
                      deleteMutation.mutate(selectedFile.id);
                      setSelectedFile(null);
                    }
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
