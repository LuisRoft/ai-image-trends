import { ImageResponse } from 'next/og';
import { readFile } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

const BASE_URL =
  process.env.SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '');

const LogoMark = () => (
  <svg
    width="36"
    height="41"
    viewBox="0 0 256 291"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M139.314 231.241C133.065 237.489 122.935 237.489 116.686 231.241L83.8992 198.454C52.7059 167.261 0 189.311 0 233.412V274.958C0 283.795 7.16344 290.958 16 290.958H240C248.837 290.958 256 283.795 256 274.958V153.182C256 138.928 238.766 131.789 228.686 141.868L139.314 231.241Z"
      fill="#191919"
    />
    <path
      d="M116.686 59.7171C122.935 53.4687 133.065 53.4687 139.314 59.7171L172.101 92.5042C203.294 123.697 256 101.647 256 57.5462V16C256 7.16343 248.837 0 240 0H16C7.16344 0 0 7.16344 0 16V137.776C0 152.03 17.2343 159.169 27.3137 149.09L116.686 59.7171Z"
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
  const imageUrl = searchParams.get('imageUrl');

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

  const fonts = [
    {
      name: 'Geist',
      data: geistRegular,
      style: 'normal' as const,
      weight: 400 as const,
    },
    {
      name: 'Geist',
      data: geistBold,
      style: 'normal' as const,
      weight: 700 as const,
    },
  ];

  const titleSize = title.length > 24 ? 'text-[50px]' : 'text-[62px]';

  if (imageUrl) {
    return new ImageResponse(
      <div
        tw="flex w-full h-full bg-white relative overflow-hidden"
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

        <div
          tw="relative flex w-full h-full px-16 py-[52px]"
          style={{ gap: 44 }}
        >
          <div tw="flex flex-col flex-1 min-w-0">
            <div tw="flex items-center" style={{ gap: 10 }}>
              <LogoMark />
              <span
                tw="font-bold text-[#191919]"
                style={{
                  fontSize: 26,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.25,
                }}
              >
                VizAI
              </span>
            </div>

            <div tw="flex flex-col mt-auto" style={{ gap: 12 }}>
              <h1
                tw={`${titleSize} font-bold text-[#191919] m-0`}
                style={{ lineHeight: 1.25, letterSpacing: '-0.025em' }}
              >
                {title}
              </h1>
              <p
                tw="text-[#555555] m-0 font-normal"
                style={{ fontSize: 21, lineHeight: 1.375 }}
              >
                {description.length > 130
                  ? description.slice(0, 130) + '…'
                  : description}
              </p>
            </div>

            <div tw="flex items-center justify-between mt-9 pt-5 border-t border-[#e5e5e5]">
              <span tw="text-[19px] text-[#888888]">
                {BASE_URL.replace('https://', '')}
              </span>
              <div tw="flex items-center bg-[#f5f5f5] px-[18px] py-[6px] rounded-full border border-[#e5e5e5]">
                <span tw="text-[17px] text-[#555555] font-medium">
                  Powered by AI
                </span>
              </div>
            </div>
          </div>

          <div tw="flex items-center justify-center flex-shrink-0 w-[370px]">
            <img
              src={imageUrl}
              width={370}
              height={450}
              style={{
                borderRadius: '20px',
                objectFit: 'cover',
                boxShadow:
                  '0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,0,0,0.08)',
              }}
            />
          </div>
        </div>
      </div>,
      { width: 1200, height: 630, fonts }
    );
  }

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
        <div tw="flex items-center" style={{ gap: 10 }}>
          <LogoMark />
          <span
            tw="font-bold text-[#191919]"
            style={{
              fontSize: 26,
              letterSpacing: '-0.025em',
              lineHeight: 1.25,
            }}
          >
            VizAI
          </span>
        </div>

        <div tw="flex flex-col mt-auto" style={{ gap: 20 }}>
          <h1
            tw="font-bold text-[#191919] m-0 max-w-[960px]"
            style={{
              fontSize: title.length > 30 ? 58 : 72,
              lineHeight: 1.25,
              letterSpacing: '-0.025em',
            }}
          >
            {title}
          </h1>
          <p
            tw="text-[#555555] m-0 max-w-[880px] font-normal"
            style={{ fontSize: 26, lineHeight: 1.375 }}
          >
            {description}
          </p>
        </div>

        <div tw="flex items-center justify-between mt-10 pt-6 border-t border-[#e5e5e5]">
          <span tw="text-xl text-[#888888]">
            {BASE_URL.replace('https://', '')}
          </span>
          <div tw="flex items-center bg-[#f5f5f5] px-5 py-2 rounded-full border border-[#e5e5e5]">
            <span tw="text-lg text-[#555555] font-medium">Powered by AI</span>
          </div>
        </div>
      </div>
    </div>,
    { width: 1200, height: 630, fonts }
  );
}
