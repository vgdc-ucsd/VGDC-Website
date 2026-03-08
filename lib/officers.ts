import { prisma } from "./prisma"
import { getRandomMascotImageFallback, getStoredImageUrl, imageFallbacks } from "./images"
import { Role } from "./generated/prisma/enums";
import { getRandomElementFromArray, Result } from "./utils";

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

export const currentSchoolYear: SchoolYear = { type: "current", value: "currentYear"}
export const currentYearHeaderText = "Our Team"
export const currentYearExcerpt = "We're a growing body of talented individuals with a passion for making game development exciting in every way. Hover over each profile!"

export async function getAllYears(yearToExclude: SchoolYear) : Promise<SchoolYear[]> {
  try {
    const yearToExcludeText = await getSchoolYearText(yearToExclude);
    const currentYearText = await getCurrentYear()
    const years = await prisma.officerYear.findMany({
      where: { 
        year: {
          not: yearToExcludeText
        },
      },
      select: {
        year: true,
      }
    });

    return years.map(yearObj => (
      yearObj.year === currentYearText 
        ? currentSchoolYear 
        : { type: "year", value: yearObj.year }
    ));
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
  return schoolYear.type === "current"
    ? await getCurrentYear()
    : schoolYear.value
}

/**
 * Gets all of the officer information from a given school year.
 * @param yearInput A school year. Ex: { type: "year", value: "2024-2025" } 
 * @returns An OfficerYear object containing the query results.
 */
export async function getOfficerYear(yearInput: SchoolYear): Promise<Result<OfficerYear>> {
  if (!yearInput?.value) return { ok: false, error: "Invalid year" };

  try {
    const yearText = await getSchoolYearText(yearInput)
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

    if (!officerYear) return { ok: false, error: `${yearInput.value} not found`}

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

     return {
      ok: true,
      data: {
        year: officerYear.year,
        excerpt: officerYear.excerpt,
        officerDetails: await Promise.all(officerDetailPromises),
        startTimestamp: officerYear.startTimestamp,
      }
    }
  } catch (error) {
    console.error("Failed to load officer year ", error);

    return {
      ok: false,
      error: "Internal server error"
    }
  }
}
