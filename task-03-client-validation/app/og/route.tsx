import { ImageResponse } from 'next/og';

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#f8faf8',
          color: '#191c1c',
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 500,
            letterSpacing: '-2px',
          }}
        >
          Tee’s Wardrobe
        </div>
        <div
          style={{
            width: 160,
            height: 8,
            marginTop: 24,
            backgroundColor: '#32b1aa',
          }}
        />
        <div
          style={{
            marginTop: 24,
            fontSize: 36,
            color: '#5c5f5e',
          }}
        >
          Bespoke clothing, one order at a time.
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
