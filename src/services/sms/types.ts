export interface SmsType {
    clientid?: string;
    clientsecret?: string;
    from?: string;
    to: string;
    content: string;
}

export interface SmsResponseType {
    message: string,
    responseCode: string,
    data: {
      rate: 0,
      messageId: string,
      status: string,
      networkId: string
    }
}