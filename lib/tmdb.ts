const SUPABASE_URL = 'https://oklhftpwxqviutizrelp.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9rbGhmdHB3eHF2aXV0aXpyZWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc0MzU2NDIsImV4cCI6MjA4MzAxMTY0Mn0.G28L1teUN_4c09jyadEMMlaOxTRDWHd0oa9gnbAR8nw';
const TMDB_FN_URL = `${SUPABASE_URL}/functions/v1/tmdb`;

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export const getImageUrl = (path: string | null, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getBackdropUrl = (path: string | null, size: 'w780' | 'w1280' | 'original' = 'w1280') => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  number_of_seasons?: number;
  seasons?: Season[];
  genres?: { id: number; name: string }[];
}

export interface Season {
  id: number;
  season_number: number;
  name: string;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
}

export interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  vote_average: number;
}

interface TMDBResponse<T> {
  results?: T[];
  page?: number;
  total_pages?: number;
  total_results?: number;
  [key: string]: unknown;
}

async function callTMDB<T>(
  endpoint: string,
  params?: Record<string, string | number>,
): Promise<TMDBResponse<T> & T> {
  const qs = new URLSearchParams({ endpoint });
  if (params) qs.set('params', JSON.stringify(params));

  const res = await fetch(`${TMDB_FN_URL}?${qs.toString()}`, {
    method: 'GET',
    headers: {
      apikey: SUPABASE_ANON,
      Authorization: `Bearer ${SUPABASE_ANON}`,
    },
  });
  if (!res.ok) throw new Error(`TMDB ${endpoint} ${res.status}`);
  return await res.json();
}

export const getTrendingMovies = (page = 1) =>
  callTMDB<Movie>('/trending/movie/week', { page });

export const getTrendingTVShows = (page = 1) =>
  callTMDB<TVShow>('/trending/tv/week', { page });

export const getMovieDetails = (movieId: number) =>
  callTMDB<Movie>(`/movie/${movieId}`);

export const getTVShowDetails = (tvId: number) =>
  callTMDB<TVShow>(`/tv/${tvId}`);

export const getTVShowSeasonDetails = (tvId: number, seasonNumber: number) =>
  callTMDB<{ episodes: Episode[] }>(`/tv/${tvId}/season/${seasonNumber}`);

export const searchMovies = (query: string, page = 1) =>
  callTMDB<Movie>('/search/movie', { query, page });

export const searchTVShows = (query: string, page = 1) =>
  callTMDB<TVShow>('/search/tv', { query, page });

export const getActionMovies = (page = 1) =>
  callTMDB<Movie>('/discover/movie', { page, sort_by: 'popularity.desc', with_genres: '28' });

export const getAdventureMovies = (page = 1) =>
  callTMDB<Movie>('/discover/movie', { page, sort_by: 'popularity.desc', with_genres: '12' });

export const getComedyMovies = (page = 1) =>
  callTMDB<Movie>('/discover/movie', { page, sort_by: 'popularity.desc', with_genres: '35' });

export const getDramaMovies = (page = 1) =>
  callTMDB<Movie>('/discover/movie', { page, sort_by: 'popularity.desc', with_genres: '18' });

export const getSciFiMovies = (page = 1) =>
  callTMDB<Movie>('/discover/movie', { page, sort_by: 'popularity.desc', with_genres: '878' });

export const getMovieRecommendations = (movieId: number) =>
  callTMDB<Movie>(`/movie/${movieId}/recommendations`);

export const getTVRecommendations = (tvId: number) =>
  callTMDB<TVShow>(`/tv/${tvId}/recommendations`);
