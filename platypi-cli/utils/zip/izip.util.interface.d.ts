declare module utils {
    export interface IZipUtil {
        extractAll(extractLocation: string, overwrite: boolean): string;
    }
}
