import { getSheetData } from '@/lib/google-sheets.action';

export interface RawSheetData {
  games: string[][] | null | undefined;
  events: string[][] | null | undefined;
  blog: string[][] | null | undefined;
  store: string[][] | null | undefined;
}

export async function fetchAllSheetData(): Promise<RawSheetData> {
  console.log('📡 Fetching data from Google Sheets...');

  const [gamesResponse, eventsResponse, blogResponse, storeResponse] =
    await Promise.all([
      getSheetData('Games'),
      getSheetData('Events'),
      getSheetData('Blog'),
      getSheetData('Store'),
    ]);

  const data = {
    games: gamesResponse.data,
    events: eventsResponse.data,
    blog: blogResponse.data,
    store: storeResponse.data,
  };

  // Log what was fetched
  console.log(`  Games: ${data.games?.length ?? 0} rows`);
  console.log(`  Events: ${data.events?.length ?? 0} rows`);
  console.log(`  Blog: ${data.blog?.length ?? 0} rows`);
  console.log(`  Store: ${data.store?.length ?? 0} rows`);

  return data;
}
