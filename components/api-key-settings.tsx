"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Key,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ApiKeySettings() {
  const { user } = useUser();
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const saveApiKey = useMutation(api.userApiKeys.saveApiKey);
  const deleteApiKey = useMutation(api.userApiKeys.deleteApiKey);
  const existingApiKey = useQuery(api.userApiKeys.getApiKey);

  const handleSave = async () => {
    if (!user?.id) return;
    if (!apiKey.trim()) {
      setMessage({
        type: "error",
        text: "Por favor ingresa una API key válida",
      });
      return;
    }

    setIsSaving(true);
    setMessage(null);

    try {
      await saveApiKey({ apiKey: apiKey.trim() });
      setMessage({ type: "success", text: "API key guardada exitosamente" });
      setApiKey("");
      setShowApiKey(false);
    } catch (error) {
      setMessage({ type: "error", text: "Error al guardar la API key" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!user?.id) return;

    setIsDeleting(true);
    setMessage(null);
    setShowDeleteDialog(false);

    try {
      await deleteApiKey();
      setMessage({ type: "success", text: "API key eliminada exitosamente" });
    } catch (error) {
      setMessage({ type: "error", text: "Error al eliminar la API key" });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          Configuración de API Key de Gemini
        </CardTitle>
        <CardDescription>
          Configura tu API key personal de Google Gemini para generar imágenes.
          Tu API key se almacena de forma segura y encriptada.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions Alert */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>¿Cómo obtener tu API key?</AlertTitle>
          <AlertDescription>
            <ol className="list-decimal list-inside space-y-1 mt-2">
              <li>
                Ve a{" "}
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline hover:text-blue-700 inline-flex items-center gap-1"
                >
                  Google AI Studio
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>Inicia sesión con tu cuenta de Google</li>
              <li>
                Haz clic en &quot;Get API Key&quot; o &quot;Create API Key&quot;
              </li>
              <li>Copia la API key y pégala aquí abajo</li>
            </ol>
            <p className="text-xs mt-3 flex items-start gap-1">
              <span>💡</span>
              <span>
                Recuerda: Tu API key es personal y tiene costos asociados según
                tu uso.{" "}
                <a
                  href="https://ai.google.dev/pricing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-700 inline-flex items-center gap-1"
                >
                  Ver precios
                  <ExternalLink className="h-3 w-3" />
                </a>
              </span>
            </p>
          </AlertDescription>
        </Alert>

        {/* Current API Key Status */}
        {existingApiKey && existingApiKey.hasKey && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle className="flex items-center justify-between">
              <span>API Key Configurada</span>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-300"
              >
                Activa
              </Badge>
            </AlertTitle>
            <AlertDescription>
              <div className="space-y-2 mt-2">
                <div>
                  <span className="text-xs font-medium text-green-900">
                    API Key:
                  </span>
                  <code className="block bg-green-100 px-3 py-2 rounded text-xs font-mono mt-1">
                    {existingApiKey.maskedKey}
                  </code>
                </div>
                <p className="text-xs text-green-700">
                  Última actualización:{" "}
                  {new Date(existingApiKey.updatedAt).toLocaleString("es-ES", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <AlertDialog
                  open={showDeleteDialog}
                  onOpenChange={setShowDeleteDialog}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={isDeleting}
                      className="mt-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-3 w-3 mr-2" />
                          Eliminar API Key
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        ¿Estás completamente seguro?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción eliminará tu API key de forma permanente. No
                        podrás generar imágenes hasta que agregues una nueva API
                        key de Google Gemini.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                      >
                        Sí, eliminar API Key
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Add/Update API Key Form */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-sm font-medium">
              {existingApiKey?.hasKey ? "Nueva API Key" : "API Key de Gemini"}
            </Label>
            <div className="relative">
              <Input
                id="apiKey"
                type={showApiKey ? "text" : "password"}
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="pr-10 font-mono text-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && apiKey.trim() && !isSaving) {
                    handleSave();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                aria-label={showApiKey ? "Ocultar API key" : "Mostrar API key"}
              >
                {showApiKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              La API key debe comenzar con &quot;AIzaSy&quot; seguido de
              caracteres alfanuméricos
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving || !apiKey.trim()}
            className="w-full"
            size="lg"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : existingApiKey?.hasKey ? (
              <>Actualizar API Key</>
            ) : (
              <>Guardar API Key</>
            )}
          </Button>
        </div>

        {/* Success/Error Message */}
        {message && (
          <Alert
            variant={message.type === "success" ? "success" : "destructive"}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription className="font-medium">
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Security Notice */}
        <Alert>
          <AlertDescription className="text-xs">
            Tu API key se almacena encriptada en nuestra base de datos y solo tú
            tú puedes acceder a ella. Nunca compartimos tu API key con terceros.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
