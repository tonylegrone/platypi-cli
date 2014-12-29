declare module utils {
    export interface IZipUtil {
        extractAll(zipLocation: string, extractLocation: string, overwrite: boolean): string;
    }
}
