import React, { useState, useRef, useEffect } from 'react';
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonText,
  IonChip,
  IonNote,
  IonList,
  IonButtons
} from '@ionic/react';
import { 
  settings, 
  eye, 
  eyeOff, 
  key, 
  close, 
  save, 
  openOutline, 
  chevronDown 
} from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ApiKeys, AIProvider, ImageProvider } from '../types';
import { AI_PROVIDERS, getProviderConfig, getProviderList } from '../config/aiProviders';
import { IMAGE_PROVIDERS, getImageProviderConfig, getImageProviderList } from '../config/imageProviders';

interface ApiKeySettingsProps {
  apiKeys: ApiKeys;
  onSave: (keys: ApiKeys) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({
  apiKeys,
  onSave,
  onClose,
  isOpen
}) => {
  const [formKeys, setFormKeys] = useState<ApiKeys>(apiKeys);
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({
    openaiKey: false,
    anthropicKey: false,
    googleKey: false,
    azureKey: false,
    metaKey: false,
    groqKey: false,
    pixabayKey: false,
    pexelsKey: false,
    unsplashKey: false
  });

  const triggerHaptic = async () => {
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch (error) {
      // Haptics not available on web
    }
  };

  // Update form keys when modal opens to reflect current apiKeys
  useEffect(() => {
    if (isOpen) {
      setFormKeys(apiKeys);
    }
  }, [isOpen, apiKeys]);

  const handleSave = () => {
    triggerHaptic();
    // Validate that paid AI providers have API keys
    if (formKeys.selectedAIProvider !== 'free') {
      const keyField = `${formKeys.selectedAIProvider}Key` as keyof ApiKeys;
      const apiKeyValue = formKeys[keyField] as string;

      if (!apiKeyValue || !apiKeyValue.trim()) {
        // Show error - don't save
        alert(`Please enter your ${selectedProvider.name} API key before saving.`);
        return;
      }
    }

    // Validate that paid image providers have API keys (only when free AI is selected)
    if (formKeys.selectedAIProvider === 'free' && selectedImageProvider.requiresApiKey) {
      const keyField = `${formKeys.selectedImageProvider}Key` as keyof ApiKeys;
      const apiKeyValue = formKeys[keyField] as string;

      if (!apiKeyValue || !apiKeyValue.trim()) {
        // Show error - don't save
        alert(`Please enter your ${selectedImageProvider.name} API key before saving.`);
        return;
      }
    }

    onSave(formKeys);
    onClose();
  };

  const handleClose = () => {
    triggerHaptic();
    onClose();
  };

  const handleInputChange = (field: keyof ApiKeys, value: string) => {
    setFormKeys(prev => {
      const updated = { ...prev, [field]: value };

      // If user clears a paid AI provider's key, auto-switch to free
      if (field.includes('Key') && field !== 'unsplashKey' && field !== 'pixabayKey' && field !== 'pexelsKey' && value.trim() === '') {
        const providerField = field.replace('Key', '') as AIProvider;
        if (updated.selectedAIProvider === providerField) {
          updated.selectedAIProvider = 'free';
        }
      }

      return updated;
    });
  };

  const handleProviderSelect = (providerId: AIProvider) => {
    triggerHaptic();
    setFormKeys(prev => ({ ...prev, selectedAIProvider: providerId }));
  };

  const handleImageProviderSelect = (providerId: ImageProvider) => {
    triggerHaptic();
    setFormKeys(prev => ({ ...prev, selectedImageProvider: providerId }));
  };

  const toggleKeyVisibility = (keyName: string) => {
    triggerHaptic();
    setShowApiKeys(prev => ({ ...prev, [keyName]: !prev[keyName] }));
  };

  const selectedProvider = getProviderConfig(formKeys.selectedAIProvider);
  const selectedImageProvider = getImageProviderConfig(formKeys.selectedImageProvider);
  const imageProviderList = getImageProviderList();

  // Check if all required API keys are provided
  const isValidConfiguration = () => {
    // Check AI provider
    if (formKeys.selectedAIProvider !== 'free') {
      const keyField = `${formKeys.selectedAIProvider}Key` as keyof ApiKeys;
      const apiKeyValue = formKeys[keyField] as string;
      if (!apiKeyValue || !apiKeyValue.trim()) {
        return false;
      }
    }

    // Check image provider (only when free AI is selected)
    if (formKeys.selectedAIProvider === 'free' && selectedImageProvider.requiresApiKey) {
      const keyField = `${formKeys.selectedImageProvider}Key` as keyof ApiKeys;
      const apiKeyValue = formKeys[keyField] as string;
      if (!apiKeyValue || !apiKeyValue.trim()) {
        return false;
      }
    }

    return true;
  };

  const canSave = isValidConfiguration();

  // Always show all providers including free option for easy switching
  const providerList = getProviderList();

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleClose}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>API Settings</IonTitle>
          <IonButtons slot="end">
            <IonButton fill="clear" onClick={handleClose} data-testid="close-settings">
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {/* Info Card */}
        <IonCard className="mx-4 mt-4">
          <IonCardContent>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">ℹ</span>
              </div>
              <div>
                <IonText>
                  <p className="text-sm mb-2">
                    <strong>Optional:</strong> Add API keys for enhanced functionality.
                    The app works with fallback content without keys.
                  </p>
                  <p className="text-xs text-gray-600">🔒 Keys stored locally, never sent to servers.</p>
                </IonText>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        <IonList>
          {/* Image Provider Selection - Only show when Free AI is selected */}
          {formKeys.selectedAIProvider === 'free' && (
            <>
              <IonItem>
                <IonLabel>
                  <h2>Image Provider</h2>
                  <p>Choose your image source</p>
                </IonLabel>
                <IonSelect
                  value={formKeys.selectedImageProvider}
                  onSelectionChange={(e) => handleImageProviderSelect(e.detail.value)}
                  interface="popover"
                >
                  {imageProviderList.map((provider) => (
                    <IonSelectOption key={provider.id} value={provider.id}>
                      {provider.icon} {provider.name}
                      {provider.isFree && ' (FREE)'}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>

              {/* Dynamic Image API Key Field */}
              {selectedImageProvider.requiresApiKey && (
                <IonCard className="mx-4 my-4">
                  <IonCardContent>
                    <div className="flex items-center justify-between mb-4">
                      <IonText>
                        <h3 className="font-semibold">{selectedImageProvider.name} API Key</h3>
                      </IonText>
                      {selectedImageProvider.getKeyUrl && (
                        <IonButton
                          fill="outline"
                          size="small"
                          href={selectedImageProvider.getKeyUrl}
                          target="_blank"
                        >
                          <IonIcon icon={openOutline} slot="end" />
                          Get Key
                        </IonButton>
                      )}
                    </div>

                    <IonItem>
                      <IonIcon icon={key} slot="start" />
                      <IonInput
                        type={showApiKeys[`${selectedImageProvider.id}Key`] ? 'text' : 'password'}
                        value={formKeys[`${selectedImageProvider.id}Key` as keyof ApiKeys] as string || ''}
                        onIonInput={(e) => handleInputChange(`${selectedImageProvider.id}Key` as keyof ApiKeys, e.detail.value!)}
                        placeholder={`Enter ${selectedImageProvider.name} API key`}
                        data-testid={`${selectedImageProvider.id}-key-input`}
                      />
                      <IonButton
                        fill="clear"
                        slot="end"
                        onClick={() => toggleKeyVisibility(`${selectedImageProvider.id}Key`)}
                      >
                        <IonIcon icon={showApiKeys[`${selectedImageProvider.id}Key`] ? eyeOff : eye} />
                      </IonButton>
                    </IonItem>

                    <IonNote className="block mt-2 text-sm">
                      🌟 Mood-based images perfectly matched to your selection
                    </IonNote>
                  </IonCardContent>
                </IonCard>
              )}
            </>
          )}

          {/* AI Provider Selection */}
          <IonItem>
            <IonLabel>
              <h2>AI Quote Provider</h2>
              <p>Choose your AI service</p>
            </IonLabel>
            <IonSelect
              value={formKeys.selectedAIProvider}
              onSelectionChange={(e) => handleProviderSelect(e.detail.value)}
              interface="popover"
            >
              {providerList.map((provider) => (
                <IonSelectOption key={provider.id} value={provider.id}>
                  {provider.icon} {provider.name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          {/* Dynamic AI API Key Field */}
          {selectedProvider.requiresApiKey && (
            <IonCard className="mx-4 my-4">
              <IonCardContent>
                <div className="flex items-center justify-between mb-4">
                  <IonText>
                    <h3 className="font-semibold">{selectedProvider.name} API Key</h3>
                  </IonText>
                  {selectedProvider.getKeyUrl && (
                    <IonButton
                      fill="outline"
                      size="small"
                      href={selectedProvider.getKeyUrl}
                      target="_blank"
                    >
                      <IonIcon icon={openOutline} slot="end" />
                      Get Key
                    </IonButton>
                  )}
                </div>

                <IonItem>
                  <IonIcon icon={key} slot="start" />
                  <IonInput
                    type={showApiKeys[`${selectedProvider.id}Key`] ? 'text' : 'password'}
                    value={formKeys[`${selectedProvider.id}Key` as keyof ApiKeys] as string || ''}
                    onIonInput={(e) => handleInputChange(`${selectedProvider.id}Key` as keyof ApiKeys, e.detail.value!)}
                    placeholder={`Enter ${selectedProvider.name} API key`}
                    data-testid={`${selectedProvider.id}-key-input`}
                  />
                  <IonButton
                    fill="clear"
                    slot="end"
                    onClick={() => toggleKeyVisibility(`${selectedProvider.id}Key`)}
                  >
                    <IonIcon icon={showApiKeys[`${selectedProvider.id}Key`] ? eyeOff : eye} />
                  </IonButton>
                </IonItem>

                {/* Azure Endpoint Field */}
                {selectedProvider.id === 'azure' && (
                  <IonItem>
                    <IonIcon icon={key} slot="start" />
                    <IonInput
                      type="text"
                      value={formKeys.azureEndpoint || ''}
                      onIonInput={(e) => handleInputChange('azureEndpoint', e.detail.value!)}
                      placeholder="Enter Azure OpenAI endpoint"
                      data-testid="azure-endpoint-input"
                    />
                  </IonItem>
                )}

                <IonNote className="block mt-2 text-sm">
                  🎯 AI-generated personalized quotes tailored to your mood
                </IonNote>
              </IonCardContent>
            </IonCard>
          )}
        </IonList>

        {/* Validation Warning */}
        {!canSave && (
          <IonCard className="mx-4 my-4" color="warning">
            <IonCardContent>
              <div className="flex items-center gap-2">
                <span>⚠️</span>
                <IonText>
                  <p className="text-sm font-medium">
                    Please add API keys for selected paid providers before saving.
                  </p>
                </IonText>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        {/* Action Buttons */}
        <div className="p-4 space-y-3">
          <IonButton
            expand="block"
            color={canSave ? 'primary' : 'medium'}
            disabled={!canSave}
            onClick={handleSave}
            data-testid="save-keys"
          >
            <IonIcon icon={save} slot="start" />
            {canSave ? 'Save Settings' : 'API Keys Required'}
          </IonButton>
          
          <IonButton
            expand="block"
            fill="outline"
            color="medium"
            onClick={handleClose}
          >
            Cancel
          </IonButton>
        </div>
      </IonContent>
    </IonModal>
  );
};