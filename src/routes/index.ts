import workerAuthRoutes from './workers/auth.js'
import userAuthRoutes from './users/auth.js'
import workerProfileRoutes from './workers/profile.js'
import portfolioRoutes from './workers/portfolio.js'
import workerFilesRoutes from './workers/files.js'
import usersFilesRoutes from './users/files.js'
import usersProfileRoutes from './users/profile.js'
import usersBookingRoutes from './users/bookings.js'

const workerRouter = {
    workersAuthRoutes: workerAuthRoutes,
    workersProfileRoutes: workerProfileRoutes,
    workersPortfolioRoutes: portfolioRoutes,
    workersFilesRoutes: workerFilesRoutes
}

const userRouter = {
    usersAuthRoutes: userAuthRoutes,
    usersFilesRoutes: usersFilesRoutes,
    usersProfileRoutes: usersProfileRoutes,
    usersBookingRoutes: usersBookingRoutes
}

export {
    workerRouter,
    userRouter
}