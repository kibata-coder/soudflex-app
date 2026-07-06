import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  getTrendingMovies,
  getTrendingTVShows,
  getMovieDetails,
  getTVShowDetails,
  getTVShowSeasonDetails,
  searchMovies,
  searchTVShows,
  getActionMovies,
  getAdventureMovies,
  getComedyMovies,
  getDramaMovies,
  getSciFiMovies,
} from '../lib/tmdb';

export const useTrendingMovies = () =>
  useQuery({
    queryKey: ['tmdb', 'trending', 'movies'],
    queryFn: () => getTrendingMovies(1),
    staleTime: 1000 * 60 * 30,
  });

export const useTrendingTV = () =>
  useQuery({
    queryKey: ['tmdb', 'trending', 'tv'],
    queryFn: () => getTrendingTVShows(1),
    staleTime: 1000 * 60 * 30,
  });

export const useMovieDetails = (id: number | null) =>
  useQuery({
    queryKey: ['tmdb', 'movie', id],
    queryFn: () => (id ? getMovieDetails(id) : Promise.reject('No ID')),
    enabled: !!id,
  });

export const useTVShowDetails = (id: number | null) =>
  useQuery({
    queryKey: ['tmdb', 'tv', id],
    queryFn: () => (id ? getTVShowDetails(id) : Promise.reject('No ID')),
    enabled: !!id,
  });

export const useTVSeasonDetails = (tvId: number | null, seasonNumber: number) =>
  useQuery({
    queryKey: ['tmdb', 'tv', tvId, 'season', seasonNumber],
    queryFn: () => (tvId ? getTVShowSeasonDetails(tvId, seasonNumber) : Promise.reject('No ID')),
    enabled: !!tvId && seasonNumber >= 0,
  });

export const useMovieSearch = (query: string) =>
  useQuery({
    queryKey: ['tmdb', 'search', 'movie', query],
    queryFn: () => searchMovies(query),
    enabled: !!query && query.length >= 2,
  });

export const useTVSearch = (query: string) =>
  useQuery({
    queryKey: ['tmdb', 'search', 'tv', query],
    queryFn: () => searchTVShows(query),
    enabled: !!query && query.length >= 2,
  });

export const useActionMovies = () =>
  useInfiniteQuery({
    queryKey: ['tmdb', 'discover', 'action'],
    queryFn: ({ pageParam = 1 }) => getActionMovies(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage: { page?: number; total_pages?: number }) =>
      lastPage.page && lastPage.total_pages && lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined,
  });

export const useAdventureMovies = () =>
  useInfiniteQuery({
    queryKey: ['tmdb', 'discover', 'adventure'],
    queryFn: ({ pageParam = 1 }) => getAdventureMovies(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage: { page?: number; total_pages?: number }) =>
      lastPage.page && lastPage.total_pages && lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined,
  });

export const useComedyMovies = () =>
  useInfiniteQuery({
    queryKey: ['tmdb', 'discover', 'comedy'],
    queryFn: ({ pageParam = 1 }) => getComedyMovies(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage: { page?: number; total_pages?: number }) =>
      lastPage.page && lastPage.total_pages && lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined,
  });

export const useDramaMovies = () =>
  useInfiniteQuery({
    queryKey: ['tmdb', 'discover', 'drama'],
    queryFn: ({ pageParam = 1 }) => getDramaMovies(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage: { page?: number; total_pages?: number }) =>
      lastPage.page && lastPage.total_pages && lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined,
  });

export const useSciFiMovies = () =>
  useInfiniteQuery({
    queryKey: ['tmdb', 'discover', 'scifi'],
    queryFn: ({ pageParam = 1 }) => getSciFiMovies(pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (lastPage: { page?: number; total_pages?: number }) =>
      lastPage.page && lastPage.total_pages && lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined,
  });
