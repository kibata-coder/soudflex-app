import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  getTrendingAnime,
  getPopularAnime,
  searchAnime,
  getAnimeDetails,
} from '../lib/anilist';

export const useTrendingAnime = () =>
  useInfiniteQuery({
    queryKey: ['anilist', 'trending'],
    queryFn: ({ pageParam = 1 }) => getTrendingAnime(pageParam as number, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.currentPage + 1 : undefined,
  });

export const usePopularAnime = () =>
  useInfiniteQuery({
    queryKey: ['anilist', 'popular'],
    queryFn: ({ pageParam = 1 }) => getPopularAnime(pageParam as number, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pageInfo.hasNextPage ? lastPage.pageInfo.currentPage + 1 : undefined,
  });

export const useSearchAnime = (query: string) =>
  useQuery({
    queryKey: ['anilist', 'search', query],
    queryFn: () => searchAnime(query, 1, 24),
    enabled: !!query && query.length >= 3,
  });

export const useAnimeSeries = (id: number | null) =>
  useQuery({
    queryKey: ['anilist', 'series', id],
    queryFn: () => (id ? getAnimeDetails(id) : Promise.reject('No ID')),
    enabled: !!id,
  });
