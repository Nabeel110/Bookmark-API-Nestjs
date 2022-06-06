import { Body, Controller, HttpCode, HttpStatus, Post, } from "@nestjs/common";
import { User } from "@prisma/client";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";

@Controller('auth')
export class AuthControler {

    constructor(private readonly authService: AuthService) { }

    // POST auth/signup
    @Post('signup')
    signup(@Body() authdto: AuthDto) {
        return this.authService.signup(authdto);
    }

    // POST auth/signin
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    signin(@Body() authdto: AuthDto) {
        return this.authService.signin(authdto);
    }

}