import { PrismaClient } from '@/lib/generated/prisma/client';
import type {
  TransformedGame,
  TransformedEvent,
  TransformedBlogPost,
  TransformedStoreItem,
  GameTagData,
} from './data-transformers';

export class DatabaseMigrator {
  constructor(private prisma: PrismaClient) {}

  async clearDatabase(): Promise<void> {
    console.log('🗑️  Clearing existing data...');

    await this.prisma.$transaction([
      this.prisma.blogPost.deleteMany(),
      this.prisma.storeItem.deleteMany(),
      this.prisma.event.deleteMany(),
      this.prisma.game.deleteMany(), // Must come before GameTags due to relation
      this.prisma.gameTags.deleteMany(),
      this.prisma.eventTags.deleteMany(),
    ]);

    console.log('✅ Database cleared');
  }

  async createGameTags(tags: GameTagData[]): Promise<Map<string, number>> {
    console.log(`🏷️  Creating ${tags.length} game tags...`);

    const tagMap = new Map<string, number>();

    for (const tag of tags) {
      const created = await this.prisma.gameTags.create({
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

    let created = 0;
    let failed = 0;

    for (const game of games) {
      try {
        // Find the tag ID for this game's theme
        const tagIds =
          game.themeText && tagMap.has(game.themeText)
            ? [tagMap.get(game.themeText)!]
            : [];

        await this.prisma.game.create({
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
          },
        });
        created++;
      } catch (error) {
        console.error(`❌ Failed to create game "${game.title}":`, error);
        failed++;
      }
    }

    console.log(`✅ Created ${created} games${failed > 0 ? ` (${failed} failed)` : ''}`);
  }

  async createEvents(events: TransformedEvent[]): Promise<void> {
    console.log(`📅 Creating ${events.length} events...`);

    let created = 0;
    let failed = 0;

    for (const event of events) {
      try {
        await this.prisma.event.create({
          data: {
            name: event.name,
            location: event.location,
            date: event.date,
            startTime: event.startTime,
            endTime: event.endTime,
            description: event.description,
            image: event.image,
            gallery: event.gallery,
            slug: event.slug,
          },
        });
        created++;
      } catch (error) {
        console.error(`❌ Failed to create event "${event.name}":`, error);
        failed++;
      }
    }

    console.log(`✅ Created ${created} events${failed > 0 ? ` (${failed} failed)` : ''}`);
  }

  async createBlogPosts(posts: TransformedBlogPost[]): Promise<void> {
    console.log(`📝 Creating ${posts.length} blog posts...`);

    let created = 0;
    let failed = 0;

    for (const post of posts) {
      try {
        await this.prisma.blogPost.create({
          data: {
            title: post.title,
            subtitle: post.subtitle,
            date: post.date,
            authors: post.authors,
            coverImage: post.coverImage,
            coverCaption: post.coverCaption,
            postData: post.postData,
          },
        });
        created++;
      } catch (error) {
        console.error(
          `❌ Failed to create blog post "${post.title}":`,
          error
        );
        failed++;
      }
    }

    console.log(`✅ Created ${created} blog posts${failed > 0 ? ` (${failed} failed)` : ''}`);
  }

  async createStoreItems(items: TransformedStoreItem[]): Promise<void> {
    console.log(`🛍️  Creating ${items.length} store items...`);

    let created = 0;
    let failed = 0;

    for (const item of items) {
      try {
        await this.prisma.storeItem.create({
          data: {
            name: item.name,
            price: item.price,
            description: item.description,
            image: item.image,
            gallery: item.gallery,
            stock: item.stock,
          },
        });
        created++;
      } catch (error) {
        console.error(`❌ Failed to create store item "${item.name}":`, error);
        failed++;
      }
    }

    console.log(`✅ Created ${items.length} store items${failed > 0 ? ` (${failed} failed)` : ''}`);
  }

  async migrate(data: {
    games: TransformedGame[];
    events: TransformedEvent[];
    blogPosts: TransformedBlogPost[];
    storeItems: TransformedStoreItem[];
    gameTags: GameTagData[];
  }): Promise<void> {
    try {
      await this.clearDatabase();
      const tagMap = await this.createGameTags(data.gameTags);
      await this.createGames(data.games, tagMap);
      await this.createEvents(data.events);
      await this.createBlogPosts(data.blogPosts);
      await this.createStoreItems(data.storeItems);
      console.log('\n🎉 Migration completed successfully!');
    } catch (error) {
      console.error('\n💥 Migration failed:', error);
      throw error;
    }
  }
}
