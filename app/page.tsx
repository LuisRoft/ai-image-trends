import GridPrompts from "@/components/grid-prompts";
import HeaderDev from "@/components/header-dev";

export default function Home() {
  return (
    <main className="font-sans w-full h-screen">
      <div className="flex justify-center items-center flex-col text-center gap-6 mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-snug text-gray-800">
          Coleccion de las tendencias del momento para la generacion de imagenes{" "}
          <span className="bg-gradient-to-r from-gray-700 to-gray-400 bg-clip-text text-transparent">
            IA.
          </span>
        </h2>
        <p className="text-sm sm:text-base lg:text-lg text-gray-500 max-w-2xl">
          Explora las tendencias mas populares en la generacion de imagenes con
          IA y descubre las herramientas y tecnicas que estan dando forma al
          futuro del arte digital.
        </p>
      </div>
      <GridPrompts />
    </main>
  );
}
