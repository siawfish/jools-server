import workerAuthRoutes from './workers/auth'
import workerPortfolioRoutes from './workers/portfolio'
import assetsUploadRoutes from './assets'
import workerSkillsRoutes from './workers/skills'
import clientAuthRoutes from './clients/auth'
import clientPortfolioRoutes from './clients/portfolio'
import clientSkillsRoutes from './clients/skills'

const workerRouter = {
    workersAuthRoutes: workerAuthRoutes,
    workersPortfolioRoutes: workerPortfolioRoutes,
    workersSkillsRoutes: workerSkillsRoutes,
}

const userRouter = {
    usersAuthRoutes: clientAuthRoutes,
    usersPortfolioRoutes: clientPortfolioRoutes,
    usersSkillsRoutes: clientSkillsRoutes,
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
    // adminRouter
}