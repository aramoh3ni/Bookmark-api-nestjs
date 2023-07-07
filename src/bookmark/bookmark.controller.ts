import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { BookmarkService } from "./bookmark.service";
import { BookmarkDTO, EditBookmarkDTO } from "./dto";
import { JwtGuard } from "../auth/guard";
import { GetUser } from "../auth/decorator";

@UseGuards(JwtGuard)
@Controller("bookmarks")
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  getBookmark(
    @GetUser("id") userId: string,
    @Param("id", ParseUUIDPipe) bookmarkId: string,
  ) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getBookmarks(@GetUser("id") userId: string) {
    return this.bookmarkService.getBookmarks(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createBookmark(@GetUser("id") userId: string, @Body() dto: BookmarkDTO) {
    return this.bookmarkService.createBookmark(userId, dto);
  }

  @Put(":id")
  @HttpCode(HttpStatus.CREATED)
  updateBookmark(
    @GetUser("id") userId: string,
    @Param("id", ParseUUIDPipe) bookmarkId: string,
    @Body() dto: EditBookmarkDTO,
  ) {
    return this.bookmarkService.updateBookmarkById(userId, bookmarkId, dto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBookmark(
    @GetUser("id") userId: string,
    @Param("id", ParseUUIDPipe) bookmarkId: string,
  ) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
