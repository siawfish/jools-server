import { formatDbError } from "../../helpers/constants";
import { getXataClient } from "../../xata";
import { BookingType } from "./types";

const xata = getXataClient();

export const createBooking = async (booking: BookingType): Promise<{error?:string; data?:BookingType}> => {
    try {
        const dbBooking = await xata.db.bookings.create(booking)
        return { data: dbBooking as BookingType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const getBookingById = async (id: string): Promise<{error?:string; data?:BookingType}> => {
    try {
        const booking = await xata.db.bookings.filter({ id }).getFirst();
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
        const bookings = await xata.db.bookings.filter({ userId }).getAll();
        return { data: bookings as BookingType[] }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const getBookingsByWorkerId = async (workerId: string): Promise<{error?:string; data?:BookingType[]}> => {
    try {
        const bookings = await xata.db.bookings.filter({ workerId }).getAll();
        return { data: bookings as BookingType[] }
    } catch (error:any) {
        return { error: error?.message }
    }
}

export const updateBooking = async (id: string, booking: BookingType): Promise<{error?:string; data?:BookingType}> => {
    try {
        const dbBooking = await xata.db.bookings.update(id, booking)
        return { data: dbBooking as BookingType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}

export const deleteBooking = async (id: string): Promise<{error?:string; data?:BookingType}> => {
    try {
        const dbBooking = await xata.db.bookings.delete(id)
        return { data: dbBooking as BookingType }
    } catch (error:any) {
        return { error: formatDbError(error?.message) }
    }
}