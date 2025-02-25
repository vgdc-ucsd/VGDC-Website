import fs from 'fs';
import path from 'path';

export type ShowcaseItem = {
  title: string;
  released: string;
  difficulty: number;
  description: string;
  credits: string;
  link: string;
  status: boolean | number;
  image: string;
  theme: string;
  approved: boolean;
  web: boolean;
};

export type ShowcaseData = {
  showcase: ShowcaseItem[];
};

export async function getShowcaseData(): Promise<ShowcaseData> {
  try {
    // Define path to the JSON file in the public directory
    const jsonPath = path.join(process.cwd(), 'public', 'data', 'showcase_test.json');
    
    // Read and parse the JSON file
    const jsonData = await fs.promises.readFile(jsonPath, 'utf-8');
    const rawData = JSON.parse(jsonData);
    
    const data: ShowcaseData = {
      showcase: rawData.showcase_test || []
    };
    
    // Log the transformed data for debugging
    console.log("Transformed showcase data:", data);
    
    return data;
  } catch (error) {
    console.error('Error loading showcase data:', error);
    
    // Return empty data structure if file cannot be read
    return {
      showcase: []
    };
  }
}