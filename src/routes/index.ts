import authRoutes from './workers/auth.js'
import profileRoutes from './workers/profile.js'
import portfolioRoutes from './workers/portfolio.js'
import filesRoutes from './workers/files.js'

const routes = {
    workersAuthRoutes: authRoutes,
    workersProfileRoutes: profileRoutes,
    workersPortfolioRoutes: portfolioRoutes,
    workersFilesRoutes: filesRoutes
}

export default routes