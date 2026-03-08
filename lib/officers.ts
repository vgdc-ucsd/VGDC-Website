import { prisma } from "./prisma"
import { getRandomMascotImageFallback, getStoredImageUrl, imageFallbacks } from "./images"
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

export type SchoolYear = {
  type: "current" | "year"
  value: string
}

export const currentYearHeaderText = "Our Team"
export const currentYearExcerpt = "We're a growing body of talented individuals with a passion for making game development exciting in every way. Hover over each profile!"

export async function getAllYears(yearToExclude: SchoolYear) {
  try {
    const years = await prisma.officerYear.findMany({
      where: { 
        year: {
          not: await getSchoolYearText(yearToExclude),
        },
      },
      select: {
        year: true,
      }
    });

    return years.map(yearObj => yearObj.year);
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateCurrentYear(newCurrentYear: string) {
  await prisma.config.upsert({
    where: { key: "currentYear" },
    update: { value: newCurrentYear },
    create: { key: "currentYear", value: newCurrentYear }
  });
}

export async function getCurrentYear() {
  const currentYear = await prisma.config.findUnique({
    where: { key: "currentYear" }
  });
  return currentYear?.value;
}

export async function getSchoolYearText(schoolYear: SchoolYear) {
  return schoolYear.value === "current"
    ? await getCurrentYear()
    : schoolYear.value
}

/**
 * Gets all of the officer information from a given school year.
 * @param yearText A school year. Ex: "2024-2025" 
 * @returns An OfficerYear object containing the query results.
 */
export async function getOfficerYear(yearInput: SchoolYear) {
  try {
    const officerYear = await prisma.officerYear.findUnique({
      where: {
        year: await getSchoolYearText(yearInput)
      },
      include: {
        officerBios: {
          include: {
            user: true
          }
        }
      }
    });

    if (!officerYear) throw new Error(`${yearInput.value} could not be found`);

    const officerDetailPromises = officerYear.officerBios.map(async (officer) => {
      const avatar = officer.image
        ? await getStoredImageUrl(officer.image)
        : undefined;

      return {
        name: officer.user.name,
        title: officer.position,
        avatar: avatar ?? getRandomMascotImageFallback(),
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
  } catch (error) {
    console.error(error);
    return {
      year: currentYearHeaderText,
      excerpt: currentYearExcerpt,
      officerDetails: [],
      startTimestamp: new Date(), 
    } satisfies OfficerYear;
  }
}
