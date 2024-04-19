import authRoutes from './workers/auth.js'
import profileRoutes from './workers/profile.js'

const routes = {
    workersAuthRoutes: authRoutes,
    workersProfileRoutes: profileRoutes
}

export default routes