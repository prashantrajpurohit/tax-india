import { AuthContext } from '@/config/contexts/auth-context'
import { useContext } from 'react'


export const useAuth = () => useContext(AuthContext)
