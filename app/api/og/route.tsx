import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const BASE_URL = 'https://vizai.luisroftl.me';

const LogoMark = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 196 196"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M102.522 138.37C100.13 140.762 96.2524 140.762 93.8604 138.37L77.8139 122.324C63.4005 107.911 39.0469 118.099 39.0469 138.477V158.942C39.0469 162.325 41.7891 165.067 45.1719 165.067H151.211C154.594 165.067 157.336 162.325 157.336 158.942V98.344C157.336 92.8872 150.738 90.1544 146.88 94.013L102.522 138.37Z"
      fill="#191919"
    />
    <path
      d="M93.8604 57.3216C96.2523 54.9296 100.13 54.9297 102.522 57.3216L118.569 73.3681C132.982 87.7815 157.336 77.5927 157.336 57.2152V36.75C157.336 33.3673 154.594 30.625 151.211 30.625H45.1719C41.7891 30.625 39.0469 33.3673 39.0469 36.75V97.348C39.0469 102.805 45.6444 105.538 49.5029 101.679L93.8604 57.3216Z"
      fill="#191919"
    />
  </svg>
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = searchParams.get('title') ?? 'VizAI';
  const description =
    searchParams.get('description') ??
    'Biblioteca de Prompts y Generador de Imágenes AI';

  const [geistRegular, geistBold] = await Promise.all([
    readFile(
      path.join(
        process.cwd(),
        'node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf'
      )
    ),
    readFile(
      path.join(
        process.cwd(),
        'node_modules/geist/dist/fonts/geist-sans/Geist-Bold.ttf'
      )
    ),
  ]);

  return new ImageResponse(
    <div
      tw="flex flex-col w-full h-full bg-white relative overflow-hidden"
      style={{ fontFamily: 'Geist' }}
    >
      <div
        tw="absolute inset-0 flex"
        style={{
          backgroundImage:
            'linear-gradient(to right, #f0f0f0 1px, transparent 1px), linear-gradient(to bottom, #f0f0f0 1px, transparent 1px)',
          backgroundSize: '96px 64px',
        }}
      />

      <div
        tw="absolute flex"
        style={{
          top: -60,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 800,
          height: 500,
          background:
            'radial-gradient(ellipse at center top, #C9EBFF 0%, rgba(201,235,255,0.4) 40%, transparent 70%)',
        }}
      />

      <div tw="relative flex flex-col flex-1 px-[72px] pt-14 pb-14">
        <div tw="flex items-center gap-3">
          <LogoMark />
          <span tw="text-[30px] font-bold text-gray-900 tracking-tight">
            VizAI
          </span>
        </div>

        <div tw="flex flex-col mt-auto gap-5">
          <h1
            tw="text-[72px] font-bold text-gray-900 leading-tight m-0 tracking-tight max-w-[960px]"
            style={{
              fontSize: title.length > 30 ? 58 : 72,
            }}
          >
            {title}
          </h1>
          <p tw="text-[26px] text-gray-500 m-0 leading-snug max-w-[880px] font-normal">
            {description}
          </p>
        </div>

        <div tw="flex items-center justify-between mt-10 pt-6 border-t border-gray-200">
          <span tw="text-xl text-gray-400">
            {BASE_URL.replace('https://', '')}
          </span>
          <div tw="flex items-center gap-2 bg-gray-100 px-5 py-2 rounded-full border border-gray-200">
            <span tw="text-lg text-gray-500 font-medium">Powered by AI</span>
          </div>
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Geist',
          data: geistRegular,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Geist',
          data: geistBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  );
}
