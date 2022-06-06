import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module'

import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';
import { CreateBookmarkDto, EditBookmarkDto } from 'src/bookmark/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService
  beforeAll(async () => {
    const moduelRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduelRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl("http://localhost:3333");
  });

  afterAll(async () => {
    app.close();
  });

  // Auth test
  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'abc@gmail.com',
      password: '123'
    }
    describe('Signup', () => {
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
      })

      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
      })

      it('should throw error if both email and password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400)
      })

      it('should signup a user', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201)


      });
    })

    describe('Signin', () => {

      let accessToken: string;
      it('should throw error if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400)
      })

      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email: dto.email,
          })
          .expectStatus(400)
      })

      it('should throw error if both email and password is empty', () => {
        return pactum
          .spec()
          .post('/auth/sigin')
          .expectStatus(404)
      })

      it('should signin a user', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token')
      });

    });

  })

  // User test
  describe('user', () => {
    describe('Get Me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            'Authorization': `Bearer $S{userAt}`
          })
          .expectStatus(200)
          .inspect()
      });
    });

    describe('Edit User', () => {
      const dto: EditUserDto = {
        email: 'abc1@gmail.com',
        firstName: 'abc1',
        lastName: 'abc2'
      }
      it('should edit current user', () => {
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            'Authorization': `Bearer $S{userAt}`
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.lastName);
      })
    });


  })

  // Bookmark test
  describe('Bookmarks', () => {

    describe('Get empty Bookmarks', () => {
      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            'Authorization': `Bearer $S{userAt}`
          })
          .expectStatus(200)
          .expectBodyContains('[]')
      })
    })

    describe('Create Bookmark', () => {

      const dto: CreateBookmarkDto = {
        title: 'title',
        link: 'link',
        description: 'This is sample description',
      }
      it('should create a bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            'Authorization': `Bearer $S{userAt}`
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id')
        // .expectBodyContains('title')
        // .expectBodyContains('link');
      })
    });

    describe('Get Bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            'Authorization': `Bearer $S{userAt}`
          })
          .expectStatus(200)
          .expectJsonLength(1)
      })
    });

    describe('Get Bookmark By Id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            'Authorization': `Bearer $S{userAt}`
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')

      })
    });

    describe('Edit Bookmark By Id', () => {
      const dto: EditBookmarkDto = {
        title: 'title updated',
        link: 'link Updated',
        description: 'Sample description Updated',
      }
      it('should edit bookmark by id', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            'Authorization': `Bearer $S{userAt}`
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.link);
      })
    })


    describe('Delete Bookmark By ID', () => {
      it('should delete bookmark by id', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            'Authorization': `Bearer $S{userAt}`
          })
          .expectStatus(204)

      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            'Authorization': `Bearer $S{userAt}`
          })
          .expectStatus(200)
          .expectBodyContains('[]')
      })
    });




  })


  // it.todo('Should Pass');
});