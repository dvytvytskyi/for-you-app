# Інструкція: Інтеграція Documents API в мобільний додаток

## 📋 Огляд

✅ **Бекенд готовий!** Всі endpoints працюють та протестовані.

Потрібно реалізувати інтеграцію в мобільному додатку для:
- Завантаження документів
- Перегляду документів
- Управління документами (оновлення, видалення)

---

## ✅ Статус бекенду

- ✅ Entity Document з усіма полями
- ✅ Routes з 7 endpoints (всі працюють)
- ✅ Middleware requireBrokerOrAdmin для перевірки ролей
- ✅ Інтеграція з Cloudinary для зберігання файлів
- ✅ SQL міграція виконана (таблиця documents створена)
- ✅ Endpoints протестовано та працюють
- ✅ Документація створена (DOCUMENTS_API_GUIDE.md)
- ✅ Тестовий скрипт готовий (test-documents.sh)

### Швидкий тест бекенду:

```bash
# Отримати admin token
TOKEN=$(curl -s -X POST https://admin.foryou-realestate.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@foryou-realestate.com","password":"Admin123!"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])")

# Отримати всі документи (ADMIN)
curl -X GET "https://admin.foryou-realestate.com/api/v1/documents" \
  -H "Authorization: Bearer $TOKEN"
```

Або запустити тестовий скрипт:
```bash
./admin-panel-backend/test-documents.sh
```

---

## 🎯 Backend Endpoints (готові)

### Базовий URL
```
https://admin.foryou-realestate.com/api/v1/documents
```

**Примітка:** Файли зберігаються на **Cloudinary** (не S3), в папці `documents/{entityType}/{entityId}/`

### Endpoints

1. **POST** `/documents/upload` - Завантажити документ
   - **Auth:** Required (BROKER, ADMIN)
   - **Content-Type:** `multipart/form-data`
   - **Body:**
     - `file` (binary) - файл
     - `type` (enum) - тип документа
     - `entityType` (enum) - категорія (PROPERTY, LEAD, USER)
     - `entityId` (uuid) - ID сутності
     - `description` (string, optional) - опис
     - `isPublic` (boolean, optional) - чи публічний (default: false)

2. **GET** `/documents/entity/:entityType/:entityId` - Отримати документи для сутності
   - **Auth:** Optional
   - **Response:** Array of Document

3. **GET** `/documents/:id` - Отримати документ по ID
   - **Auth:** Optional
   - **Response:** Document

4. **PATCH** `/documents/:id` - Оновити метадані документа
   - **Auth:** Required
   - **Body:** `{ description?: string }`

5. **DELETE** `/documents/:id` - Видалити документ
   - **Auth:** Required
   - **Response:** `{ message: "Document deleted successfully" }`

6. **POST** `/documents/:id/verify` - Верифікувати документ (тільки ADMIN)
   - **Auth:** Required (ADMIN only)

7. **GET** `/documents` - Всі документи з фільтрами (тільки ADMIN)
   - **Auth:** Required (ADMIN only)
   - **Query params:** `entityType`, `type`, `isVerified`, `page`, `limit`

---

## 📦 Крок 1: Встановлення залежностей

```bash
cd mobile
npx expo install expo-document-picker expo-file-system
```

**Залежності:**
- `expo-document-picker` - для вибору файлів
- `expo-file-system` - для роботи з файлами (опціонально, для кешування)

---

## 📝 Крок 2: Створити API клієнт

**Створити файл:** `mobile/api/documents.ts`

