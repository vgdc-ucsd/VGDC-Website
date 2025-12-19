import { prisma } from "./prisma"
import { GetRandomMascotImageFallback, GetStoredImageUrl, imageFallbacks } from "./images"
import { Role } from "./generated/prisma/enums";
import { getRandomElementFromArray } from "./utils";

export type OfficerYear = {
  year: string,
  excerpt: string,
  officerDetails: OfficerDetails[],
  startTimestamp: Date,
}

export type OfficerDetails = {
  name: string,
  title: string,
  avatar: string,
  quote: string,
}

export async function GetAllYears(yearToExclude: string) {
  const years = await prisma.officerYear.findMany({
    where: { 
      year: {
        not: yearToExclude,
      },
    },
    select: {
      year: true,
    }
  });

  return years.map(yearObj => yearObj.year);
}

/**
 * Gets all of the officer information from a given school year.
 * @param yearText A school year. Ex: "2024-2025" 
 * @returns An OfficerYear object containing the query results.
 */
export async function GetOfficerYear(yearText: string) {
  console.log("Getting year: " + yearText);
  const officerYear = await prisma.officerYear.findUnique({
    where: {
      year: yearText
    },
    include: {
      officerBios: {
        include: {
          user: true
        }
      }
    }
  });

  if (!officerYear) return;

  const officerDetailPromises = officerYear.officerBios.map(async (officer) => {
    const avatar = officer.image
      ? await GetStoredImageUrl(officer.image)
      : undefined;

    return {
      name: officer.user.name,
      title: officer.position,
      avatar: avatar ?? GetRandomMascotImageFallback(),
      quote: officer.description,
    } satisfies OfficerDetails;
  });

  const result: OfficerYear = {
    year: officerYear.year,
    excerpt: officerYear.excerpt,
    officerDetails: await Promise.all(officerDetailPromises),
    startTimestamp: officerYear.startTimestamp,
  }
  return result;
}
