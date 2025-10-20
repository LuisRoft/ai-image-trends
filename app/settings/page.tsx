"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ApiKeySettings from "@/components/api-key-settings";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen py-8">
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al inicio
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configuración
          </h1>
          <p className="text-gray-600">
            Administra tu API key de Gemini y otras configuraciones
          </p>
        </div>

        <ApiKeySettings />
      </div>
    </div>
  );
}