```typescript
import { backendApiClient } from './backend-client';
import * as DocumentPicker from 'expo-document-picker';

// Типи відповідно до бекенду
export enum DocumentType {
  // Property documents
  BROCHURE = 'BROCHURE',
  FLOOR_PLAN = 'FLOOR_PLAN',
  MASTER_PLAN = 'MASTER_PLAN',
  PROPERTY_CONTRACT = 'PROPERTY_CONTRACT',
  PROPERTY_CERTIFICATE = 'PROPERTY_CERTIFICATE',
  
  // Lead documents
  LEAD_CONTRACT = 'LEAD_CONTRACT',
  CLIENT_ID = 'CLIENT_ID',
  CLIENT_PASSPORT = 'CLIENT_PASSPORT',
  POWER_OF_ATTORNEY = 'POWER_OF_ATTORNEY',
  
  // User documents (Broker)
  BROKER_LICENSE = 'BROKER_LICENSE',
  BROKER_CERTIFICATE = 'BROKER_CERTIFICATE',
  
  // Other
  OTHER = 'OTHER',
}

export enum DocumentCategory {
  PROPERTY = 'PROPERTY',
  LEAD = 'LEAD',
  USER = 'USER',
}

export interface Document {
  id: string;
  type: DocumentType;
  entityType: DocumentCategory;
  entityId: string;
  fileName: string;
  originalName: string;
  fileUrl: string;
  s3Key?: string; // Cloudinary public_id (опціонально)
  mimeType: string;
  fileSize: number; // в байтах
  description?: string;
  isPublic: boolean;
  isVerified: boolean;
  uploadedBy: string;
  verifiedBy?: string;
  verifiedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentDto {
  type: DocumentType;
  entityType: DocumentCategory;
  entityId: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateDocumentDto {
  description?: string;
}

export const documentsApi = {
  /**
   * Завантажити документ
   */
  async upload(
    dto: UploadDocumentDto,
    onProgress?: (progress: number) => void,
  ): Promise<Document> {
    // 1. Вибрати файл
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        'application/pdf',
        'image/*',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      throw new Error('File selection canceled');
    }

    const file = result.assets[0];

    // Перевірка розміру (20MB)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size && file.size > maxSize) {
      throw new Error('File size exceeds 20MB limit');
    }

    // 2. Створити FormData
    const formData = new FormData();

    // Додати файл
    formData.append('file', {
      uri: file.uri,
      name: file.name || 'document',
      type: file.mimeType || 'application/octet-stream',
    } as any);

    // Додати метадані
    formData.append('type', dto.type);
    formData.append('entityType', dto.entityType);
    formData.append('entityId', dto.entityId);
    
    if (dto.description) {
      formData.append('description', dto.description);
    }
    
    if (dto.isPublic !== undefined) {
      formData.append('isPublic', dto.isPublic.toString());
    }

    // 3. Відправити запит
    const response = await backendApiClient.post<{ success: boolean; data: Document }>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    });

    // Бекенд повертає { success: true, data: Document }
    return response.data.data;
  },

  /**
   * Отримати документи для сутності
   */
  async getByEntity(
    entityType: DocumentCategory,
    entityId: string,
  ): Promise<Document[]> {
    const response = await backendApiClient.get<{ success: boolean; data: Document[] }>(
      `/documents/entity/${entityType}/${entityId}`,
    );
    // Бекенд повертає { success: true, data: Document[] }
    return response.data.data;
  },

  /**
   * Отримати документ по ID
   */
  async getById(id: string): Promise<Document> {
    const response = await backendApiClient.get<{ success: boolean; data: Document }>(`/documents/${id}`);
    // Бекенд повертає { success: true, data: Document }
    return response.data.data;
  },

  /**
   * Оновити метадані документа
   */
  async update(id: string, dto: UpdateDocumentDto): Promise<Document> {
    const response = await backendApiClient.patch<{ success: boolean; data: Document }>(`/documents/${id}`, dto);
    // Бекенд повертає { success: true, data: Document }
    return response.data.data;
  },

  /**
   * Видалити документ
   */
  async delete(id: string): Promise<void> {
    await backendApiClient.delete(`/documents/${id}`);
  },

  /**
   * Верифікувати документ (тільки ADMIN)
   */
  async verify(id: string): Promise<Document> {
    const response = await backendApiClient.post<{ success: boolean; data: Document }>(`/documents/${id}/verify`);
    // Бекенд повертає { success: true, data: Document }
    return response.data.data;
  },

  /**
   * Отримати всі документи з фільтрами (тільки ADMIN)
   */
  async getAll(filters?: {
    entityType?: DocumentCategory;
    type?: DocumentType;
    isVerified?: boolean;
    page?: number;
    limit?: number;
  }): Promise<{ data: Document[]; total: number; page: number; totalPages: number }> {
    const response = await backendApiClient.get<{ 
      success: boolean; 
      data: { data: Document[]; total: number; page: number; totalPages: number } 
    }>('/documents', { params: filters });
    // Бекенд повертає { success: true, data: { data: [...], total, page, totalPages } }
    return response.data.data;
  },

  /**
   * Форматувати розмір файлу
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Отримати іконку для типу файлу
   */
  getFileIcon(mimeType: string): string {
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('image')) return '🖼️';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊';
    return '📎';
  },

  /**
   * Перевірити чи можна відкрити файл
   */
  canOpenFile(mimeType: string): boolean {
    return (
      mimeType.includes('pdf') ||
      mimeType.includes('image') ||
      mimeType.includes('text')
    );
  },
};
```

