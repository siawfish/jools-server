import { formatDbError } from "../../helpers/constants";
import { BookingType } from "./types";


export const createBooking = async (booking: BookingType): Promise<{error?:string; data?:BookingType}> => {
    try {
        const dbBooking = {
            id: "123",
            start: new Date(),
            end: new Date(),
            timelines: [],
            workerId: "123",
            userId: "123",
            day: new Date(),
            description: "Booking for a plumbing job",
            media: [],
            estimatedFee: 100,
            skills: [],
        }
        return { data: dbBooking as BookingType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getBookingById = async (id: string): Promise<{error?:string; data?:BookingType}> => {
    try {
        const booking = {
            id: "123",
            start: new Date(),
            end: new Date(),
            timelines: [],
            workerId: "123",
            userId: "123",
            day: new Date(),
            description: "Booking for a plumbing job",
            media: [],
            estimatedFee: 100,
            skills: [],
        }
        if(!booking) {
            throw new Error(`Booking with id "${id}" does not exist`)
        }
        return { data: booking as BookingType }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const getBookingsByUserId = async (userId: string): Promise<{error?:string; data?:BookingType[]}> => {
    try {
        const bookings = [] as BookingType[];
        return { data: bookings }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const getBookingsByWorkerId = async (workerId: string): Promise<{error?:string; data?:BookingType[]}> => {
    try {
        const bookings = [] as BookingType[];
        return { data: bookings }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const updateBooking = async (id: string, booking: BookingType): Promise<{error?:string; data?:BookingType}> => {
    try {
        const dbBooking = {
            id: "123",
            start: new Date(),
            end: new Date(),
            timelines: [],
            workerId: "123",
            userId: "123",
            day: new Date(),
            description: "Booking for a plumbing job",
            media: [],
            estimatedFee: 100,
            skills: [],
        }
        return { data: dbBooking as BookingType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const deleteBooking = async (id: string): Promise<{error?:string; data?:BookingType}> => {
    try {
        const dbBooking = {
            id: "123",
            start: new Date(),
            end: new Date(),
            timelines: [],
            workerId: "123",
            userId: "123",
            day: new Date(),
            description: "Booking for a plumbing job",
            media: [],
            estimatedFee: 100,
            skills: [],
        }
        return { data: dbBooking as BookingType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}