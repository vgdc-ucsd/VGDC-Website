import type { Prisma, PrismaClient } from '@/lib/generated/prisma/client';
import type {
  TransformedGame,
  TransformedEvent,
  TransformedBlogPost,
  TransformedStoreItem,
  GameTagData,
} from './data-transformers';
import type { TransformedOfficers } from './officer-data';

export interface MigrationData {
  games: TransformedGame[];
  events: TransformedEvent[];
  blogPosts: TransformedBlogPost[];
  storeItems: TransformedStoreItem[];
  gameTags: GameTagData[];
  officers: TransformedOfficers;
}

/**
 * Runs inside a single transaction: if any step fails, every change
 * (including the initial clear) is rolled back and the database is untouched.
 */
class MigrationSteps {
  constructor(private tx: Prisma.TransactionClient) {}

  async clearDatabase(): Promise<void> {
    console.log('🗑️  Clearing existing data...');

    await this.tx.blogPost.deleteMany();
    await this.tx.storeItem.deleteMany();
    await this.tx.event.deleteMany();
    await this.tx.game.deleteMany(); // Must come before GameTags due to relation
    await this.tx.gameTags.deleteMany();
    await this.tx.eventTags.deleteMany();
    // Users are kept (upserted in createOfficers) so changes made to them outside
    // the import, like a real discordHandle or role, aren't lost
    await this.tx.officerBio.deleteMany();
    await this.tx.officerYear.deleteMany();

    console.log('✅ Database cleared');
  }

  async createGameTags(tags: GameTagData[]): Promise<Map<string, number>> {
    console.log(`🏷️  Creating ${tags.length} game tags...`);

    const tagMap = new Map<string, number>();

    for (const tag of tags) {
      const created = await this.tx.gameTags.create({
        data: {
          text: tag.text,
          color: tag.color,
        },
      });
      tagMap.set(tag.text, created.id);
    }

    console.log(`✅ Created ${tags.length} game tags`);
    return tagMap;
  }

  async createGames(
    games: TransformedGame[],
    tagMap: Map<string, number>
  ): Promise<void> {
    console.log(`🎮 Creating ${games.length} games...`);

    for (const game of games) {
      // Find the tag ID for this game's theme
      const tagIds =
        game.themeText && tagMap.has(game.themeText)
          ? [tagMap.get(game.themeText)!]
          : [];

      await withContext(`game "${game.title}"`, () =>
        this.tx.game.create({
          data: {
            title: game.title,
            credits: game.credits,
            description: game.description,
            releaseDate: game.releaseDate,
            difficulty: game.difficulty,
            link: game.link,
            thumbnail: game.thumbnail,
            isWebPlayable: game.isWebPlayable,
            status: game.status,
            hasSeal: game.hasSeal,
            gameTags: {
              connect: tagIds.map((id) => ({ id })),
            },
          } satisfies Prisma.GameCreateInput,
        })
      );
    }

    console.log(`✅ Created ${games.length} games`);
  }

  async createEvents(events: TransformedEvent[]): Promise<void> {
    console.log(`📅 Creating ${events.length} events...`);

    await withContext('events', () =>
      this.tx.event.createMany({
        data: events.map(
          (event) =>
            ({
              name: event.name,
              location: event.location,
              startTimestamp: event.startTimestamp,
              endTimestamp: event.endTimestamp,
              description: event.description,
              image: event.image,
              gallery: event.gallery,
              slug: event.slug,
            }) satisfies Prisma.EventCreateManyInput
        ),
      })
    );

    console.log(`✅ Created ${events.length} events`);
  }

  async createBlogPosts(posts: TransformedBlogPost[]): Promise<void> {
    console.log(`📝 Creating ${posts.length} blog posts...`);

    await withContext('blog posts', () =>
      this.tx.blogPost.createMany({
        data: posts.map(
          (post) =>
            ({
              title: post.title,
              subtitle: post.subtitle,
              date: post.date,
              authors: post.authors,
              coverImage: post.coverImage,
              coverCaption: post.coverCaption,
              postData: post.postData,
              slug: post.slug,
            }) satisfies Prisma.BlogPostCreateManyInput
        ),
      })
    );

    console.log(`✅ Created ${posts.length} blog posts`);
  }

