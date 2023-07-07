import { Test } from "@nestjs/testing";
import * as pactum from "pactum";
import { AppModule } from "../src/app.module";
import { Body, ValidationPipe } from "@nestjs/common";
import { NestApplication } from "@nestjs/core";
import { PrismaService } from "../src/prisma/prisma.service";
import { SignUpDTO, SignInDTO } from "src/auth/dto";
import { EditUserDTO } from "src/user/dto";
import { BookmarkDTO, EditBookmarkDTO } from "src/bookmark/dto";
import { domainToASCII } from "url";

describe("App e2e", () => {
  let app: NestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(8000);

    prisma = app.get(PrismaService);
    prisma.cleanDB();

    pactum.request.setBaseUrl("http://localhost:8000");
  });

  afterAll(() => {
    app.close();
  });

  describe("Auth", () => {
    describe("Signup", () => {
      const dto: SignUpDTO = {
        email: "test@gmail.com",
        password: "ara@@@111EEE",
        passwordConfirm: "ara@@@111EEE",
        firstName: "tester",
        lastName: "testmaster",
      };

      it("Should throw 400 if email empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it("Should throw 400 if email is InValid", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            email: "some",
            password: dto.password,
          })
          .expectStatus(400);
      });

      it("Should throw 400 if password is Empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it("Should throw 400 if firstName is not Alphabetic", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            firstName: "ali 123",
          })
          .expectStatus(400);
      });

      it("Should throw 400 if lastName is not Alphabetic", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            lastName: 123123,
          })
          .expectStatus(400);
      });

      it("Should throw 400 if no body provided.", () => {
        return pactum.spec().post("/auth/signup").expectStatus(400);
      });

      it("Should be signup", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody(dto)
          .expectStatus(201);
        //.inspect(); // console the header
      });
    });

    describe("Signin", () => {
      const dto: SignInDTO = {
        email: "test@gmail.com",
        password: "ara@@@111EEE",
      };

      it("Should throw 400 if email empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({ password: dto.password })
          .expectStatus(400);
      });

      it("Should throw 400 if email is InValid", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            email: "some",
            password: dto.password,
          })
          .expectStatus(400);
      });

      it("Should throw 400 if password is Empty", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });

      it("Should throw 400 if no body provided.", () => {
        return pactum.spec().post("/auth/signup").expectStatus(400);
      });

      it("Should be signin", () => {
        return pactum
          .spec()
          .post(`/auth/signin`)
          .withBody(dto)
          .expectStatus(200)
          .stores("userToken", "accessToken");
      });
    });
  });

  describe("User", () => {
    const dto: EditUserDTO = {
      email: "google@gmail.com",
      firstName: "lovely",
    };

    describe("Get Me", () => {
      it("Should be 401 Unauthorized if token is empty.", () => {
        return pactum.spec().get("/users/me").expectStatus(401);
      });

      it("Should be 200 is Success.", () => {
        return pactum
          .spec()
          .get("/users/me")
          .withHeaders({
            Authorization: "Bearer $S{userToken}",
          })
          .expectStatus(200);
      });
    });

    describe("Edit User", () => {
      it("Should be 200 is Success.", () => {
        return pactum
          .spec()
          .put("/users")
          .withHeaders({
            Authorization: "Bearer $S{userToken}",
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.email)
          .expectBodyContains(dto.firstName);
      });

      it("Should throw 400 if firstName is not Alphabetic", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            firstName: "ali 123",
          })
          .expectStatus(400);
      });

      it("Should throw 400 if lastName is not Alphabetic", () => {
        return pactum
          .spec()
          .post("/auth/signup")
          .withBody({
            lastName: 123123,
          })
          .expectStatus(400);
      });
    });
  });

  describe("Bookmark", () => {
    const dto: BookmarkDTO = {
      title: "first",
      description: "Some description about the bookmark",
      link: "https://www.youtube.com/watch?v=9aj2nmeifasldf934",
    };

    describe("Get empty Bookmark", () => {
      it("should get bookmarks", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userToken}",
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe("Create Bookmark", () => {
      it("Should Expect 401 if user is unauthorized.", () => {
        return pactum
          .spec()
          .post("/bookmarks")
          .withBody(dto)
          .withHeaders({
            Authorization: "Bearer",
          })
          .expectStatus(401);
      });

      it("Should Expect 400 if Title is empty.", () => {
        return pactum
          .spec()
          .post("/bookmarks")
          .withBody({ link: dto.link, describe: dto.description })
          .withHeaders({
            Authorization: "Bearer $S{userToken}",
          })
          .expectStatus(400);
      });

      it("Should Expect 400 if link is empty.", () => {
        return pactum
          .spec()
          .post("/bookmarks")
          .withBody({ title: dto.title, describe: dto.description })
          .withHeaders({
            Authorization: "Bearer $S{userToken}",
          })
          .expectStatus(400);
      });

      it("Should create Bookmark", () => {
        return pactum
          .spec()
          .post("/bookmarks")
          .withBody(dto)
          .withHeaders({
            Authorization: "Bearer $S{userToken}",
          })
          .expectStatus(201)
          .expectBodyContains(dto.description)
          .expectBodyContains(dto.link)
          .expectBodyContains(dto.title)
          .stores("bookmarkId", "id");
      });
    });

    describe("Get Bookmarks", () => {
      it("Should Expect 401 if user is unauthorized.", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer",
          })
          .expectStatus(401);
      });

      it("Should Expect 200 and get Bookmarks.", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userToken}",
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe("Get Bookmark By Id", () => {
      it("Should get bookmark by id and Expect 200.", () => {
        return pactum
          .spec()
          .get("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({
            Authorization: "Bearer $S{userToken}",
          })
          .withBody({ title: "Some thing updated" })
          .expectStatus(200);
      });
    });

    describe("Update Bookmark By Id", () => {
      const dto: EditBookmarkDTO = {
        title: "Hello world",
      };

      it("Should Expect 401 if user is Unauthorized.", () => {
        return pactum
          .spec()
          .put("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({
            Authorization: "Bearer",
          })
          .withBody(dto)
          .expectStatus(401);
      });

      it("Should get bookmark by id and Expect 200.", () => {
        return pactum
          .spec()
          .put("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({
            Authorization: "Bearer $S{userToken}",
          })
          .withBody({ title: "Hello world" })
          .expectStatus(201)
          .expectBodyContains(dto.title);
      });
    });

    describe("Delete Bookmark", () => {
      it("Should delete bookmark by id and Expect 200.", () => {
        return pactum
          .spec()
          .delete("/bookmarks/{id}")
          .withPathParams("id", "$S{bookmarkId}")
          .withHeaders({
            Authorization: "Bearer $S{userToken}",
          })
          .expectStatus(204);
      });

      it("Should get empty bookmarks [].", () => {
        return pactum
          .spec()
          .get("/bookmarks")
          .withHeaders({
            Authorization: "Bearer $S{userToken}",
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
