import workerAuthRoutes from './workers/auth'
import workerPortfolioRoutes from './workers/portfolio'
import assetsUploadRoutes from './assets'
import workerSkillsRoutes from './workers/skills'
import clientAuthRoutes from './clients/auth'
import clientPortfolioRoutes from './clients/portfolio'
import clientSkillsRoutes from './clients/skills'
import googleRoutes from './google'
import workerProfileRoutes from './workers/profile'
import clientProfileRoutes from './clients/profile'

const workerRouter = {
    workersAuthRoutes: workerAuthRoutes,
    workersPortfolioRoutes: workerPortfolioRoutes,
    workersSkillsRoutes: workerSkillsRoutes,
}

const userRouter = {
    usersAuthRoutes: clientAuthRoutes,
    usersPortfolioRoutes: clientPortfolioRoutes,
    usersSkillsRoutes: clientSkillsRoutes,
    usersProfileRoutes: clientProfileRoutes,
}

const googleRouter = {
    googleRoutes: googleRoutes,
}

const workerProfileRouter = {
    workerProfileRoutes: workerProfileRoutes,
}

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
    userRouter,
    googleRouter,
    workerProfileRouter,
    // adminRouter
}