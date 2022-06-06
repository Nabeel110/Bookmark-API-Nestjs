import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {

    constructor(private readonly prisma: PrismaService) { }

    async getAllBookmarks(userId: number) {
        const bookmarks = await this.prisma.bookmark.findMany({
            where: {
                userId: userId
            }
        });

        if (bookmarks) return bookmarks;
    }

    async getBookmarkById(userId: number, bookmarkId: number) {
        const userBookmark = this.prisma.bookmark.findFirst({
            where: {
                userId: userId,
                id: bookmarkId
            }
        });

        if (userBookmark) return userBookmark;
    }

    async createBookmark(userId: number, dto: CreateBookmarkDto) {
        const newBookmark = await this.prisma.bookmark.create({
            data: {
                title: dto.title,
                link: dto.link,
                description: dto.description,
                userId: userId
            }
        });

        if (newBookmark) return newBookmark;
    }

    async updateBookmarkById(userId: number, bookmarkId: number, dto: EditBookmarkDto,) {

        //Get Bookmark by id
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            },
        })

        //Check if that bookmark belongs to user
        if (!bookmark || bookmark.userId !== userId)
            throw new ForbiddenException('Access to resource denied');

        //Update bookmark
        return await this.prisma.bookmark.update({
            where: {
                id: bookmarkId
            },
            data: {
                ...dto
            }
        })

    }

    async deleteBookmarkById(userId: number, bookmarkId: number) {

        //Get Bookmark by id
        const bookmark = await this.prisma.bookmark.findUnique({
            where: {
                id: bookmarkId
            },
        })

        //Check if that bookmark belongs to user
        if (!bookmark || bookmark.userId !== userId)
            throw new ForbiddenException('Access to resource denied');

        return await this.prisma.bookmark.delete({
            where: {
                id: bookmarkId,
            }
        });
    }
}
