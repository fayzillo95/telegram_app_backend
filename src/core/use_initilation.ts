import { ValidationPipe, INestApplication } from "@nestjs/common";
import { } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { MulterValidationExceptionFilter } from "./error/validation.filter";
import { SwaggerTheme, SwaggerThemeNameEnum } from 'swagger-themes'; // Import SwaggerTheme
import * as cookieParser from 'cookie-parser';
import { DeviceMiddleware } from "src/global/middlewares/device.middleware";
import { JwtAuthGuard } from "src/global/guards/jwt.auth.guard";

export const initGlobalApp = (app: INestApplication) => {
    const config = new DocumentBuilder().setTitle("Edfix Clone").build()
    app.setGlobalPrefix("api")
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }))

    app.use(cookieParser());


    const document = SwaggerModule.createDocument(app, config)

    const theme = new SwaggerTheme();
    const darkThemeCss = theme.getBuffer(SwaggerThemeNameEnum.ONE_DARK);

    SwaggerModule.setup("api-docs", app, document, {
        customCss: darkThemeCss,
        customSiteTitle: 'My API Docs',
    })
    app.enableCors({
        origin: "*",
    });
    app.use(new DeviceMiddleware().use)
    app.useGlobalFilters(new MulterValidationExceptionFilter())
    app.enableCors()
    console.log("Init functio complieted\n http://192.168.34.176:15976/api-docs")

}
