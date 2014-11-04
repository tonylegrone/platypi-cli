declare module ajax {
    interface IHttpConfig {
        url?: string;
        method?: string;
        contentType?: string;
    }

    interface IResponseBody {
        status: string;
        data: any;
        message?: string;
    }

    interface IResponse {
        status: number;
        body: IResponseBody;
    }
}
