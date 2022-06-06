import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) { }

    async signup(authDto: AuthDto) {
        // Generate the password hash
        const hash = await argon.hash(authDto.password);

        // Save the new User to databse
        try {
            const newUser = await this.prismaService
                .user.create({
                    data: {
                        email: authDto.email,
                        passwordHash: hash
                    },
                    // select: {
                    //     id: true,
                    //     email: true,
                    //     passwordHash: false,
                    //     createdAt: true,
                    // }
                })

            return this.signToken(newUser.id, newUser.email);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ForbiddenException('Credentials already taken!');
                }
            }
            throw error;
        }

    }


    //return the Saved User


    async signin(authDto: AuthDto) {
        // Find user by email
        // If user not exist, throw error
        // If user exist, compare the password
        // If password is wrong, throw error
        // If password is correct, return the user
        const user = await this.prismaService.user.findUnique({
            where: {
                email: authDto.email
            }
        })

        if (!user) throw new ForbiddenException('Credentials are wrong!');

        //compare the password
        const isValid = await argon.verify(user.passwordHash, authDto.password);
        if (!isValid) throw new ForbiddenException('Credentials are wrong!');

        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string): Promise<{ access_token: string }> {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET');
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        })
        return {
            access_token: token
        }

    }

}