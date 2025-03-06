
export const sendSms = async (phoneNumber: string, message: string) => {
    try {
        const query = new URLSearchParams({
            clientid: process.env.HUBTEL_CLIENT_ID as string,
            clientsecret: process.env.HUBTEL_CLIENT_SECRET as string,
            from: process.env.HUBTEL_SMS_NAME as string,
            to: phoneNumber,
            content: message
        }).toString();
    
        const resp = await fetch(
            `${process.env.HUBTEL_SMS_URL}?${query}`,
            {method: 'GET'}
        );
    
        const data = await resp.text();
        console.log(data);
        return {
            error: null,
            data: data
        }
    } catch (error:any) {
        return {
            error: error?.message,
            data: null
        }
    }
}