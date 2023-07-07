import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { BookmarkDTO, EditBookmarkDTO } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: string) {
    return this.prisma.bookmark.findMany({
      where: { userId },
    });
  }

  async getBookmarkById(userId: string, bookmarkId: string) {
    return await this.prisma.bookmark.findFirst({
      where: {
        userId,
        id: bookmarkId,
      },
    });
  }

  async createBookmark(userId: string, dto: BookmarkDTO) {
    return await this.prisma.bookmark.create({
      data: {
        userId,
        ...dto,
      },
    });
  }

  async updateBookmarkById(
    userId: string,
    bookmarkId: string,
    dto: EditBookmarkDTO,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (bookmark.userId !== userId)
      throw new UnauthorizedException("Access to resource denied.");

    if (!bookmark || bookmark === undefined)
      throw new NotFoundException("Not Found.");

    return this.prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: string, bookmarkId: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      },
    });
    if (bookmark.userId !== userId)
      throw new UnauthorizedException("Access to resource denied.");

    return this.prisma.bookmark.delete({
      where: { id: bookmarkId },
    });
  }
}
