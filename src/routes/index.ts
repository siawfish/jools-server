import workerAuthRoutes from './workers/auth.js'
import userAuthRoutes from './users/auth.js'
import workerProfileRoutes from './workers/profile.js'
import portfolioRoutes from './workers/portfolio.js'
import workerFilesRoutes from './workers/files.js'
import usersFilesRoutes from './users/files.js'
import usersProfileRoutes from './users/profile.js'
import usersBookingRoutes from './users/bookings.js'
import adminAuthRoutes from './admin/auth.js'
import adminProfileRoutes from './admin/profile.js'
import adminSkillsRoutes from './admin/skills.js'
import workerSkillsRoutes from './workers/skills.js'
import usersSkillsRoutes from './users/skills.js'
import adminWorkersRoutes from './admin/workers.js'
import searchRoutes from './users/search.js'

const workerRouter = {
    workersAuthRoutes: workerAuthRoutes,
    workersProfileRoutes: workerProfileRoutes,
    workersPortfolioRoutes: portfolioRoutes,
    workersFilesRoutes: workerFilesRoutes,
    workersSkillsRoutes: workerSkillsRoutes
}

const userRouter = {
    usersAuthRoutes: userAuthRoutes,
    usersFilesRoutes: usersFilesRoutes,
    usersProfileRoutes: usersProfileRoutes,
    usersBookingRoutes: usersBookingRoutes,
    usersSkillsRoutes: usersSkillsRoutes,
    searchRoutes: searchRoutes
}

const adminRouter = {
    adminAuthRoutes: adminAuthRoutes,
    adminProfileRoutes: adminProfileRoutes,
    adminSkillsRoutes: adminSkillsRoutes,
    adminWorkersRoutes: adminWorkersRoutes
}

export {
    workerRouter,
    userRouter,
    adminRouter
}