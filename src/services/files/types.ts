export interface ExpressFile {
    name: string;
    data: Buffer;
    size: number;
    encoding: string;
    tempFilePath: string;
    truncated: boolean;
    mimetype: string;
    md5: string;
    mv: Function;
}

export interface RequestFiles { 
    images?: ExpressFile[] | ExpressFile;
    videos?: ExpressFile[] | ExpressFile;
}

export enum ResourceUploadType {
    PORTFOLIO = "PORTFOLIO",
    DOCUMENTS = "DOCUMENTS",
    COMMENTS = "COMMENTS",
    AVATAR = "AVATAR",
}