import workerAuthRoutes from './workers/auth'
import workerPortfolioRoutes from './workers/portfolio'
import assetsUploadRoutes from './assets'

const workerRouter = {
    workersAuthRoutes: workerAuthRoutes,
    workersPortfolioRoutes: workerPortfolioRoutes,
    // workersFilesRoutes: workerFilesRoutes,
    // workersSkillsRoutes: workerSkillsRoutes
}

// const userRouter = {
//     usersAuthRoutes: userAuthRoutes,
//     usersFilesRoutes: usersFilesRoutes,
//     usersProfileRoutes: usersProfileRoutes,
//     usersBookingRoutes: usersBookingRoutes,
//     usersSkillsRoutes: usersSkillsRoutes,
//     searchRoutes: searchRoutes
// }

// const adminRouter = {
//     adminAuthRoutes: adminAuthRoutes,
//     adminProfileRoutes: adminProfileRoutes,
//     adminSkillsRoutes: adminSkillsRoutes,
//     adminWorkersRoutes: adminWorkersRoutes
// }

const assetsRouter = {
    assetsRoutes: assetsUploadRoutes,
}

export {
    workerRouter,
    assetsRouter,
    // userRouter,
    // adminRouter
}