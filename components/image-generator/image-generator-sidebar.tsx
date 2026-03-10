'use client';

import Image from 'next/image';
import { Authenticated, Unauthenticated } from 'convex/react';
import { SignInButton } from '@clerk/nextjs';
import {
  AlertCircle,
  Check,
  Copy,
  Lock,
  Loader2,
  Settings,
  Upload,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { PromptWithAuthVisibility } from '@/lib/types/prompt';
import { aspectRatioOptions, modelOptions } from '@/lib/image-generator/constants';
import type { PromptInput } from '@/lib/types/image-generator';
import type { ImageGeneratorController } from './use-image-generator-controller';

interface ImageGeneratorSidebarProps {
  controller: ImageGeneratorController;
  prompt: PromptWithAuthVisibility;
}

export function ImageGeneratorSidebar({
  controller,
  prompt,
}: ImageGeneratorSidebarProps) {
  return (
    <aside className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 backdrop-blur-sm xl:sticky xl:top-20 xl:max-h-[calc(100dvh-6rem)]">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="space-y-0 divide-y divide-zinc-100">
          {controller.hasImageInputs && (
            <section className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-3">
                <Label className="text-sm">Referencias</Label>
                <span className="text-xs text-zinc-400">
                  {controller.uploadedImages.length}/{controller.currentModel.maxImages}
                </span>
              </div>
              <div className="space-y-1">
                {prompt.inputs
                  .filter((input: PromptInput) => input.type === 'image')
                  .map((input) => (
                    <p key={input.key} className="text-xs text-zinc-500">
                      <span className="font-medium text-zinc-700">
                        {input.required ? 'Obligatorio' : 'Opcional'}:
                      </span>{' '}
                      {input.description}
                    </p>
                  ))}
              </div>

              <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50/70 p-4 text-center transition-colors hover:border-zinc-400 hover:bg-zinc-50">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
                  multiple
                  onChange={(event) => {
                    if (event.target.files) {
                      controller.handleImageUpload(event.target.files);
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 h-6 w-6 text-zinc-400" />
                  <p className="text-sm font-medium text-zinc-700">
                    Sube imagenes de referencia
                  </p>
                  <p className="mt-0.5 text-[11px] text-zinc-400">
                    JPEG, PNG, GIF o BMP · Max. 10MB
                  </p>
                </label>
              </div>

              {controller.uploadedImages.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {controller.uploadedImages.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="min-w-20 max-w-20"
                    >
                      <div className="relative overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100">
                        <Image
                          src={controller.previewUrls[index]!}
                          alt={`Imagen subida ${index + 1} para el prompt ${prompt.title}`}
                          width={80}
                          height={80}
                          className="h-20 w-20 object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-5 w-5 rounded-full p-0"
                          onClick={() => controller.removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="mt-1 truncate text-[10px] text-zinc-400">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="space-y-3 p-4">
            <Label className="text-sm">Modelo</Label>
            <div className="grid grid-cols-2 gap-2">
              {modelOptions.map((model) => {
                const IconComponent = model.icon;
                const isSelected = controller.selectedModel === model.value;

                return (
                  <button
                    key={model.value}
                    type="button"
                    onClick={() => controller.handleModelSelect(model)}
                    className={cn(
                      'flex flex-col items-start rounded-xl border p-3 text-left transition-all',
                      isSelected
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                    )}
                  >
                    <div className="flex items-center justify-between gap-1.5">
                      <div className="flex items-center gap-1.5">
                        <IconComponent
                          className={cn(
                            'h-3.5 w-3.5',
                            isSelected ? 'text-white' : 'text-zinc-500'
                          )}
                        />
                        <span className="text-sm font-medium">{model.label}</span>
                      </div>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 shrink-0 text-white" />
                      )}
                    </div>
                    <p
                      className={cn(
                        'mt-1 text-[11px] leading-tight',
                        isSelected ? 'text-zinc-300' : 'text-zinc-500'
                      )}
                    >
                      {model.description}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="image-size" className="text-xs">
                  Resolucion
                </Label>
                <Select
                  value={controller.imageSize}
                  onValueChange={controller.setImageSize}
                >
                  <SelectTrigger id="image-size" className="h-9 w-full">
                    <SelectValue placeholder="Resolucion" />
                  </SelectTrigger>
                  <SelectContent>
                    {controller.currentModel.supportedSizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="aspect-ratio" className="text-xs">
                  Aspect ratio
                </Label>
                <Select
                  value={controller.aspectRatio}
                  onValueChange={controller.setAspectRatio}
                >
                  <SelectTrigger id="aspect-ratio" className="h-9 w-full">
                    <SelectValue placeholder="Ratio" />
                  </SelectTrigger>
                  <SelectContent>
                    {aspectRatioOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center justify-between gap-4">
                          <span>{option.label}</span>
                          <span className="text-xs text-zinc-500">
                            {option.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Authenticated>
            <section className="space-y-3 p-4">
              <Label className="text-sm">Fuente</Label>

              <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-zinc-100 p-1">
                <GenerationSourceButton
                  disabled={
                    !controller.hasCreditsAvailable &&
                    controller.generationSource !== 'credits'
                  }
                  isSelected={controller.generationSource === 'credits'}
                  onClick={() =>
                    controller.handleGenerationSourceChange('credits')
                  }
                >
                  Creditos
                </GenerationSourceButton>
                <GenerationSourceButton
                  disabled={!controller.hasApiKey}
                  isSelected={controller.generationSource === 'user_api_key'}
                  onClick={() =>
                    controller.handleGenerationSourceChange('user_api_key')
                  }
                >
                  Mi API key
                </GenerationSourceButton>
              </div>

              {controller.generationSource === 'credits' ? (
                controller.hasPendingCreditGeneration ? (
                  <StatusCard tone="blue">
                    <p className="text-xs font-medium text-blue-900">
                      Generacion en progreso.
                    </p>
                    <p className="text-xs text-blue-800">
                      Espera a que termine antes de iniciar otra con creditos.
                    </p>
                  </StatusCard>
                ) : !controller.hasCreditsAvailable ? (
                  <StatusCard tone="amber">
                    <p className="text-xs font-medium text-amber-900">
                      Sin creditos disponibles.
                    </p>
                    <p className="text-xs text-amber-800">
                      Se recargan 24h despues. Usa tu API key para seguir.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => controller.router.push('/settings')}
                      className="h-7 bg-white text-xs hover:bg-amber-100"
                    >
                      <Settings className="mr-1.5 h-3 w-3" />
                      Configurar API key
                    </Button>
                  </StatusCard>
                ) : (
                  <p className="text-xs text-zinc-500">
                    Te quedan{' '}
                    <span className="font-semibold text-zinc-900">
                      {controller.creditsRemaining}
                    </span>{' '}
                    creditos disponibles.
                  </p>
                )
              ) : controller.hasApiKey ? (
                <p className="text-xs text-zinc-500">
                  Generaras con tu API key personal.
                </p>
              ) : (
                <StatusCard tone="yellow">
                  <p className="text-xs font-medium text-yellow-900">
                    Sin API key configurada.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => controller.router.push('/settings')}
                    className="h-7 bg-white text-xs hover:bg-yellow-100"
                  >
                    <Settings className="mr-1.5 h-3 w-3" />
                    Ir a Configuracion
                  </Button>
                </StatusCard>
              )}
            </section>
          </Authenticated>

          <section className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <Label className="text-sm">Prompt avanzado</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() =>
                  controller.setIsPromptPanelOpen(
                    (previousValue: boolean) => !previousValue
                  )
                }
              >
                {controller.isPromptPanelOpen ? 'Ocultar' : 'Editar'}
              </Button>
            </div>

            {controller.isPromptPanelOpen && (
              <div className="space-y-3">
                {controller.hasTextInputs && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                      Variables editables
                    </p>
                    <ul className="space-y-0.5">
                      {prompt.inputs
                        .filter((input: PromptInput) => input.type === 'text')
                        .map((input) => (
                          <li
                            key={input.key}
                            className="text-xs leading-5 text-zinc-600"
                          >
                            <span className="font-medium text-zinc-800">
                              {input.description}
                            </span>
                            {input.placeholder && (
                              <span className="italic">
                                {' '}
                                · busca [{input.placeholder}]
                              </span>
                            )}
                            {input.required && (
                              <span className="font-medium text-red-600">
                                {' '}
                                (Obligatorio)
                              </span>
                            )}
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="prompt-editor" className="text-xs">
                      Editor
                    </Label>
                    {controller.isPromptUnlocked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={controller.copyPromptToClipboard}
                        className="h-6 text-[11px]"
                      >
                        {controller.isCopied ? (
                          <>
                            <Check className="mr-1 h-3 w-3" />
                            Copiado
                          </>
                        ) : (
                          <>
                            <Copy className="mr-1 h-3 w-3" />
                            Copiar
                          </>
                        )}
                      </Button>
                    )}
                  </div>

                  <div className="relative">
                    <Textarea
                      id="prompt-editor"
                      placeholder="Edita tu prompt aqui..."
                      value={
                        controller.isPromptUnlocked
                          ? controller.editablePrompt
                          : 'Prompt bloqueado. Inicia sesion para verlo y editarlo.'
                      }
                      onChange={(event) =>
                        controller.setEditablePrompt(event.target.value)
                      }
                      readOnly={!controller.isPromptUnlocked}
                      className={cn(
                        'min-h-[140px] border-zinc-200 bg-white font-mono text-xs transition',
                        !controller.isPromptUnlocked &&
                          'pointer-events-none select-none text-transparent blur-sm shadow-[inset_0_0_0_1px_rgba(113,113,122,0.15)]'
                      )}
                    />
                    {!controller.isPromptUnlocked && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-md border border-dashed border-zinc-200 bg-white/80 backdrop-blur-[2px]">
                        <div className="max-w-sm text-center">
                          <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-900 text-white shadow-sm">
                            <Lock className="h-3.5 w-3.5" />
                          </div>
                          <p className="text-xs font-semibold text-zinc-900">
                            Inicia sesion para ver este prompt
                          </p>
                          <SignInButton mode="modal">
                            <Button className="mt-2" size="sm">
                              Ver prompt
                            </Button>
                          </SignInButton>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <div className="sticky bottom-0 rounded-b-2xl border-t border-zinc-200 bg-white/95 p-4 backdrop-blur-sm">
        {controller.apiKeyError && (
          <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
              <div className="flex-1">
                <p className="text-xs text-red-800">{controller.apiKeyError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => controller.router.push('/settings')}
                  className="mt-2 h-7 border-red-300 bg-white text-xs hover:bg-red-50"
                >
                  <Settings className="mr-1.5 h-3 w-3" />
                  Ir a Configuracion
                </Button>
              </div>
            </div>
          </div>
        )}

        <Authenticated>
          <Button
            onClick={controller.handlePrimaryAction}
            disabled={controller.isPrimaryActionDisabled}
            className="h-11 w-full rounded-xl"
            size="lg"
          >
            {controller.isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : controller.shouldConfigureUserApiKey ? (
              <>
                <Settings className="mr-2 h-4 w-4" />
                {controller.primaryActionLabel}
              </>
            ) : (
              controller.primaryActionLabel
            )}
          </Button>
        </Authenticated>

        <Unauthenticated>
          <SignInButton mode="modal">
            <Button className="h-11 w-full rounded-xl" size="lg">
              Iniciar sesion para generar
            </Button>
          </SignInButton>
        </Unauthenticated>
      </div>
    </aside>
  );
}

interface GenerationSourceButtonProps {
  children: React.ReactNode;
  disabled: boolean;
  isSelected: boolean;
  onClick: () => void;
}

function GenerationSourceButton({
  children,
  disabled,
  isSelected,
  onClick,
}: GenerationSourceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-lg px-3 py-1.5 text-sm font-medium transition',
        isSelected
          ? 'bg-white text-zinc-900 shadow-sm'
          : 'text-zinc-500 hover:text-zinc-900',
        disabled && !isSelected && 'cursor-not-allowed opacity-50'
      )}
    >
      {children}
    </button>
  );
}

interface StatusCardProps {
  children: React.ReactNode;
  tone: 'amber' | 'blue' | 'yellow';
}

function StatusCard({ children, tone }: StatusCardProps) {
  const classes = {
    amber: 'border-amber-200 bg-amber-50',
    blue: 'border-blue-200 bg-blue-50',
    yellow: 'border-yellow-200 bg-yellow-50',
  };

  const iconClasses = {
    amber: 'text-amber-600',
    blue: 'text-blue-600',
    yellow: 'text-yellow-600',
  };

  return (
    <div className={cn('rounded-xl border p-3', classes[tone])}>
      <div className="flex items-start gap-2">
        <AlertCircle
          className={cn('mt-0.5 h-4 w-4 flex-shrink-0', iconClasses[tone])}
        />
        <div className="space-y-1.5">{children}</div>
      </div>
    </div>
  );
}