  async createStoreItems(items: TransformedStoreItem[]): Promise<void> {
    console.log(`🛍️  Creating ${items.length} store items...`);

    await withContext('store items', () =>
      this.tx.storeItem.createMany({
        data: items.map(
          (item) =>
            ({
              name: item.name,
              price: item.price,
              description: item.description,
              image: item.image,
              gallery: item.gallery,
              stock: item.stock,
            }) satisfies Prisma.StoreItemCreateManyInput
        ),
      })
    );

    console.log(`✅ Created ${items.length} store items`);
  }

  async createOfficers({ currentYear, years, users }: TransformedOfficers): Promise<void> {
    const bioCount = years.reduce((count, year) => count + year.bios.length, 0);
    console.log(`🧑‍💼 Creating ${users.length} officer users, ${years.length} officer years, ${bioCount} bios...`);

    // Matched by placeholder discordHandle, so re-running updates the same users. Role
    // isn't updated: it may have been changed on purpose since the last import.
    const userIds = new Map<string, number>();
    for (const user of users) {
      const { id } = await withContext(`user "${user.name}"`, () =>
        this.tx.user.upsert({
          where: { discordHandle: user.discordHandle },
          update: { name: user.name, profilePicture: user.profilePicture },
          create: {
            name: user.name,
            discordHandle: user.discordHandle,
            role: user.role,
            profilePicture: user.profilePicture,
          } satisfies Prisma.UserCreateInput,
          select: { id: true },
        })
      );
      userIds.set(user.discordHandle, id);
    }

    for (const year of years) {
      // createMany inserts in order, so ids follow officers.json's display order
      await withContext(`officer year ${year.year}`, () =>
        this.tx.officerYear.create({
          data: {
            year: year.year,
            excerpt: year.excerpt,
            startTimestamp: year.startTimestamp,
            officerBios: {
              createMany: {
                data: year.bios.map(
                  (bio) =>
                    ({
                      userId: userIds.get(bio.userHandle)!,
                      position: bio.position,
                      description: bio.description,
                      image: bio.image,
                    }) satisfies Prisma.OfficerBioCreateManyYearInput
                ),
              },
            },
          } satisfies Prisma.OfficerYearCreateInput,
        })
      );
    }

    await this.tx.config.upsert({
      where: { key: 'currentYear' },
      update: { value: currentYear },
      create: { key: 'currentYear', value: currentYear },
    });

    console.log(`✅ Created officers, current year set to ${currentYear}`);
  }
}

/** Re-throws an error with the record that caused it, since the whole migration aborts. */
async function withContext<T>(what: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    throw new Error(`Failed to create ${what}: ${(error as Error).message}`, {
      cause: error,
    });
  }
}

export class DatabaseMigrator {
  constructor(private prisma: PrismaClient) {}

  async migrate(data: MigrationData): Promise<void> {
    try {
      await this.prisma.$transaction(
        async (tx) => {
          const steps = new MigrationSteps(tx);
          await steps.clearDatabase();
          const tagMap = await steps.createGameTags(data.gameTags);
          await steps.createGames(data.games, tagMap);
          await steps.createEvents(data.events);
          await steps.createBlogPosts(data.blogPosts);
          await steps.createStoreItems(data.storeItems);
          await steps.createOfficers(data.officers);
        },
        // The default 5s timeout is too short for a remote database
        { maxWait: 10_000, timeout: 120_000 }
      );
      console.log('\n🎉 Migration completed successfully!');
    } catch (error) {
      console.error('\n💥 Migration failed, all changes were rolled back');
      throw error;
    }
  }
}
