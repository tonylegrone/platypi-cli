declare module server.models {
    interface IBaseModel {
        id?: string;
    }

    interface IValidationError {
        message: string;
        property: string;
    }

    interface IValidationErrors extends Array<IValidationError> { }
}