---

## 🎨 Крок 3: Створити UI компоненти

### 3.1. Компонент для відображення списку документів

**Створити файл:** `mobile/components/documents/DocumentList.tsx`

```typescript
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Document, documentsApi, DocumentCategory } from '@/api/documents';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Linking from 'expo-linking';

interface DocumentListProps {
  entityType: DocumentCategory;
  entityId: string;
  onUploadPress?: () => void;
  showUploadButton?: boolean;
}

export function DocumentList({ entityType, entityId, onUploadPress, showUploadButton = true }: DocumentListProps) {
  const queryClient = useQueryClient();

  // Отримати документи
  const { data: documents, isLoading } = useQuery({
    queryKey: ['documents', entityType, entityId],
    queryFn: () => documentsApi.getByEntity(entityType, entityId),
  });

  // Видалити документ
  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
    },
  });

  const handleOpenDocument = async (document: Document) => {
    try {
      const canOpen = documentsApi.canOpenFile(document.mimeType);
      if (canOpen) {
        await Linking.openURL(document.fileUrl);
      } else {
        // Для файлів, які не можна відкрити, можна показати повідомлення
        alert('Цей тип файлу не можна відкрити в додатку. Завантажте його для перегляду.');
      }
    } catch (error) {
      console.error('Error opening document:', error);
      alert('Помилка відкриття документа');
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Немає документів</Text>
        {showUploadButton && onUploadPress && (
          <TouchableOpacity style={styles.uploadButton} onPress={onUploadPress}>
            <Text style={styles.uploadButtonText}>Завантажити документ</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showUploadButton && onUploadPress && (
        <TouchableOpacity style={styles.uploadButton} onPress={onUploadPress}>
          <Text style={styles.uploadButtonText}>+ Завантажити документ</Text>
        </TouchableOpacity>
      )}

      {documents.map((document) => (
        <View key={document.id} style={styles.documentItem}>
          <TouchableOpacity
            style={styles.documentContent}
            onPress={() => handleOpenDocument(document)}
          >
            <Text style={styles.documentIcon}>
              {documentsApi.getFileIcon(document.mimeType)}
            </Text>
            <View style={styles.documentInfo}>
              <Text style={styles.documentName}>{document.originalName}</Text>
              <Text style={styles.documentMeta}>
                {documentsApi.formatFileSize(document.fileSize)} • {document.type}
              </Text>
              {document.description && (
                <Text style={styles.documentDescription}>{document.description}</Text>
              )}
              {document.isVerified && (
                <Text style={styles.verifiedBadge}>✓ Верифіковано</Text>
              )}
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => {
              if (confirm('Видалити документ?')) {
                deleteMutation.mutate(document.id);
              }
            }}
          >
            <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginVertical: 20,
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  documentItem: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  documentContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  documentMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  documentDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  verifiedBadge: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 4,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 20,
  },
});
```

