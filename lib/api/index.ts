'use server';

import server from '@/network/server';

import filterUnknownMovies from '../filterUnknownMovies';
import { createUniqueRandomGenerator } from '../utils';

import pirateBay from './parsers/pirate-bay';
import yts from './parsers/yts';
import { Sort } from './parsers';

export const search = async ({
  query,
  page,
  type = 'movie'
}: {
  query: string;
  page: number;
  type: ShowType;
}): Promise<MovieDBResponse> => {
  return server.get(`/search/${type}`, {
    params: {
      query,
      page
    }
  });
};

const generatePage = createUniqueRandomGenerator(500);

export const randomMovies = async ({ filters }: { filters: Partial<Filters> } = { filters: {} }): Promise<Movie[]> => {
  return server
    .get<MovieDBResponse>('/discover/movie', {
      params: {
        sort_by: 'popularity.desc',
        with_origin_country: 'UA|GB|JP|AU|US|IT|DE|FR',
        page: generatePage(),
        with_genres: filters.genres?.join('|'),
        'vote_average.gte': filters.score?.[0],
        'vote_average.lte': filters.score?.[1],
        'release_date.gte': filters.year?.[0],
        'release_date.lte': filters.year?.[1]
      }
    })
    .then((data) => filterUnknownMovies(data.results));
};

export const popularByType = async ({ type }: { type: 'streaming' | 'theater' | 'rent' }): Promise<Movie[]> => {
  const params =
    type === 'theater'
      ? { with_release_type: 3 }
      : { with_watch_monetization_types: type === 'streaming' ? 'flatrate' : 'rent' };
  return server
    .get<MovieDBResponse>('/discover/movie', {
      params: {
        ...params,
        watch_region: 'US'
      }
    })
    .then((data) => data.results);
};

export const popularMovies = async ({ page }: { page?: string } = {}): Promise<MovieDBResponse> => {
  return server.get('/discover/movie', {
    params: {
      page,
      sort_by: 'popularity.desc',
      'vote_count.gte': 0,
      'vote_average.lte': 10,
      'vote_average.gte': 0,
      'with_runtime.gte': 0,
      'with_runtime.lte': 400
    }
  });
};

export const trendingMovies = async ({ page }: { page?: string } = {}): Promise<Movie[]> => {
  return server
    .get<MovieDBResponse>('/trending/movie/day', {
      params: {
        page
      }
    })
    .then((data) => data.results);
};

export const topMovies = async ({
  page,
  starring
}: { page?: string; starring?: string } = {}): Promise<MovieDBResponse> => {
  return server.get('/discover/movie', {
    params: {
      page,
      with_cast: starring,
      with_people: starring,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 300,
      'vote_average.lte': 10,
      'vote_average.gte': 0
    }
  });
};

export const similarMovies = async ({
  page,
  movieId,
  type = 'movie'
}: {
  page?: string;
  movieId?: string;
  type?: ShowType;
}): Promise<MovieDBResponse> => {
  return server.get(`/${type}/${movieId}/recommendations`, {
    params: {
      page
    }
  });
};

export const genres = async (): Promise<IDName[]> => {
  return server.get<{ genres: IDName[] }>('/genre/movie/list').then((data) => data.genres);
};

export const externalIDs = async ({ id, type = 'movie' }: { id: number; type: ShowType }): Promise<string> => {
  return server.get<ExternalIDS>(`/${type}/${id}/external_ids`).then(({ imdb_id }) => imdb_id);
};

export const credits = async ({
  movieId,
  type = 'movie'
}: {
  movieId: number;
  type?: ShowType;
}): Promise<Array<Actor>> => {
  return server
    .get<{ cast: Array<unknown> }>(`/${type}/${movieId}/${type === 'tv' ? 'aggregate_credits' : 'credits'}`)
    .then((data) => {
      if (type === 'tv') {
        return data.cast.map((item) => {
          const actor = item as AggregatedActor;
          const [role] = actor.roles || [{}];
          return { ...actor, ...role } as unknown as Actor;
        });
      }
      return data.cast as Array<Actor>;
    });
};

export const YTSTorrents = async ({
  query,
  sort,
  type,
  id
}: {
  query: string;
  sort: Sort;
  id: number;
  type: ShowType;
}) => {
  try {
    const imdbID = await externalIDs({ id, type });
    const torrents = await yts.search({
      imdbID,
      query,
      sort
    });
    return torrents;
  } catch (error) {
    return [];
  }
};

export const TPBTorrents = async ({ query, sort }: { query: string; sort: Sort; id: number; type: ShowType }) => {
  try {
    const torrents = await pirateBay.search({
      query,
      sort
    });
    return torrents;
  } catch (error) {
    return [];
  }
};

export const trailers = async ({ movieId, type }: { movieId: number; type?: ShowType }): Promise<Trailer[]> => {
  return server
    .get<{ id: number; results: Trailer[] }>(`/${type}/${movieId}/videos`, {
      params: {
        language: 'en-US'
      }
    })
    .then((data) => data.results);
};
