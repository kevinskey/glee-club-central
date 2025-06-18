import { render, screen } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';

import { DynamicHero } from '@/components/landing/DynamicHero';
import { HeroSlideContent } from '@/components/landing/hero/HeroSlideContent';
import { useHeroData } from '@/components/landing/hero/useHeroData';
import type { HeroSlide, MediaFile } from '@/components/landing/hero/types';

vi.mock('@/components/landing/hero/useHeroData');

const mockedUseHeroData = vi.mocked(useHeroData);

describe('DynamicHero', () => {
  it('renders HeroDefault when no slides exist', () => {
    mockedUseHeroData.mockReturnValue({
      slides: [],
      mediaFiles: {},
      currentIndex: 0,
      isLoading: false,
      refetch: vi.fn(),
    });

    render(<DynamicHero />);
    expect(screen.getByText(/Spelman College Glee Club/i)).toBeInTheDocument();
  });
});

describe('HeroSlideContent', () => {
  it('renders slide content with media', () => {
    const slide: HeroSlide = {
      id: '1',
      title: 'Test Slide',
      description: 'Hello',
      button_text: 'Click',
      button_link: 'https://example.com',
      media_id: 'media1',
      media_type: 'image',
      visible: true,
      slide_order: 1,
      text_position: 'center',
    };

    const mediaFiles: Record<string, MediaFile> = {
      media1: { id: 'media1', file_url: 'https://example.com/test.jpg', title: 'Media' },
    };

    render(<HeroSlideContent slide={slide} mediaFiles={mediaFiles} />);

    expect(screen.getByAltText('Test Slide')).toHaveAttribute('src', 'https://example.com/test.jpg');
    expect(screen.getByText('Test Slide')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });
});

describe('useHeroData', () => {
  it('cycles current slide index', async () => {
    const slides: HeroSlide[] = [
      { id: '1', title: 'A', visible: true, slide_order: 1 },
      { id: '2', title: 'B', visible: true, slide_order: 2 },
    ];

    mockedUseHeroData.mockRestore();
    vi.useFakeTimers();

    const supabaseMock = {
      from: vi.fn(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: slides, error: null }),
        in: vi.fn().mockResolvedValue({ data: [], error: null }),
        not: vi.fn().mockReturnThis(),
      })),
    } as any;

    vi.mock('@/integrations/supabase/client', () => ({ supabase: supabaseMock }));

    const { result, waitFor } = renderHook(() => useHeroData());

    await waitFor(() => !result.current.isLoading);

    expect(result.current.currentIndex).toBe(0);

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(result.current.currentIndex).toBe(1);

    vi.useRealTimers();
  });
});