### 3.2. Компонент для завантаження документа

**Створити файл:** `mobile/components/documents/UploadDocumentModal.tsx`

```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { documentsApi, DocumentType, DocumentCategory, UploadDocumentDto } from '@/api/documents';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UploadDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  entityType: DocumentCategory;
  entityId: string;
  documentType: DocumentType;
}

export function UploadDocumentModal({
  visible,
  onClose,
  entityType,
  entityId,
  documentType,
}: UploadDocumentModalProps) {
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (dto: UploadDocumentDto) =>
      documentsApi.upload(dto, (progress) => setUploadProgress(progress)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents', entityType, entityId] });
      Alert.alert('Успіх', 'Документ успішно завантажено');
      onClose();
      setDescription('');
      setIsPublic(false);
      setUploadProgress(0);
    },
    onError: (error: any) => {
      Alert.alert('Помилка', error.message || 'Не вдалося завантажити документ');
      setUploadProgress(0);
    },
  });

  const handleUpload = () => {
    uploadMutation.mutate({
      type: documentType,
      entityType,
      entityId,
      description: description || undefined,
      isPublic,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Завантажити документ</Text>

          <Text style={styles.label}>Тип: {documentType}</Text>

          <Text style={styles.label}>Опис (опціонально)</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={setDescription}
            placeholder="Введіть опис документа"
            multiline
            numberOfLines={3}
          />

          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setIsPublic(!isPublic)}
          >
            <Text>{isPublic ? '☑️' : '☐'} Публічний документ</Text>
          </TouchableOpacity>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <View style={styles.progressContainer}>
              <Text>Завантаження: {Math.round(uploadProgress)}%</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${uploadProgress}%` }]} />
              </View>
            </View>
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={uploadMutation.isPending}
            >
              <Text style={styles.cancelButtonText}>Скасувати</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.uploadButton]}
              onPress={handleUpload}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.uploadButtonText}>Завантажити</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    marginLeft: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
```

---

## 🔗 Крок 4: Інтеграція в існуючі екрани

### 4.1. Додати документи до профілю користувача

**Оновити файл:** `mobile/app/profile.tsx` (або ваш екран профілю)

```typescript
import { DocumentList } from '@/components/documents/DocumentList';
import { UploadDocumentModal } from '@/components/documents/UploadDocumentModal';
import { DocumentCategory, DocumentType } from '@/api/documents';
import { useAuthStore } from '@/store/authStore';

export default function ProfileScreen() {
  const { user } = useAuthStore();
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType>(DocumentType.BROKER_LICENSE);

  if (!user) return null;

  return (
    <View>
      {/* Інші компоненти профілю */}
      
      <Text style={styles.sectionTitle}>Мої документи</Text>
      <DocumentList
        entityType={DocumentCategory.USER}
        entityId={user.id}
        onUploadPress={() => setUploadModalVisible(true)}
      />

      <UploadDocumentModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        entityType={DocumentCategory.USER}
        entityId={user.id}
        documentType={selectedDocumentType}
      />
    </View>
  );
}
```

### 4.2. Додати документи до деталей нерухомості

**Оновити файл:** `mobile/app/properties/[id].tsx`

```typescript
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentCategory, DocumentType } from '@/api/documents';

export default function PropertyDetailsScreen({ route }) {
  const { propertyId } = route.params;
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  return (
    <ScrollView>
      {/* Інші компоненти деталей */}
      
      <Text style={styles.sectionTitle}>Документи</Text>
      <DocumentList
        entityType={DocumentCategory.PROPERTY}
        entityId={propertyId}
        onUploadPress={() => setUploadModalVisible(true)}
        showUploadButton={user?.role === 'BROKER' || user?.role === 'ADMIN'}
      />

      <UploadDocumentModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        entityType={DocumentCategory.PROPERTY}
        entityId={propertyId}
        documentType={DocumentType.BROCHURE}
      />
    </ScrollView>
  );
}
```

### 4.3. Додати документи до деталей lead

**Оновити файл:** `mobile/app/leads/[id].tsx`

```typescript
import { DocumentList } from '@/components/documents/DocumentList';
import { DocumentCategory, DocumentType } from '@/api/documents';

