import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { getUser } from '../auth/decorator/get-user-decorator';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
    constructor(private readonly boomarkService: BookmarkService) { }

    @Get()
    getAllBookmarks(@getUser('id') userId: number) {
        return this.boomarkService.getAllBookmarks(userId);
    }

    @Get(':id')
    getBookmarkById(
        @getUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number) {
        return this.boomarkService.getBookmarkById(userId, bookmarkId);
        // return this.boomarkService.getAllBookmarks();
    }

    @Post()
    createBookmark(
        @getUser('id') userId: number,
        @Body() dto: CreateBookmarkDto
    ) {
        return this.boomarkService.createBookmark(userId, dto);
    }

    @Patch(':id')
    updateBookmarkById(
        @getUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number,
        @Body() dto: EditBookmarkDto
    ) {

        return this.boomarkService.updateBookmarkById(userId, bookmarkId, dto);
        // return this.boomarkService.getAllBookmarks();
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    deleteBookmarkById(
        @getUser('id') userId: number,
        @Param('id', ParseIntPipe) bookmarkId: number
    ) {
        return this.boomarkService.deleteBookmarkById(userId, bookmarkId);
    }
}