export default function LeadDetailsScreen({ route }) {
  const { leadId } = route.params;
  const [uploadModalVisible, setUploadModalVisible] = useState(false);

  return (
    <ScrollView>
      {/* Інші компоненти деталей lead */}
      
      <Text style={styles.sectionTitle}>Документи</Text>
      <DocumentList
        entityType={DocumentCategory.LEAD}
        entityId={leadId}
        onUploadPress={() => setUploadModalVisible(true)}
        showUploadButton={user?.role === 'BROKER' || user?.role === 'ADMIN'}
      />

      <UploadDocumentModal
        visible={uploadModalVisible}
        onClose={() => setUploadModalVisible(false)}
        entityType={DocumentCategory.LEAD}
        entityId={leadId}
        documentType={DocumentType.LEAD_CONTRACT}
      />
    </ScrollView>
  );
}
```

---

## 📋 Обмеження та вимоги

### Дозволені типи файлів:
- ✅ PDF (`application/pdf`)
- ✅ Images: JPEG, PNG, WebP (`image/jpeg`, `image/png`, `image/webp`)
- ✅ Word: DOC, DOCX (`application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`)
- ✅ Excel: XLS, XLSX (`application/vnd.ms-excel`, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`)

### Обмеження:
- **Максимальний розмір файлу:** 20MB
- **Авторизація:** Завантаження доступне тільки для BROKER та ADMIN
- **Перегляд:** Публічні документи доступні всім, приватні - тільки власнику
- **Зберігання:** Файли зберігаються на **Cloudinary** (не S3) в папці `documents/{entityType}/{entityId}/`

### Response формат:
Всі endpoints повертають дані в форматі:
```json
{
  "success": true,
  "data": { ... },
  "message": "..." // опціонально
}
```

**Важливо:** При обробці відповідей з бекенду використовуйте `response.data.data` (не `response.data`).

---

## 🧪 Тестування

### Тест 1: Завантаження документа
1. Відкрити екран з документами
2. Натиснути "Завантажити документ"
3. Вибрати файл (PDF, Image, Word, Excel)
4. Заповнити опис (опціонально)
5. Натиснути "Завантажити"
6. Перевірити що документ з'явився в списку

### Тест 2: Перегляд документа
1. Натиснути на документ в списку
2. Перевірити що документ відкривається (PDF, Images)
3. Для Word/Excel - перевірити що показується повідомлення про завантаження

### Тест 3: Видалення документа
1. Натиснути кнопку видалення
2. Підтвердити видалення
3. Перевірити що документ видалено зі списку

---

## 🐛 Можливі проблеми

### Проблема: "File size exceeds 20MB limit"
**Рішення:** Перевіряти розмір файлу перед завантаженням

### Проблема: "Invalid file type"
**Рішення:** Перевіряти mimeType файлу перед завантаженням

### Проблема: "Unauthorized"
**Рішення:** Перевірити що користувач має роль BROKER або ADMIN

### Проблема: Документ не відкривається
**Рішення:** Використовувати `Linking.openURL()` для PDF та Images, для інших типів - показувати повідомлення про завантаження

---

## ✅ Чеклист реалізації

- [ ] Встановлено залежності (`expo-document-picker`, `expo-file-system`)
- [ ] Створено `mobile/api/documents.ts` з усіма методами
- [ ] Створено компонент `DocumentList.tsx`
- [ ] Створено компонент `UploadDocumentModal.tsx`
- [ ] Інтегровано в екран профілю
- [ ] Інтегровано в екран деталей нерухомості
- [ ] Інтегровано в екран деталей lead
- [ ] Протестовано завантаження
- [ ] Протестовано перегляд
- [ ] Протестовано видалення

---

**Останнє оновлення:** Грудень 2025
